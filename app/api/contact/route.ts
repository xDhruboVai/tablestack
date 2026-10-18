import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { addOns, addOnsLabel, hrTiers, packageLabel, plans, REGION_COOKIE, regionOf } from "@/content/pricing";
import { clientOf, createLimiter, multiLine, oneLine, readJson, sameOrigin, sheetSafe } from "@/lib/security";

/**
 * Contact form endpoint.
 * Saves validated inquiries to two stores: a Google Apps Script webhook (writes the lead to Sheets and
 * sends the notification/confirmation emails) and the Supabase `inquiries` table.
 */

type Body = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  business?: unknown;
  needs?: unknown;
  budget?: unknown;
  timeline?: unknown;
  plan?: unknown;
  tier?: unknown;
  addons?: unknown;
  message?: unknown;
  website?: unknown;
};

// The form sends a few short fields and one message of up to 5,000 characters.
const MAX_BODY_BYTES = 32 * 1024;
// One address can send five briefs in ten minutes.
const limiter = createLimiter(5, 10 * 60 * 1000);
// Starts with a letter or digit, so a spreadsheet can't read the address as a formula.
const EMAIL = /^[a-z0-9][^\s@]*@[^\s@]+\.[^\s@]{2,}$/i;

type Inquiry = {
  name: string;
  email: string;
  phone: string;
  business: string;
  needs: string[];
  budget: string;
  timeline: string;
  message: string;
  plan: string;
  tier: string;
  package: string;
  addons: string[];
  addonsLabel: string;
  country: string;
  currency: string;
};

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Please send the form from the website." }, { status: 403 });

  const body = await readJson<Body>(req, MAX_BODY_BYTES);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot filled → pretend success, drop silently.
  if (oneLine(body.website, 200)) return NextResponse.json({ ok: true });

  // Only known package ids are kept; the HR level only with the HR package.
  const plan = plans.find((p) => p.id === body.plan)?.id ?? "";
  const tier = plan === "hr" ? (hrTiers.find((t) => t.id === body.tier)?.id ?? "") : "";
  const addons = addOns.filter((a) => Array.isArray(body.addons) && body.addons.includes(a.id)).map((a) => a.id);
  // Vercel's IP lookup of the visitor's country, and the currency they saw (their pick on /pricing wins).
  const country = oneLine(req.headers.get("x-vercel-ip-country"), 2).toUpperCase();
  const region = regionOf(country, (await cookies()).get(REGION_COOKIE)?.value);

  const data: Inquiry = {
    name: oneLine(body.name, 120),
    email: oneLine(body.email, 200),
    phone: oneLine(body.phone, 60).replace(/[^0-9+() -]/g, ""),
    business: oneLine(body.business, 200),
    needs: Array.isArray(body.needs)
      ? body.needs
          .map((n) => oneLine(n, 60))
          .filter(Boolean)
          .slice(0, 8)
      : [],
    budget: oneLine(body.budget, 60),
    timeline: oneLine(body.timeline, 60),
    message: multiLine(body.message, 5000),
    plan,
    tier,
    package: packageLabel(plan, tier, region),
    addons,
    addonsLabel: addOnsLabel(addons, region),
    country,
    currency: region === "bd" ? "BDT" : "USD",
  };

  if (!data.name || !EMAIL.test(data.email) || data.message.length < 10) {
    return NextResponse.json({ error: "Please check the highlighted fields." }, { status: 422 });
  }

  const client = clientOf(req);
  if (limiter.blocked(client)) {
    return NextResponse.json({ error: "That’s a lot of messages in a short time. Please wait a few minutes, or email us directly." }, { status: 429 });
  }
  limiter.hit(client);

  const { GOOGLE_SHEETS_WEBHOOK_URL, GOOGLE_SHEETS_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sheetsReady = Boolean(GOOGLE_SHEETS_WEBHOOK_URL && GOOGLE_SHEETS_WEBHOOK_SECRET);
  const databaseReady = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

  if (!sheetsReady && !databaseReady) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] (dev, not delivered)", data);
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ error: "The form isn’t connected yet." }, { status: 503 });
  }

  // Free-text fields go into a spreadsheet, so none of them may start like a formula.
  const row = {
    ...data,
    name: sheetSafe(data.name),
    business: sheetSafe(data.business),
    needs: data.needs.map(sheetSafe),
    budget: sheetSafe(data.budget),
    timeline: sheetSafe(data.timeline),
    message: sheetSafe(data.message),
  };

  // Two independent stores. The inquiry counts as received when at least one of them saved it.
  const results = await Promise.all([
    sheetsReady && toSheets(GOOGLE_SHEETS_WEBHOOK_URL!, GOOGLE_SHEETS_WEBHOOK_SECRET!, row),
    databaseReady && toDatabase(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, data),
  ]);
  if (!results.includes(true)) return NextResponse.json({ error: "Delivery failed." }, { status: 502 });

  return NextResponse.json({ ok: true, delivered: true });
}

/** The Google Apps Script webhook writes the lead to the sheet and sends the notification/confirmation emails. */
async function toSheets(url: string, secret: string, row: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, ...row }),
      // Don't leave the visitor waiting if the spreadsheet service hangs. Apps Script can take ~13 s to start after a redeploy.
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      console.error("[contact] Google Sheets webhook failed", res.status);
      return false;
    }

    const result: unknown = await res.json().catch(() => null);
    if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
      console.error("[contact] Google Sheets webhook returned an invalid response");
      return false;
    }
    return true;
  } catch (error) {
    console.error("[contact] Google Sheets webhook request failed", error instanceof Error ? error.name : "unknown error");
    return false;
  }
}

/** Supabase table `inquiries` (supabase/migrations). Only the service-role key may write to it. */
async function toDatabase(url: string, key: string, data: Inquiry): Promise<boolean> {
  const { addonsLabel, ...record } = data;
  try {
    const res = await fetch(url + "/rest/v1/inquiries", {
      method: "POST",
      headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        ...record,
        plan: data.plan || null,
        tier: data.tier || null,
        package: data.package || null,
        addons_label: addonsLabel || null,
        country: data.country || null,
      }),
      signal: AbortSignal.timeout(12_000),
      cache: "no-store",
    });
    if (!res.ok) console.error("[contact] Supabase insert failed", res.status);
    return res.ok;
  } catch (error) {
    console.error("[contact] Supabase insert request failed", error instanceof Error ? error.name : "unknown error");
    return false;
  }
}
