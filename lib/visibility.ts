import { createHash, timingSafeEqual } from "node:crypto";
import { projects, type Project } from "@/content/projects";

/**
 * Which projects are shown on the site. The on/off state lives in a Supabase table
 * (`project_visibility`: slug, visible) and is switched from the hidden admin page.
 *
 * Server only: it uses the secret service key. If storage isn't configured or can't be reached,
 * every project is shown, so a storage problem never empties the site.
 */

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PIN = process.env.WORK_ADMIN_PIN;

export const VISIBILITY_TAG = "work-visibility";
export const ADMIN_COOKIE = "ts_work_admin";
export const storageReady = Boolean(URL && KEY);
export const pinReady = Boolean(PIN);

const headers = () => ({ apikey: KEY!, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" });

/** Slugs that are switched off. `fresh` skips the cache (used by the admin page). */
export async function getHiddenSlugs(fresh = false): Promise<Set<string>> {
  if (!storageReady) return new Set();
  try {
    const res = await fetch(`${URL}/rest/v1/project_visibility?select=slug,visible`, {
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

/** Saves one project's state. Returns an error message for the admin page, or null on success. */
export async function setVisibility(slug: string, visible: boolean): Promise<string | null> {
  if (!storageReady) return "Storage isn’t connected yet.";
  if (!projects.some((p) => p.slug === slug)) return "Unknown project.";
  try {
    const res = await fetch(`${URL}/rest/v1/project_visibility?on_conflict=slug`, {
      method: "POST",
      headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ slug, visible, updated_at: new Date().toISOString() }),
      cache: "no-store",
    });
    return res.ok ? null : "Couldn’t save. Check that the table exists.";
  } catch {
    return "Couldn’t reach storage.";
  }
}

/** The value kept in the admin cookie: a hash, so the PIN itself is never stored in the browser. */
export const adminToken = () => createHash("sha256").update(`${PIN}:${KEY ?? ""}:work-admin`).digest("hex");

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const pinMatches = (pin: string) => pinReady && same(pin, PIN!);
export const cookieIsValid = (value: string | undefined) => pinReady && Boolean(value) && same(value!, adminToken());
