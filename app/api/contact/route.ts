import { NextResponse } from "next/server";

/**
 * Contact form endpoint.
 * Delivers via Resend when RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are set (see .env.example).
 * In development without keys it logs the inquiry and succeeds, so the UI can be tested.
 * In production without keys it returns 503 so the form shows its error state (with the email fallback).
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
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

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

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] (dev, not delivered)", data);
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ error: "The form isn’t connected yet." }, { status: 503 });
  }

  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Business", data.business || "n/a"],
    ["Needs", data.needs.join(", ") || "n/a"],
    ["Budget", data.budget || "n/a"],
    ["Timeline", data.timeline || "n/a"],
  ];
  const html = `<h2>New project inquiry</h2><table>${rows
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escape(v)}</td></tr>`)
    .join("")}</table><p>${escape(data.message).replace(/\n/g, "<br>")}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject: `New project: ${data.business || data.name}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[contact] delivery failed", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Delivery failed." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
