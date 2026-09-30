"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createTimeline, stagger, utils } from "animejs";
import { capabilities } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

const f = capabilities.frontOfHouse.items;
const b = capabilities.backOfHouse.items;
const ITEMS = [f[0], f[1], f[2], f[3], b[0], b[3]];
const TICKS = 36;
const STEP = 360 / ITEMS.length;
const INTERVAL = 2600;

/**
 * "What we build" as a ticker: one line at a time is lit, and a dial ticks round to it.
 * Auto-advances while on screen, pauses on hover or focus; stays still with reduced motion.
 */
export default function BuildTicker() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const hand = useRef<SVGGElement>(null);
  const note = useRef<HTMLParagraphElement>(null);
  const turns = useRef(0);
  const prev = useRef(0);
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

  // Dial + note respond to the active line
  useEffect(() => {
    const el = root.current;
    if (!el || !hand.current) return;
    // Always turn clockwise, so going from the last line back to the first keeps moving forward.
    turns.current += ((active - prev.current + ITEMS.length) % ITEMS.length) * STEP;
    prev.current = active;
    if (prefersReducedMotion()) {
      utils.set(hand.current, { rotate: turns.current });
      return;
    }
    animate(hand.current, { rotate: turns.current, duration: 700, ease: "outBack(1.4)" });
    const ticks = el.querySelectorAll(".ticker-tick");
    createTimeline().add(
      ticks,
      { opacity: [{ to: 0.15 }, { to: 1 }], duration: 110, ease: "linear" },
      stagger(9, { from: (active * TICKS) / ITEMS.length }),
    );
    if (note.current) animate(note.current, { opacity: [0, 1], y: [8, 0], duration: 450, ease: "out(3)" });
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
      <svg className="ticker-dial" viewBox="-70 -70 140 140" aria-hidden="true">
        {Array.from({ length: TICKS }, (_, i) => {
          const a = (i / TICKS) * Math.PI * 2;
          const major = i % (TICKS / ITEMS.length) === 0;
          const len = major ? 12 : 6;
          // Rounded so server and browser render identical attributes (no hydration mismatch).
          const r = (v: number) => Math.round(v * 100) / 100;
          return (
            <line
              key={i}
              className={`ticker-tick ${major ? "is-major" : ""}`}
              x1={r(Math.sin(a) * 62)}
              y1={r(-Math.cos(a) * 62)}
              x2={r(Math.sin(a) * (62 - len))}
              y2={r(-Math.cos(a) * (62 - len))}
            />
          );
        })}
        <g ref={hand} className="ticker-hand-g">
          <line className="ticker-hand" x1="0" y1="0" x2="0" y2="-44" />
        </g>
        <circle r="4" className="ticker-hub" />
      </svg>
    </div>
  );
}
