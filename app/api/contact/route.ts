import { NextResponse } from "next/server";
import { clientOf, createLimiter, multiLine, oneLine, readJson, sameOrigin, sheetSafe } from "@/lib/security";

/**
 * Contact form endpoint.
 * Forwards validated inquiries to a Google Apps Script webhook, which writes
 * the lead to Sheets and sends the notification/confirmation emails.
 */

type Body = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  business?: unknown;
  needs?: unknown;
  budget?: unknown;
  timeline?: unknown;
  message?: unknown;
  website?: unknown;
};

// The form sends a few short fields and one message of up to 5,000 characters.
const MAX_BODY_BYTES = 32 * 1024;
// One address can send five briefs in ten minutes.
const limiter = createLimiter(5, 10 * 60 * 1000);
// Starts with a letter or digit, so a spreadsheet can't read the address as a formula.
const EMAIL = /^[a-z0-9][^\s@]*@[^\s@]+\.[^\s@]{2,}$/i;

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Please send the form from the website." }, { status: 403 });

  const body = await readJson<Body>(req, MAX_BODY_BYTES);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot filled → pretend success, drop silently.
  if (oneLine(body.website, 200)) return NextResponse.json({ ok: true });

  const data = {
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
  };

  if (!data.name || !EMAIL.test(data.email) || data.message.length < 10) {
    return NextResponse.json({ error: "Please check the highlighted fields." }, { status: 422 });
  }

  const client = clientOf(req);
  if (limiter.blocked(client)) {
    return NextResponse.json({ error: "That’s a lot of messages in a short time. Please wait a few minutes, or email us directly." }, { status: 429 });
  }
  limiter.hit(client);

  const { GOOGLE_SHEETS_WEBHOOK_URL, GOOGLE_SHEETS_WEBHOOK_SECRET } = process.env;

  if (!GOOGLE_SHEETS_WEBHOOK_URL || !GOOGLE_SHEETS_WEBHOOK_SECRET) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] (dev, not delivered to Google Sheets)", data);
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

  try {
    const res = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: GOOGLE_SHEETS_WEBHOOK_SECRET, ...row }),
      // Don't leave the visitor waiting if the spreadsheet service hangs.
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      console.error("[contact] Google Sheets webhook failed", res.status);
      return NextResponse.json({ error: "Delivery failed." }, { status: 502 });
    }

    const result: unknown = await res.json().catch(() => null);
    if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
      console.error("[contact] Google Sheets webhook returned an invalid response");
      return NextResponse.json({ error: "Delivery failed." }, { status: 502 });
    }
  } catch (error) {
    console.error("[contact] Google Sheets webhook request failed", error instanceof Error ? error.name : "unknown error");
    return NextResponse.json({ error: "Delivery failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
