"use client";

import { useEffect, useRef } from "react";
import { createDrawable, createTimeline, utils } from "animejs";
import { standards } from "@/content/site";
import { prefersReducedMotion, whenInView } from "@/lib/motion";

/** Time for the dot to go once round the ring. */
const LAP = 6400;
const R = 100;
const N = standards.length;

/** A point on the ring, clockwise from the top. */
const at = (share: number) => {
  const a = share * Math.PI * 2;
  const r = (v: number) => Math.round(v * 100) / 100;
  return { x: r(Math.sin(a) * R), y: r(-Math.cos(a) * R) };
};

/**
 * "What you can expect" as a ring. A dot travels once round a circle, drawing it as it goes;
 * there is a stop on the ring for each promise, and as the dot reaches one the matching row is
 * ticked and the count in the middle goes up. After the last one, the "Agreed" stamp lands.
 */
export default function StandardsChecklist() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ring = el.querySelector<SVGPathElement>(".expect-progress")!;
    const orbit = el.querySelector<SVGGElement>(".expect-orbit")!;
    const stops = Array.from(el.querySelectorAll<SVGCircleElement>(".expect-stop"));
    const ticks = Array.from(el.querySelectorAll<SVGPathElement>(".check-tick"));
    const count = el.querySelector<HTMLElement>(".expect-count")!;
    const note = el.querySelector<HTMLElement>(".expect-note")!;
    const stamp = el.querySelector<HTMLElement>(".check-stamp")!;
    const finish = () => {
      stops.forEach((s) => s.classList.add("is-on"));
      count.textContent = String(N);
      note.textContent = "All covered";
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    // Start from empty (a remount may find the finished state left by the last cleanup).
    stops.forEach((s) => s.classList.remove("is-on"));
    count.textContent = "0";
    note.textContent = "Agreed up front";
    const line = createDrawable(ring);
    utils.set(line, { draw: "0 0" });
    utils.set(createDrawable(ticks), { draw: "0 0" });
    utils.set(stamp, { opacity: 0 });
    utils.set(orbit, { opacity: 0 });

    let tl: ReturnType<typeof createTimeline> | null = null;
    // Start only once the whole ring is on screen and clear of the bottom edge, i.e. the reader
    // has actually arrived at this section rather than just scrolling past its top.
    const ringEl = el.querySelector<HTMLElement>(".expect-ring")!;
    const stop = whenInView(ringEl, () => {
      utils.set(orbit, { opacity: 1 });
      tl = createTimeline()
        .add(orbit, { rotate: [0, 360], duration: LAP, ease: "inOut(1.6)" }, 0)
        .add(line, { draw: ["0 0", "0 1"], duration: LAP, ease: "inOut(1.6)" }, 0);
      // The dot's eased position, so each stop is ticked as the dot actually reaches it.
      const reach = (share: number) => {
        let lo = 0;
        let hi = 1;
        for (let k = 0; k < 20; k++) {
          const mid = (lo + hi) / 2;
          const eased = mid < 0.5 ? Math.pow(2 * mid, 1.6) / 2 : 1 - Math.pow(2 - 2 * mid, 1.6) / 2;
          if (eased < share) lo = mid;
          else hi = mid;
        }
        return lo * LAP;
      };
      ticks.forEach((tick, i) => {
        const t = reach((i + 1) / N);
        tl!
          .add(createDrawable(tick), { draw: ["0 0", "0 1"], duration: 560, ease: "out(3)" }, t)
          .call(() => {
            stops[i].classList.add("is-on");
            count.textContent = String(i + 1);
          }, t);
      });
      tl.call(() => (note.textContent = "All covered"), LAP)
        .add(orbit, { opacity: 0, duration: 300 }, LAP)
        .add(stamp, { opacity: [0, 1], scale: [2.4, 1], rotate: [-16, -8], duration: 600, ease: "outBack(1.6)" }, LAP + 200);
    }, 1, "0px 0px -12% 0px");

    return () => {
      stop();
      tl?.revert();
      utils.set(line, { draw: "0 1" });
      utils.set(createDrawable(ticks), { draw: "0 1" });
      utils.set(stamp, { opacity: 1 });
      finish();
    };
  }, []);

  const start = at(0);

  return (
    <div ref={root} className="expect mt-14 md:mt-20">
      <div className="expect-ring" aria-hidden="true">
        <svg viewBox="-130 -130 260 260">
          <circle className="expect-track" r={R} />
          <path className="expect-progress" d={`M${start.x} ${start.y} A${R} ${R} 0 1 1 -0.01 ${start.y}`} />
          {standards.map((s, i) => {
            const p = at((i + 1) / N);
            return <circle key={s.k} className="expect-stop" cx={p.x} cy={p.y} r="6" />;
          })}
          <g className="expect-orbit">
            <circle className="expect-glow" cx="0" cy={-R} r="13" />
            <circle className="expect-dot" cx="0" cy={-R} r="6.5" />
          </g>
        </svg>
        <div className="expect-center">
          <p className="expect-figure">
            <span className="expect-count">0</span>
            <span className="expect-of">/{N}</span>
          </p>
          <p className="expect-note eyebrow">Agreed up front</p>
        </div>
        <span className="check-stamp ticket-stamp">Agreed</span>
      </div>

      <ul className="expect-list border-t border-rule">
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
    </div>
  );
}
