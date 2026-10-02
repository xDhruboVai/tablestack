"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, createTimeline, stagger, steps, utils } from "animejs";
import { inquiry, site } from "@/content/site";
import { EASE, prefersReducedMotion } from "@/lib/motion";

type Fields = {
  name: string;
  email: string;
  phone: string;
  business: string;
  needs: string[];
  budget: string;
  timeline: string;
  message: string;
  website: string; // honeypot
};
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: Fields = { name: "", email: "", phone: "", business: "", needs: [], budget: "", timeline: "", message: "", website: "" };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Tell us who we’re talking to.";
  if (!f.email.trim()) e.email = "We need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "That email doesn’t look right.";
  if (f.message.trim().length < 10) e.message = "A sentence or two about the project, please.";
  return e;
}

export default function ContactForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [ticket, setTicket] = useState<{ no: string; time: string; data: Fields } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    setF((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const toggleNeed = (n: string) =>
    set("needs", f.needs.includes(n) ? f.needs.filter((x) => x !== n) : [...f.needs, n]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      if (!prefersReducedMotion()) {
        const invalid = Object.keys(errs).map((k) => formRef.current!.querySelector(`[name="${k}"]`)).filter(Boolean);
        animate(invalid as HTMLElement[], {
          x: [0, -8, 7, -5, 3, 0],
          duration: 480,
          ease: "inOut(2)",
        });
      }
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      // A rejected fetch means no connection; don't show the browser's raw "Failed to fetch".
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      }).catch(() => {
        throw new Error("We couldn’t reach the server. Check your connection and try again.");
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong on our side.");
      const now = new Date();
      setTicket({
        no: String(Math.floor(1000 + Math.random() * 9000)),
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        data: f,
      });
      setStatus("sent");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  // Move focus to the server error so it is announced
  useEffect(() => {
    if (status === "error") document.getElementById(`${id}-server`)?.focus();
  }, [status, id]);

  if (status === "sent" && ticket) {
    return (
      <Ticket
        ticket={ticket}
        onReset={() => {
          setF(EMPTY);
          setTicket(null);
          setStatus("idle");
        }}
      />
    );
  }

  const field = (k: keyof Fields) => ({
    id: `${id}-${k}`,
    name: k,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined,
  });

  const Err = ({ k }: { k: keyof Fields }) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="field-error">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="contact-form" aria-describedby={`${id}-note`}>
      <p id={`${id}-note`} className="eyebrow text-muted">
        Takes about a minute. Fields marked * are required.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${id}-name`}>Your name *</label>
          <input {...field("name")} type="text" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <Err k="name" />
        </div>
        <div className="field">
          <label htmlFor={`${id}-email`}>Email *</label>
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <Err k="email" />
        </div>
        <div className="field">
          <label htmlFor={`${id}-phone`}>Contact number</label>
          <input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor={`${id}-business`}>Business name</label>
          <input {...field("business")} type="text" autoComplete="organization" value={f.business} onChange={(e) => set("business", e.target.value)} />
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="field-legend">What do you need?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {inquiry.needs.map((n) => (
              <label key={n} className="chip cursor-pointer">
                <input type="checkbox" className="sr-only" checked={f.needs.includes(n)} onChange={() => toggleNeed(n)} name="needs" value={n} />
                {n}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="sm:col-span-2">
          <legend className="field-legend">Budget</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {inquiry.budgets.map((b) => (
              <label key={b} className="chip cursor-pointer">
                <input type="radio" className="sr-only" name="budget" value={b} checked={f.budget === b} onChange={() => set("budget", b)} />
                {b}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field sm:col-span-2">
          <label htmlFor={`${id}-timeline`}>Timeline</label>
          <select {...field("timeline")} value={f.timeline} onChange={(e) => set("timeline", e.target.value)}>
            <option value="">Choose one</option>
            {inquiry.timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="field sm:col-span-2">
          <label htmlFor={`${id}-message`}>About the project *</label>
          <textarea
            {...field("message")}
            rows={5}
            value={f.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="What your business does, what you need, and anything we should know."
          />
          <Err k="message" />
        </div>

        {/* Honeypot - hidden from people, tempting to bots */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} />
        </div>
      </div>

      {status === "error" && (
        <div id={`${id}-server`} role="alert" tabIndex={-1} className="form-alert mt-8">
          <p className="font-medium">That didn’t send. {serverError}</p>
          <p className="mt-1 text-fg-2">
            Your message is still here. Try again, or email us directly at{" "}
            <a className="link-draw font-medium" href={`mailto:${site.email}?subject=${encodeURIComponent("New project")}&body=${encodeURIComponent(f.message)}`}>
              {site.email}
            </a>
            .
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? (
            <>
              Sending <span className="sending-dots" aria-hidden="true" />
            </>
          ) : (
            <>
              Send brief <span className="btn-arrow">→</span>
            </>
          )}
        </button>
        <p className="text-sm text-muted">{site.responseTime}</p>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {status === "sending" ? "Sending your message" : ""}
      </p>
    </form>
  );
}

/* ── Success state: a brief receipt prints ─────────────────── */
function Ticket({
  ticket,
  onReset,
}: {
  ticket: { no: string; time: string; data: Fields };
  onReset: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const paper = el.querySelector("[data-paper]")!;
    const rows = el.querySelectorAll("[data-row]");
    const stamp = el.querySelector("[data-stamp]")!;
    utils.set(rows, { opacity: 0 });
    utils.set(stamp, { opacity: 0, scale: 2.4, rotate: -14 });
    createTimeline({ defaults: { ease: EASE.out } })
      .add(paper, { y: ["-100%", "0%"], duration: 1500, ease: steps(14) })
      .add(rows, { opacity: [0, 1], duration: 1, delay: stagger(95) }, 60)
      .add(stamp, { opacity: [0, 1], scale: [2.4, 1], rotate: [-14, -8], duration: 420, ease: "outBack(1.6)" }, "+=80")
      .add(el.querySelectorAll("[data-after]"), { opacity: [0, 1], y: [12, 0], duration: 700, delay: stagger(80) }, "-=100");
  }, []);

  const d = ticket.data;
  const line = "- - - - - - - - - - - - - - - - - - -";
  const rows: [string, string][] = [
    ["BUSINESS", d.business || "n/a"],
    ["NAME", d.name],
    ["PHONE", d.phone || "n/a"],
    ["NEEDS", d.needs.length ? d.needs.join(", ") : "Tell us on the call"],
    ["BUDGET", d.budget || "TBD"],
    ["TIMING", d.timeline || "TBD"],
  ];

  return (
    <div ref={root} className="ticket-wrap" role="status">
      <h2 ref={heading} tabIndex={-1} className="display text-[clamp(2.6rem,5vw,4.6rem)] outline-none">
        Brief received.
      </h2>
      <p className="body-lg mt-3 max-w-[40ch]" data-after>
        Thanks, {d.name.split(" ")[0]}. We’ve got your note. {site.responseTime}
      </p>

      <div className="ticket-printer mt-10" aria-hidden="true" />
      <div className="ticket-clip">
        <div className="ticket" data-paper>
          <p data-row className="text-center font-bold">TABLESTACK · PROJECT BRIEF</p>
          <p data-row className="mt-2 flex justify-between">
            <span>BRIEF #{ticket.no}</span>
            <span>{ticket.time}</span>
          </p>
          <p data-row className="my-2 overflow-hidden whitespace-nowrap opacity-50">{line}</p>
          {rows.map(([k, v]) => (
            <p data-row key={k} className="grid grid-cols-[72px_1fr] gap-2 py-0.5">
              <span className="opacity-60">{k}</span>
              <span className="break-words">{v}</span>
            </p>
          ))}
          <p data-row className="my-2 overflow-hidden whitespace-nowrap opacity-50">{line}</p>
          <p data-row className="grid grid-cols-[72px_1fr] gap-2">
            <span className="opacity-60">NOTE</span>
            <span className="break-words">“{d.message.slice(0, 120)}{d.message.length > 120 ? "…" : ""}”</span>
          </p>
          <p data-row className="my-2 overflow-hidden whitespace-nowrap opacity-50">{line}</p>
          <p data-row className="text-center">** WE’LL BE IN TOUCH **</p>
          <span data-stamp className="ticket-stamp">
            Sent
          </span>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3" data-after>
        <button type="button" onClick={onReset} className="btn btn-ghost">
          Send another
        </button>
        <a href={`mailto:${site.email}`} className="btn btn-ghost">
          Email us instead
        </a>
      </div>
    </div>
  );
}
