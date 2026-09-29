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
      aria-label="Back of house mode: see how this site is built"
      title="See how this site is built"
      className="mode-toggle group"
      data-compact={compact || undefined}
    >
      <span className="mode-toggle-track" aria-hidden="true">
        <span className="mode-toggle-thumb" />
        <span className={`mode-toggle-opt ${!boh ? "is-on" : ""}`}>FOH</span>
        <span className={`mode-toggle-opt ${boh ? "is-on" : ""}`}>BOH</span>
      </span>
    </button>
  );
}
