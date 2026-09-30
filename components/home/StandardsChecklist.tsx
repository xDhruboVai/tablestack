"use client";

import { useEffect, useRef } from "react";
import { createDrawable, createTimeline, stagger, utils } from "animejs";
import { standards } from "@/content/site";
import { prefersReducedMotion, whenInView } from "@/lib/motion";

/**
 * "What you can expect" as a checklist: when it scrolls into view each box gets its tick
 * drawn in turn, then an "Agreed" stamp lands (the same stamp as the contact confirmation).
 */
export default function StandardsChecklist() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ticks = createDrawable(el.querySelectorAll<SVGPathElement>(".check-tick"));
    const stamp = el.querySelector<HTMLElement>(".check-stamp")!;
    utils.set(ticks, { draw: "0 0" });
    utils.set(stamp, { opacity: 0 });
    let tl: ReturnType<typeof createTimeline> | null = null;
    const stop = whenInView(el, () => {
      tl = createTimeline()
        .add(ticks, { draw: ["0 0", "0 1"], duration: 420, ease: "out(3)" }, stagger(220))
        .add(stamp, { opacity: [0, 1], scale: [2.4, 1], rotate: [-16, -8], duration: 440, ease: "outBack(1.6)" }, "+=120");
    });
    return () => {
      stop();
      tl?.revert();
      utils.set(ticks, { draw: "0 1" });
      utils.set(stamp, { opacity: 1 });
    };
  }, []);

  return (
    <div ref={root} className="relative mt-14 md:mt-20">
      <ul className="grid grid-cols-1 gap-x-12 border-t border-rule lg:grid-cols-2">
        {standards.map((s) => (
          <li key={s.k} className="check-row">
            <svg className="check-box" viewBox="0 0 28 28" aria-hidden="true">
              <rect x="1.5" y="1.5" width="25" height="25" rx="4" />
              <path className="check-tick" d="M7.5 14.5l4.5 4.5 8.5-10" />
            </svg>
            <span className="check-key">{s.k}</span>
            <span className="check-val">{s.v}</span>
          </li>
        ))}
      </ul>
      <span className="check-stamp ticket-stamp" aria-hidden="true">
        Agreed
      </span>
    </div>
  );
}
