"use client";

import { useEffect, useRef, useState } from "react";
import { animate, utils } from "animejs";
import { pillars } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

const ITEMS = pillars.map((p) => ({ name: p.title, note: p.summary }));
const INTERVAL = 2600;

/** One block of the wireframe: position and size in the 200 x 130 frame, plus its tone. */
type Block = [x: number, y: number, w: number, h: number, tone?: "a" | "s"];
const row = (n: number, f: (i: number) => Block) => Array.from({ length: n }, (_, i) => f(i));

/**
 * A picture for each area, in the same order as ITEMS. The blocks morph from one layout to
 * the next; "a" is the accent block, "s" a stronger grey, the rest faint.
 */
const LAYOUTS: Block[][] = [
  // Web & digital: a web page with headline, copy, button, image and a footer band
  [[12, 28, 104, 10, "a"], [12, 44, 84, 5], [12, 53, 92, 5], [12, 62, 70, 5], [12, 74, 38, 11, "s"], [128, 28, 60, 57], [12, 96, 176, 24]],
  // Data & databases: three linked tables, then a small chart of the data
  [
    [12, 28, 50, 9, "a"], ...row(4, (i) => [12, 41 + i * 8, 50, 5]),
    [75, 28, 50, 9, "s"], ...row(3, (i) => [75, 41 + i * 8, 50, 5]),
    [138, 28, 50, 9, "s"], ...row(2, (i) => [138, 41 + i * 8, 50, 5]),
    [62, 44, 13, 1.5, "s"], [125, 44, 13, 1.5, "s"],
    ...row(6, (i) => { const h = [10, 16, 12, 20, 14, 24][i]; return [12 + i * 30, 120 - h, 22, h, i === 5 ? "a" : undefined]; }),
  ],
  // Agentic AI: a chat with the assistant, and a small network of agents
  [
    [52, 28, 70, 10], [12, 44, 96, 22, "s"], [40, 72, 68, 10], [12, 88, 80, 14, "s"], [12, 110, 110, 10],
    [146, 28, 32, 14, "a"], [136, 58, 22, 12], [166, 58, 22, 12], [146, 88, 32, 14, "s"],
    [161, 42, 1.5, 16, "s"], [147, 70, 1.5, 18, "s"], [176, 70, 1.5, 18, "s"],
  ],
];
const SLOTS = Math.max(...LAYOUTS.map((l) => l.length));
/** Blocks a layout doesn't use shrink to nothing at the frame's centre. */
const EMPTY: Block = [100, 75, 0, 0];
const blockAt = (layout: number, slot: number) => LAYOUTS[layout][slot] ?? EMPTY;
const toneClass = (b: Block) => `wf-block${b[4] === "a" ? " is-accent" : b[4] === "s" ? " is-strong" : ""}`;

/**
 * "What we build" as a ticker: one area at a time is lit, and a small browser wireframe
 * morphs into a picture of that area.
 * Auto-advances while on screen, pauses on hover or focus; stays still with reduced motion.
 */
export default function BuildTicker() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<SVGGElement>(null);
  const note = useRef<HTMLParagraphElement>(null);
  const paused = useRef(false);

  // Auto-advance only while visible and not paused
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let visible = false;
    const io = new IntersectionObserver((e) => (visible = e[0]?.isIntersecting ?? false));
    io.observe(el);
    const id = window.setInterval(() => {
      if (visible && !paused.current && document.visibilityState === "visible") setActive((a) => (a + 1) % ITEMS.length);
    }, INTERVAL);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, []);

  // The wireframe morphs into the active line's layout, and the note fades in
  useEffect(() => {
    const g = frame.current;
    if (!g) return;
    const rects = Array.from(g.querySelectorAll<SVGRectElement>("rect"));
    const still = prefersReducedMotion();
    rects.forEach((r, i) => {
      const b = blockAt(active, i);
      r.setAttribute("class", toneClass(b));
      const to = { x: b[0], y: b[1], width: b[2], height: b[3] };
      if (still) utils.set(r, to);
      else animate(r, { ...to, duration: 620, delay: i * 14, ease: "inOut(3)" });
    });
    if (!still && note.current) animate(note.current, { opacity: [0, 1], y: [8, 0], duration: 450, ease: "out(3)" });
  }, [active]);

  const pick = (i: number) => {
    paused.current = true;
    setActive(i);
  };

  return (
    <div
      ref={root}
      className="build-ticker"
      onPointerLeave={() => (paused.current = false)}
      onBlur={() => (paused.current = false)}
    >
      <div className="bt-words">
        <p className="eyebrow text-muted">What we build</p>
        <ul className="mt-4">
          {ITEMS.map((it, i) => (
            <li key={it.name}>
              <button
                type="button"
                className={`ticker-word ${i === active ? "is-on" : ""}`}
                aria-pressed={i === active}
                onPointerEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
              >
                {it.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p ref={note} className="bt-note text-fg-2" aria-live="polite">
        {ITEMS[active].note}
      </p>
      <svg className="ticker-frame" viewBox="0 0 200 130" aria-hidden="true">
        <rect className="wf-window" x="0.75" y="0.75" width="198.5" height="128.5" rx="6" />
        <line className="wf-window" x1="0.75" y1="16" x2="199.25" y2="16" />
        <circle className="wf-dot is-accent" cx="10" cy="8.5" r="2.5" />
        <circle className="wf-dot" cx="18.5" cy="8.5" r="2.5" />
        <circle className="wf-dot" cx="27" cy="8.5" r="2.5" />
        <g ref={frame}>
          {Array.from({ length: SLOTS }, (_, i) => {
            const b = blockAt(0, i);
            return <rect key={i} className={toneClass(b)} x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx="2" />;
          })}
        </g>
      </svg>
    </div>
  );
}
