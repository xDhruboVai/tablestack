import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { projects, type Project } from "@/content/projects";

/**
 * Which projects are shown on the site. The on/off state lives in a Supabase table
 * (`project_visibility`: slug, visible) and is switched from the admin page.
 *
 * Server only: it uses the configured Supabase key. If storage isn't configured or can't be reached,
 * every project is shown, so a storage problem never empties the site.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
const USERNAME = process.env.WORK_ADMIN_USERNAME?.trim();
const PASSWORD = process.env.WORK_ADMIN_PASSWORD?.trim();

// The admin page's address: letters, numbers and dashes only. WORK_ADMIN_PATH overrides the built-in one,
// which is used when the setting is missing or malformed. (Anyone who can read this code can read that
// built-in address, so set WORK_ADMIN_PATH if the code is ever shared.)
const DEFAULT_DOOR = "91839012381290381";
const DOOR = process.env.WORK_ADMIN_PATH?.trim().toLowerCase() ?? "";
export const ADMIN_PATH = /^[a-z0-9][a-z0-9-]{2,63}$/.test(DOOR) ? DOOR : DEFAULT_DOOR;

export const VISIBILITY_TAG = "work-visibility";
export const ADMIN_COOKIE = "ts_work_admin";
export const storageReady = Boolean(URL && KEY);
export const adminLoginReady = Boolean(USERNAME && PASSWORD);

const key = KEY ?? "";
const headers = () => ({ apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" });

/** Slugs that are switched off. `fresh` skips the cache (used by the admin page). */
export async function getHiddenSlugs(fresh = false): Promise<Set<string>> {
  if (!storageReady) return new Set();
  try {
    const res = await fetch(URL + "/rest/v1/project_visibility?select=slug,visible", {
      headers: headers(),
      ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 300, tags: [VISIBILITY_TAG] } }),
    });
    if (!res.ok) return new Set();
    const rows = (await res.json()) as { slug: string; visible: boolean }[];
    return new Set(rows.filter((r) => r.visible === false).map((r) => r.slug));
  } catch {
    return new Set();
  }
}

/** The projects currently switched on, in their normal order. */
export async function getVisibleProjects(): Promise<Project[]> {
  const hidden = await getHiddenSlugs();
  return projects.filter((p) => !hidden.has(p.slug));
}

/** A single shared rule: if at least one project is visible, the Work page and Work links stay live. */
export async function hasVisibleProjects(): Promise<boolean> {
  return (await getVisibleProjects()).length > 0;
}

/**
 * Saves one project's state. Returns an error message for the admin page, or null on success.
 * Writing should use SUPABASE_SERVICE_ROLE_KEY, with the table closed to public writes
 * (see supabase/migrations). The public key is only a fallback for reading.
 */
export async function setVisibility(slug: string, visible: boolean): Promise<string | null> {
  if (!storageReady) return "Storage isn't connected yet.";
  if (!projects.some((p) => p.slug === slug)) return "Unknown project.";
  try {
    const res = await fetch(URL + "/rest/v1/project_visibility?on_conflict=slug", {
      method: "POST",
      headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ slug, visible, updated_at: new Date().toISOString() }),
      cache: "no-store",
    });
    return res.ok ? null : "Couldn't save. Check that the table exists.";
  } catch {
    return "Couldn't reach storage.";
  }
}

/** How long a sign-in lasts. */
export const ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 30;

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

// The signing key comes from the credentials, so changing the password signs everyone out.
const sessionKey = () => createHash("sha256").update((USERNAME ?? "") + ":" + (PASSWORD ?? "") + ":" + (KEY ?? "") + ":work-admin").digest();
const sign = (expires: string) => createHmac("sha256", sessionKey()).update(expires).digest("hex");

/**
 * The value kept in the admin cookie: the time the sign-in ends, plus a signature only this server can
 * make. The credentials themselves are never stored in the browser, and an old cookie stops working
 * on its own even if someone copies it.
 */
export const adminToken = () => {
  const expires = String(Date.now() + ADMIN_SESSION_SECONDS * 1000);
  return expires + "." + sign(expires);
};

export const adminCredentialsMatch = (inputUsername: string, inputPassword: string) => {
  if (!adminLoginReady) return false;
  // Hashes are compared, so the check takes the same time whatever was typed.
  const digest = (v: string) => createHash("sha256").update(v).digest("hex");
  const usernameOk = same(digest(inputUsername.trim()), digest(USERNAME ?? ""));
  const passwordOk = same(digest(inputPassword), digest(PASSWORD ?? ""));
  return usernameOk && passwordOk;
};

export const cookieIsValid = (value: string | undefined) => {
  if (!adminLoginReady || typeof value !== "string" || value.length > 200) return false;
  const [expires, signature, ...rest] = value.split(".");
  if (!expires || !signature || rest.length || !/^\d{13,16}$/.test(expires) || Number(expires) < Date.now()) return false;
  return same(signature, sign(expires));
};
