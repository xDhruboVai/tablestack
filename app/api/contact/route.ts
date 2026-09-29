import { NextResponse } from "next/server";

/**
 * Contact form endpoint.
 * Forwards validated inquiries to a Google Apps Script webhook, which writes
 * the lead to Sheets and sends the notification/confirmation emails.
 */

type Body = {
  name?: string;
  email?: string;
  business?: string;
  needs?: string[];
  budget?: string;
  timeline?: string;
  message?: string;
  website?: string;
};

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → pretend success, drop silently.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const data = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    business: clean(body.business, 200),
    needs: Array.isArray(body.needs) ? body.needs.map((n) => clean(n, 60)).filter(Boolean).slice(0, 8) : [],
    budget: clean(body.budget, 60),
    timeline: clean(body.timeline, 60),
    message: clean(body.message, 5000),
  };

  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email) || data.message.length < 10) {
    return NextResponse.json({ error: "Please check the highlighted fields." }, { status: 422 });
  }

  const { GOOGLE_SHEETS_WEBHOOK_URL, GOOGLE_SHEETS_WEBHOOK_SECRET } = process.env;

  if (!GOOGLE_SHEETS_WEBHOOK_URL || !GOOGLE_SHEETS_WEBHOOK_SECRET) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] (dev, not delivered to Google Sheets)", data);
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ error: "The form isn’t connected yet." }, { status: 503 });
  }

  try {
    const res = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: GOOGLE_SHEETS_WEBHOOK_SECRET, ...data }),
    });

    if (!res.ok) {
      console.error("[contact] Google Sheets webhook failed", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ error: "Delivery failed." }, { status: 502 });
    }

    const result: unknown = await res.json().catch(() => null);
    if (!result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
      console.error("[contact] Google Sheets webhook returned an invalid response", result);
      return NextResponse.json({ error: "Delivery failed." }, { status: 502 });
    }
  } catch (error) {
    console.error("[contact] Google Sheets webhook request failed", error);
    return NextResponse.json({ error: "Delivery failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
