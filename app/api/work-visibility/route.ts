import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { ADMIN_COOKIE, VISIBILITY_TAG, adminCredentialsMatch, adminLoginReady, adminToken, cookieIsValid, setVisibility } from "@/lib/visibility";

export const dynamic = "force-dynamic";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Slows down password guessing: after MAX_FAILS wrong sign-ins from one address, that address waits out the window.
 * Kept in memory, so it is per server instance. It limits a burst of guesses; it is not a full lockout.
 */
const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const fails = new Map<string, { count: number; until: number }>();
const clientOf = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
const blocked = (client: string) => {
  const f = fails.get(client);
  if (f && f.until <= Date.now()) fails.delete(client);
  return (fails.get(client)?.count ?? 0) >= MAX_FAILS;
};
const recordFail = (client: string) => {
  if (fails.size > 5000) fails.clear();
  const f = fails.get(client);
  fails.set(client, { count: (f?.count ?? 0) + 1, until: Date.now() + WINDOW_MS });
};

/**
 * Actions for the admin page:
 *   { username, password }  checks credentials and sets the admin cookie
 *   { slug, visible }      switches one project on or off (needs the cookie)
 */
export async function POST(req: Request) {
  let body: { username?: unknown; password?: unknown; slug?: unknown; visible?: unknown; pin?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400, headers: noindex });
  }
  const jar = await cookies();

  if (typeof body.username === "string" && typeof body.password === "string") {
    if (!adminLoginReady) return NextResponse.json({ error: "No admin credentials are set on the server." }, { status: 503, headers: noindex });
    const client = clientOf(req);
    if (blocked(client)) {
      return NextResponse.json({ error: "Too many tries. Wait 15 minutes and try again." }, { status: 429, headers: noindex });
    }
    if (!adminCredentialsMatch(body.username, body.password)) {
      recordFail(client);
      await wait(900);
      return NextResponse.json({ error: "Wrong username or password." }, { status: 401, headers: noindex });
    }
    fails.delete(client);
    jar.set(ADMIN_COOKIE, adminToken(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    });
    return NextResponse.json({ ok: true }, { headers: noindex });
  }

  if (!cookieIsValid(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401, headers: noindex });
  }
  if (typeof body.slug !== "string" || typeof body.visible !== "boolean") {
    return NextResponse.json({ error: "Bad request." }, { status: 400, headers: noindex });
  }

  const error = await setVisibility(body.slug, body.visible);
  if (error) return NextResponse.json({ error }, { status: 500, headers: noindex });

  revalidateTag(VISIBILITY_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true }, { headers: noindex });
}
