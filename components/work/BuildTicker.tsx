"use client";

import { useEffect, useRef, useState } from "react";
import { animate, utils } from "animejs";
import { capabilities } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

const f = capabilities.frontOfHouse.items;
const b = capabilities.backOfHouse.items;
const ITEMS = [f[0], f[1], f[2], f[3], b[0], b[3]];
const INTERVAL = 2600;

/** One block of the wireframe: position and size in the 200 x 130 frame, plus its tone. */
type Block = [x: number, y: number, w: number, h: number, tone?: "a" | "s"];
const row = (n: number, f: (i: number) => Block) => Array.from({ length: n }, (_, i) => f(i));

/**
 * A page skeleton for each line, in the same order as ITEMS. The blocks morph from one layout to
 * the next; "a" is the accent block, "s" a stronger grey, the rest faint.
 */
const LAYOUTS: Block[][] = [
  // Company & service sites: headline, copy, button, image, footer band
  [[12, 28, 104, 10, "a"], [12, 44, 84, 5], [12, 53, 92, 5], [12, 62, 70, 5], [12, 74, 38, 11, "s"], [128, 28, 60, 57], [12, 96, 176, 24]],
  // Online shops: a product grid with prices
  [...row(4, (i) => [12 + i * 45, 28, 40, 40]), ...row(4, (i) => [12 + i * 45, 72, 30, 5, "s"]), ...row(4, (i) => [12 + i * 45, 81, 18, 5, "a"]), ...row(4, (i) => [12 + i * 45, 94, 40, 26])],
  // Restaurant & café sites: hero photo with title, then a two-column menu
  [[12, 26, 176, 42], [44, 42, 112, 10, "a"], ...row(3, (i) => [12, 78 + i * 10, 80, 5]), ...row(3, (i) => [108, 78 + i * 10, 80, 5]), [72, 108, 20, 5, "s"], [168, 108, 20, 5, "s"]],
  // Portfolios & landing pages: centred headline, button, three tiles
  [[42, 28, 116, 12, "a"], [62, 46, 76, 5], [82, 57, 36, 11, "s"], ...row(3, (i) => [12 + i * 60, 80, 56, 40])],
  // Reservations & booking: a week of days, one picked, and time slots
  [[12, 27, 176, 9, "s"], ...row(7, (i) => [12 + i * 25.5, 42, 21, 18, i === 3 ? "a" : undefined]), ...row(3, (i) => [12 + i * 60, 68, 56, 12, i === 1 ? "s" : undefined]), [12, 88, 176, 5], [12, 97, 120, 5], [150, 106, 38, 14, "a"]],
  // Dashboards & admin: sidebar, stat cards, a bar chart
  [[12, 26, 32, 94, "s"], [52, 26, 64, 30], [124, 26, 64, 30], ...row(7, (i) => {
    const h = [22, 36, 28, 46, 32, 52, 40][i];
    return [54 + i * 19, 120 - h, 13, h, i === 5 ? "a" : undefined];
  })],
];
const SLOTS = Math.max(...LAYOUTS.map((l) => l.length));
/** Blocks a layout doesn't use shrink to nothing at the frame's centre. */
const EMPTY: Block = [100, 75, 0, 0];
const blockAt = (layout: number, slot: number) => LAYOUTS[layout][slot] ?? EMPTY;
const toneClass = (b: Block) => `wf-block${b[4] === "a" ? " is-accent" : b[4] === "s" ? " is-strong" : ""}`;

/**
 * "What we build" as a ticker: one line at a time is lit, and a small browser wireframe
 * morphs into the kind of page that line means.
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
