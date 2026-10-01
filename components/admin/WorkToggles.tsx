"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = { slug: string; title: string; kind: string; visible: boolean };

async function post(body: object) {
  try {
    const res = await fetch("/api/work-visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    return res.ok ? null : json.error || "Something went wrong.";
  } catch {
    return "Couldn’t reach the server. Check your connection.";
  }
}

/** The hidden work-admin page: a PIN gate, then one on/off switch per project. */
export default function WorkToggles({
  unlocked,
  pinReady,
  storageReady,
  items,
}: {
  unlocked: boolean;
  pinReady: boolean;
  storageReady: boolean;
  items: Item[];
}) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [state, setState] = useState(items);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!pinReady || !storageReady) {
    return (
      <div className="form-alert mt-10 max-w-[60ch]" role="status">
        <p className="font-medium">Not set up yet.</p>
        <p className="mt-1 text-fg-2">
          {!storageReady && "Storage isn’t connected (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are missing). "}
          {!pinReady && "No PIN is set (WORK_ADMIN_PIN is missing). "}
          Until then every project stays visible.
        </p>
      </div>
    );
  }

  if (!unlocked) {
    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      setBusy("pin");
      const err = await post({ pin });
      setBusy(null);
      setError(err);
      if (!err) router.refresh();
    };
    return (
      <form onSubmit={submit} className="mt-10 max-w-[22rem]" noValidate>
        <div className="field">
          <label htmlFor="wa-pin">PIN</label>
          <input
            id="wa-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "wa-pin-err" : undefined}
          />
          {error && (
            <p id="wa-pin-err" className="field-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <button type="submit" className="btn btn-primary mt-6" disabled={busy === "pin" || !pin}>
          {busy === "pin" ? "Checking" : "Unlock"}
        </button>
      </form>
    );
  }

  const toggle = async (slug: string) => {
    const current = state.find((i) => i.slug === slug)!;
    const next = !current.visible;
    setBusy(slug);
    setError(null);
    setState((s) => s.map((i) => (i.slug === slug ? { ...i, visible: next } : i)));
    const err = await post({ slug, visible: next });
    setBusy(null);
    if (err) {
      setState((s) => s.map((i) => (i.slug === slug ? { ...i, visible: !next } : i)));
      setError(err);
    } else {
      router.refresh();
    }
  };

  const shown = state.filter((i) => i.visible).length;

  return (
    <div className="mt-10 max-w-[44rem]">
      <p className="text-fg-2" aria-live="polite">
        {shown === 0
          ? "Every project is off. The Work page and its links are hidden."
          : `${shown} of ${state.length} ${state.length === 1 ? "project" : "projects"} showing.`}
      </p>
      <ul className="mt-6 border-t border-rule">
        {state.map((i) => (
          <li key={i.slug} className="flex items-center justify-between gap-6 border-b border-rule py-5">
            <div className="min-w-0">
              <p id={`wa-${i.slug}`} className="text-[clamp(1.25rem,1.8vw,1.6rem)] font-semibold tracking-[-0.025em]">
                {i.title}
              </p>
              <p className="mt-1 text-fg-2">{i.kind}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={i.visible}
              aria-labelledby={`wa-${i.slug}`}
              className="work-switch"
              disabled={busy !== null}
              onClick={() => toggle(i.slug)}
            >
              <span className="work-switch-thumb" aria-hidden="true" />
              <span className="work-switch-label">{i.visible ? "On" : "Off"}</span>
            </button>
          </li>
        ))}
      </ul>
      {error && (
        <p className="form-alert mt-6" role="alert">
          {error}
        </p>
      )}
      <p className="mt-6 text-[15px] text-muted">Changes save straight away and show on the site within a few seconds.</p>
    </div>
  );
}
