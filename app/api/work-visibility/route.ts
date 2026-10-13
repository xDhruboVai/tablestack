import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, VISIBILITY_TAG, adminCredentialsMatch, adminLoginReady, adminToken, cookieIsValid, setVisibility } from "@/lib/visibility";
import { clientOf, createLimiter, readJson, sameOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

const headers = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers });
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The largest real request is a username and password.
const MAX_BODY_BYTES = 2 * 1024;
const MAX_FIELD = 200;
// Slows down password guessing: five wrong sign-ins from one address, then that address waits fifteen minutes.
const signIns = createLimiter(5, 15 * 60 * 1000);

/**
 * Actions for the admin page:
 *   { username, password }  checks credentials and sets the admin cookie
 *   { signOut: true }       removes the admin cookie
 *   { slug, visible }      switches one project on or off (needs the cookie)
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return reply({ error: "Bad request." }, 403);

  const body = await readJson<{ username?: unknown; password?: unknown; slug?: unknown; visible?: unknown; signOut?: unknown }>(req, MAX_BODY_BYTES);
  if (!body) return reply({ error: "Bad request." }, 400);
  const jar = await cookies();

  if (body.signOut === true) {
    jar.delete(ADMIN_COOKIE);
    return reply({ ok: true });
  }

  if (typeof body.username === "string" && typeof body.password === "string") {
    if (!adminLoginReady) return reply({ error: "No admin credentials are set on the server." }, 503);
    const client = clientOf(req);
    if (signIns.blocked(client)) return reply({ error: "Too many tries. Wait 15 minutes and try again." }, 429);
    const tooLong = body.username.length > MAX_FIELD || body.password.length > MAX_FIELD;
    if (tooLong || !adminCredentialsMatch(body.username, body.password)) {
      signIns.hit(client);
      await wait(900);
      return reply({ error: "Wrong username or password." }, 401);
    }
    signIns.clear(client);
    jar.set(ADMIN_COOKIE, adminToken(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ADMIN_SESSION_SECONDS,
    });
    return reply({ ok: true });
  }

  if (!cookieIsValid(jar.get(ADMIN_COOKIE)?.value)) return reply({ error: "Sign in first." }, 401);
  if (typeof body.slug !== "string" || body.slug.length > MAX_FIELD || typeof body.visible !== "boolean") return reply({ error: "Bad request." }, 400);

  const error = await setVisibility(body.slug, body.visible);
  if (error) return reply({ error }, 500);

  revalidateTag(VISIBILITY_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return reply({ ok: true });
}
