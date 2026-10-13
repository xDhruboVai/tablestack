"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createDrawable, stagger, utils } from "animejs";
import { standards } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

const INTERVAL = 2800;

/**
 * One icon per promise, in the same order as `standards`, on a 24 x 24 grid. `a` marks the accent stroke.
 * Shapes follow the Feather icon set (MIT licence), split into strokes so they can draw in one by one.
 */
const ICONS: { d: string; a?: boolean }[][] = [
  // Scope: a checklist
  [{ d: "M3 6.5l1.8 1.8L8.5 4.5", a: true }, { d: "M12.5 6.5H21" }, { d: "M3 12.5l1.8 1.8 3.7-3.8", a: true }, { d: "M12.5 12.5H21" }, { d: "M3.5 17h4v4h-4z" }, { d: "M12.5 19H18" }],
  // Preview: an eye
  [{ d: "M1.5 12s3.8-7.5 10.5-7.5S22.5 12 22.5 12s-3.8 7.5-10.5 7.5S1.5 12 1.5 12z" }, { d: "M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6", a: true }],
  // Plain language: a speech bubble
  [{ d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }, { d: "M7.5 8.5h9" }, { d: "M7.5 12.5h5", a: true }],
  // Mobile first: a phone
  [{ d: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" }, { d: "M10 5.5h4" }, { d: "M11 18.5h2", a: true }],
  // Editing: a pencil
  [{ d: "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" }, { d: "M14.5 5.5l4 4", a: true }],
  // Ownership: a key
  [{ d: "M11.39 11.61a5.5 5.5 0 1 1-7.778 7.778a5.5 5.5 0 0 1 7.778-7.778z" }, { d: "M11.39 11.61L21 2" }, { d: "M15.5 7.5l3 3L22 7l-3-3" }, { d: "M6.5 15.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0", a: true }],
];

/**
 * "What you can expect": the heading (passed in as children) and the six promises as a list, with one
 * lit at a time. Beside them, six orbs circle a centre where the lit promise draws itself in.
 * Auto-advances while on screen, pauses on hover or focus; stays still with reduced motion.
 */
export default function ExpectList({ children }: { children?: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const art = useRef<SVGSVGElement>(null);
  const paused = useRef(false);

  // Auto-advance only while visible and not paused
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let visible = false;
    const io = new IntersectionObserver((e) => (visible = e[0]?.isIntersecting ?? false), { threshold: 0.4 });
    io.observe(el);
    const id = window.setInterval(() => {
      if (visible && !paused.current && document.visibilityState === "visible") setActive((a) => (a + 1) % standards.length);
    }, INTERVAL);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, []);

  // The active picture draws itself in
  useEffect(() => {
    const svg = art.current;
    if (!svg || prefersReducedMotion()) return;
    const paths = createDrawable(svg.querySelectorAll<SVGPathElement>("path"));
    utils.set(paths, { draw: "0 0" });
    const drawing = animate(paths, { draw: ["0 0", "0 1"], duration: 750, delay: stagger(55), ease: "inOut(3)" });
    return () => {
      drawing.pause();
    };
  }, [active]);

  const pick = (i: number) => {
    paused.current = true;
    setActive(i);
  };

  return (
    <div ref={root} className="expect" onPointerLeave={() => (paused.current = false)} onBlur={() => (paused.current = false)}>
      <div className="expect-main">
        {children}
        <ul className="expect-list">
          {standards.map((s, i) => (
            <li key={s.k}>
              <button
                type="button"
                className={`expect-word display ${i === active ? "is-on" : ""}`}
                aria-pressed={i === active}
                aria-label={`${s.k}: ${s.v}`}
                onPointerEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
              >
                {s.k}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* The scene and line repeat what each button already says, so screen readers skip this panel. */}
      <div className="expect-panel" aria-hidden="true">
        <div className="expect-orbit">
          <span className="expect-ring expect-ring-far" />
          <span className="expect-ring" />
          {/* The six promises circle the centre; the lit one is the promise on show. */}
          <div className="expect-spin">
            {standards.map((s, i) => (
              <div key={s.k} className="expect-arm" style={{ ["--a" as string]: `${i * (360 / standards.length) - 90}deg` }}>
                <div className="expect-orb" onPointerEnter={() => pick(i)}>
                  <span className={`expect-orb-face ${i === active ? "is-on" : ""}`}>
                    <svg viewBox="0 0 24 24">
                      {ICONS[i].map((p) => (
                        <path key={p.d} d={p.d} />
                      ))}
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="expect-core">
            <svg key={`art-${active}`} ref={art} className="expect-art" viewBox="0 0 24 24">
              {ICONS[active].map((p) => (
                <path key={p.d} d={p.d} className={p.a ? "is-accent" : undefined} />
              ))}
            </svg>
          </div>
        </div>
        <div key={`copy-${active}`} className="expect-copy">
          <p className="expect-copy-title">{standards[active].k}</p>
          <p className="expect-copy-line">{standards[active].v}</p>
        </div>
      </div>
    </div>
  );
}
