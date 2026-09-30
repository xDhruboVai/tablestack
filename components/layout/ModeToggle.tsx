"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "@/lib/motion";

type Mode = "foh" | "boh";

/**
 * Front of house / Back of house switch.
 * BOH turns the whole site into a blueprint of itself: grid, component outlines, wireframes.
 */
export default function ModeToggle({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<Mode>("foh");

  useEffect(() => {
    setMode(document.documentElement.dataset.mode === "boh" ? "boh" : "foh");
    const sync = () => setMode(document.documentElement.dataset.mode === "boh" ? "boh" : "foh");
    window.addEventListener("ts:mode", sync);
    return () => window.removeEventListener("ts:mode", sync);
  }, []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Mode = mode === "boh" ? "foh" : "boh";
    const html = document.documentElement;

    const apply = () => {
      html.classList.add("no-trans");
      if (next === "boh") html.dataset.mode = "boh";
      else delete html.dataset.mode;
      try {
        localStorage.setItem("ts-mode", next);
      } catch {}
      flushSync(() => setMode(next));
      window.dispatchEvent(new Event("ts:mode"));
      requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove("no-trans")));
    };

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (!doc.startViewTransition || prefersReducedMotion()) {
      apply();
      return;
    }

    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = doc.startViewTransition(apply);
    t.ready.then(() => {
      html.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 820, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  const boh = mode === "boh";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={boh}
      aria-label="Dark mode: see how this site is built"
      title={boh ? "Back to the light view" : "Dark mode: see how this site is built"}
      className="mode-toggle group"
      data-compact={compact || undefined}
    >
      <span className="mode-toggle-track" aria-hidden="true">
        <span className="mode-toggle-thumb" />
        <span className={`mode-toggle-opt ${!boh ? "is-on" : ""}`}>
          {/* Sun: the light, front-of-house view */}
          <svg viewBox="0 0 24 24" className="mode-icon">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
          </svg>
        </span>
        <span className={`mode-toggle-opt ${boh ? "is-on" : ""}`}>
          {/* Moon: the dark, back-of-house view */}
          <svg viewBox="0 0 24 24" className="mode-icon">
            <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.6 6.6 0 0 0 10.7 10.7Z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
