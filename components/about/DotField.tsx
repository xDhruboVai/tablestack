"use client";

import { useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import { prefersReducedMotion, whenInView } from "@/lib/motion";

const COLS = 16;
const ROWS = 6;

/**
 * A quiet dot grid behind a block. Hovering the block (or tapping it) sends a ripple out
 * from that point; it ripples once from the centre the first time it scrolls into view.
 * The parent must be `position: relative`.
 */
export default function DotField() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const host = el?.parentElement;
    if (!el || !host || prefersReducedMotion()) return;
    const dots = el.querySelectorAll<HTMLElement>("i");

    const ripple = (from: number | "center") => {
      const opts = { grid: [COLS, ROWS] as [number, number], from };
      createTimeline().add(
        dots,
        {
          scale: [{ to: stagger([2.6, 1], opts) }, { to: 1 }],
          opacity: [{ to: stagger([0.95, 0.35], opts) }, { to: 0.14 }],
          duration: 420,
          ease: "inOutQuad",
        },
        stagger(26, opts),
      );
    };
    const fromPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const col = Math.min(COLS - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * COLS)));
      const row = Math.min(ROWS - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * ROWS)));
      ripple(row * COLS + col);
    };

    const stop = whenInView(host, () => ripple("center"), 0.5);
    host.addEventListener("pointerenter", fromPointer);
    host.addEventListener("pointerdown", fromPointer);
    return () => {
      stop();
      host.removeEventListener("pointerenter", fromPointer);
      host.removeEventListener("pointerdown", fromPointer);
    };
  }, []);

  return (
    <div ref={root} className="dot-field" aria-hidden="true">
      {Array.from({ length: COLS * ROWS }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}
