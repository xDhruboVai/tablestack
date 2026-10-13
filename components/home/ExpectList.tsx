"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createDrawable, stagger, utils } from "animejs";
import { standards } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

const INTERVAL = 2800;

/**
 * One icon per promise, in the same order as `standards`, on a 24 x 24 grid.
 * Shapes follow the Feather icon set (MIT licence), split into strokes so they can draw in one by one.
 */
const ICONS: string[][] = [
  // Scope: a checklist
  ["M3 6.5l1.8 1.8L8.5 4.5", "M12.5 6.5H21", "M3 12.5l1.8 1.8 3.7-3.8", "M12.5 12.5H21", "M3.5 17h4v4h-4z", "M12.5 19H18"],
  // Preview: an eye
  ["M1.5 12s3.8-7.5 10.5-7.5S22.5 12 22.5 12s-3.8 7.5-10.5 7.5S1.5 12 1.5 12z", "M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6"],
  // Plain language: a speech bubble
  ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", "M7.5 8.5h9", "M7.5 12.5h5"],
  // Mobile first: a phone
  ["M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z", "M10 5.5h4", "M11 18.5h2"],
  // Editing: a pencil
  ["M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z", "M14.5 5.5l4 4"],
  // Ownership: a key
  ["M11.39 11.61a5.5 5.5 0 1 1-7.778 7.778a5.5 5.5 0 0 1 7.778-7.778z", "M11.39 11.61L21 2", "M15.5 7.5l3 3L22 7l-3-3"],
];

/**
 * "What you can expect": the heading (passed in as children) above six rows, one per promise, each with
 * its line and an icon. One row is lit at a time: a dark bar slides to it and its icon draws itself in.
 * It moves on by itself while on screen, follows the mouse, and stays still with reduced motion.
 */
export default function ExpectList({ children }: { children?: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
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

  // The lit row's icon draws itself in
  useEffect(() => {
    const svg = root.current?.querySelector<SVGSVGElement>(".expect-row.is-on svg");
    if (!svg || prefersReducedMotion()) return;
    const paths = createDrawable(svg.querySelectorAll<SVGPathElement>("path"));
    utils.set(paths, { draw: "0 0" });
    const drawing = animate(paths, { draw: ["0 0", "0 1"], duration: 650, delay: stagger(60, { start: 120 }), ease: "inOut(3)" });
    // Leave the icon fully drawn when its row goes dark again
    return () => {
      drawing.pause();
      utils.set(paths, { draw: "0 1" });
    };
  }, [active]);

  // A mouse holds the row it is over; a tap just picks a row and lets the rows carry on.
  const pick = (i: number, pointerType: string) => {
    if (pointerType === "mouse") paused.current = true;
    setActive(i);
  };

  return (
    <div ref={root} className="expect" onPointerLeave={() => (paused.current = false)}>
      <div className="expect-head">{children}</div>
      <div className="expect-rows" style={{ ["--i" as string]: active, ["--n" as string]: standards.length }} data-reveal="rise">
        <span className="expect-bar" aria-hidden="true" />
        <ul>
          {standards.map((s, i) => (
            <li key={s.k} className={`expect-row ${i === active ? "is-on" : ""}`} onPointerEnter={(e) => pick(i, e.pointerType)}>
              <h3 className="expect-row-name display">{s.k}</h3>
              <p className="expect-row-line">{s.v}</p>
              <span className="expect-row-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  {ICONS[i].map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
