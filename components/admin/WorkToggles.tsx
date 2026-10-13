"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = { slug: string; title: string; kind: string; concept: boolean; visible: boolean };

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

/** The card on the admin page: a sign-in form, then one on/off switch per project. */
export default function WorkToggles({
  unlocked,
  loginReady,
  storageReady,
  items,
}: {
  unlocked: boolean;
  loginReady: boolean;
  storageReady: boolean;
  items: Item[];
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState(items);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!loginReady || !storageReady) {
    return (
      <>
        <p className="eyebrow text-accent">Setup needed</p>
        <h2 className="display mt-3">Not connected yet.</h2>
        <div className="form-alert mt-8" role="status">
          <p className="text-fg-2">
            {!storageReady && "Storage isn’t connected (NEXT_PUBLIC_SUPABASE_URL and a project key are missing). "}
            {!loginReady && "No admin credentials are set (WORK_ADMIN_USERNAME and WORK_ADMIN_PASSWORD are missing). "}
            Until then every project stays visible.
          </p>
        </div>
      </>
    );
  }

  if (!unlocked) {
    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      setBusy("login");
      const err = await post({ username: username.trim(), password });
      setBusy(null);
      setError(err);
      if (!err) router.refresh();
    };
    return (
      <>
        <p className="eyebrow text-accent">Team only</p>
        <h2 className="display mt-3">Sign in</h2>
        <form onSubmit={submit} className="contact-brief-form" noValidate>
          <div className="contact-brief-fields">
            <div className="field contact-brief-wide">
              <label htmlFor="wa-username">Username</label>
              <input
                id="wa-username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "wa-login-err" : undefined}
              />
            </div>
            <div className="field contact-brief-wide">
              <label htmlFor="wa-password">Password</label>
              <input
                id="wa-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "wa-login-err" : undefined}
              />
            </div>
          </div>
          {error && (
            <p id="wa-login-err" className="form-alert mt-6" role="alert">
              {error}
            </p>
          )}
          <div className="contact-brief-actions">
            <button type="submit" className="btn btn-primary" disabled={busy === "login" || !username || !password} aria-busy={busy === "login"}>
              {busy === "login" ? "Checking…" : "Sign in"} <span className="btn-arrow" aria-hidden="true">→</span>
            </button>
            <p>You stay signed in on this device for 30 days.</p>
          </div>
        </form>
      </>
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
    <>
      <div className="admin-card-head">
        <div>
          <p className="eyebrow text-accent">Signed in</p>
          <h2 className="display mt-3">Projects</h2>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={busy !== null}
          onClick={async () => {
            setBusy("signout");
            const err = await post({ signOut: true });
            setBusy(null);
            setError(err);
            if (!err) router.refresh();
          }}
        >
          Sign out
        </button>
      </div>
      <p className="admin-count" aria-live="polite">
        {shown === 0 ? "Every project is off. The Work page and its links are hidden." : `${shown} of ${state.length} ${state.length === 1 ? "project is" : "projects are"} showing.`}
      </p>
      <ul className="admin-list">
        {state.map((i) => (
          <li key={i.slug} className="admin-row" data-on={i.visible || undefined}>
            <div className="min-w-0">
              <p id={`wa-${i.slug}`} className="admin-row-title">
                {i.title}
                {i.concept && <span className="concept-tag">Concept</span>}
              </p>
              <p className="admin-row-kind">{i.kind}</p>
            </div>
            <button type="button" role="switch" aria-checked={i.visible} aria-labelledby={`wa-${i.slug}`} className="work-switch" disabled={busy !== null} onClick={() => toggle(i.slug)}>
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
      <p className="admin-foot">Changes save straight away and show on the site within a few seconds.</p>
    </>
  );
}
