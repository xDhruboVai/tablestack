"use client";

import { useId, useRef, useState } from "react";
import { site } from "@/content/site";

type Fields = { name: string; email: string; business: string; message: string; website: string };
type FieldName = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent" | "preview" | "error";

const empty: Fields = { name: "", email: "", business: "", message: "", website: "" };

function validate(fields: Fields): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!fields.name.trim()) errors.name = "Please add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim())) errors.email = "Please add a valid email.";
  if (fields.message.trim().length < 10) errors.message = "Please write a sentence or two about the project.";
  return errors;
}

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const id = useId();

  function update(key: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === "error" || status === "preview") setStatus("idle");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setServerError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We couldn’t send your note. Please try again.");
      setStatus(result.delivered === true ? "sent" : "preview");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "We couldn’t send your note. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="contact-confirmation" role="status">
        <span className="contact-confirmation-mark" aria-hidden="true">✓</span>
        <h3>Brief received.</h3>
        <p>Thanks for writing, {fields.name.trim().split(" ")[0]}. We’ll reply to discuss scope and next steps.</p>
        <button type="button" className="btn btn-ghost mt-8" onClick={() => { setFields(empty); setStatus("idle"); }}>
          Send another brief
        </button>
      </div>
    );
  }

  const inputProps = (key: FieldName) => ({
    id: `${id}-${key}`,
    name: key,
    "aria-invalid": errors[key] ? true as const : undefined,
    "aria-describedby": errors[key] ? `${id}-${key}-error` : undefined,
  });

  return (
    <form ref={form} onSubmit={submit} noValidate className="contact-brief-form">
      <div className="contact-brief-fields">
        <div className="field">
          <label htmlFor={`${id}-name`}>Your name <span aria-hidden="true">*</span></label>
          <input {...inputProps("name")} type="text" autoComplete="name" placeholder="Your name" value={fields.name} onChange={(event) => update("name", event.target.value)} required />
          {errors.name && <p id={`${id}-name-error`} className="field-error">{errors.name}</p>}
        </div>
        <div className="field">
          <label htmlFor={`${id}-email`}>Email <span aria-hidden="true">*</span></label>
          <input {...inputProps("email")} type="email" autoComplete="email" inputMode="email" placeholder="you@business.com" value={fields.email} onChange={(event) => update("email", event.target.value)} required />
          {errors.email && <p id={`${id}-email-error`} className="field-error">{errors.email}</p>}
        </div>
        <div className="field contact-brief-wide">
          <label htmlFor={`${id}-business`}>Business or project <span className="text-muted">(optional)</span></label>
          <input id={`${id}-business`} name="business" type="text" autoComplete="organization" placeholder="Name of your business" value={fields.business} onChange={(event) => update("business", event.target.value)} />
        </div>
        <div className="field contact-brief-wide">
          <label htmlFor={`${id}-message`}>What should the site or tool do? <span aria-hidden="true">*</span></label>
          <textarea {...inputProps("message")} rows={5} placeholder="A sentence or two is enough." value={fields.message} onChange={(event) => update("message", event.target.value)} required />
          {errors.message && <p id={`${id}-message-error`} className="field-error">{errors.message}</p>}
        </div>
      </div>

      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={(event) => update("website", event.target.value)} />
      </div>

      {status === "error" && <p className="form-alert mt-6" role="alert">{serverError} Your message is still here. You can also email <a className="inline-link" href={`mailto:${site.email}`}>{site.email}</a>.</p>}
      {status === "preview" && <p className="form-alert mt-6" role="status">This local preview did not deliver your note. The form will send once its live connection is configured.</p>}

      <div className="contact-brief-actions">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send brief"} <span className="btn-arrow" aria-hidden="true">↗</span>
        </button>
        <p>Fields marked * are required.</p>
      </div>
    </form>
  );
}
