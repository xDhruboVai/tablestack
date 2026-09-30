"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createAnimatable, scrambleText, utils } from "animejs";
import { approach } from "@/content/site";
import { SCRAMBLE_CHARS, prefersReducedMotion } from "@/lib/motion";

/** A step takes over when its top edge reaches this far down the screen (just under the nav). */
const TAKEOVER = 0.25;
/** The playhead glides to the next tick over this last stretch of scroll (share of the screen height). */
const GLIDE = 0.12;

/**
 * Four steps with a timeline "scrubber" - a nod to animation tooling.
 * The playhead holds on a step's tick for as long as that step is the one being read, and only
 * glides to the next tick as the next step's top edge rises to just under the nav.
 */
export default function ApproachRail() {
  const list = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const l = list.current;
    if (!l) return;
    const steps = Array.from(l.querySelectorAll<HTMLElement>("[data-step]"));
    const railEl = rail.current;
    const headEl = head.current;
    const mover =
      railEl && headEl && !prefersReducedMotion() ? createAnimatable(headEl, { y: 450, ease: "out(3)" }) : null;

    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * TAKEOVER;
      const glide = window.innerHeight * GLIDE;
      const last = steps.length - 1;
      // Position along the steps: 0 = first step, 1 = second step, … Each later step adds its share
      // as its top edge travels the last `glide` pixels to the takeover line.
      let pos = 0;
      for (let k = 1; k <= last; k++) {
        const top = steps[k].getBoundingClientRect().top;
        const g = Math.min(1, Math.max(0, (line + glide - top) / glide));
        pos += g * g * (3 - 2 * g);
      }
      setActive(Math.round(pos));
      if (railEl && headEl) {
        const y = (pos / last) * (railEl.clientHeight - 2);
        if (mover) (mover.y as (v: number) => void)(y);
        else utils.set(headEl, { y });
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
      mover?.revert();
    };
  }, []);

  useEffect(() => {
    if (!counter.current || prefersReducedMotion()) return;
    animate(counter.current, {
      innerHTML: scrambleText({ text: `${approach[active].code} / 0${approach.length}`, chars: SCRAMBLE_CHARS }),
      duration: 380,
    });
  }, [active]);

  // One major tick per step (every 10th), so the playhead lands on a major tick at each step.
  const ticks = Array.from({ length: (approach.length - 1) * 10 + 1 }, (_, i) => i);

  return (
    <div className="mt-10 grid grid-cols-12 gap-x-6 md:mt-14">
      <div className="col-span-12 md:col-span-5">
        <div className="md:sticky md:top-[calc(var(--nav-h)+40px)]">
          <h2 id="app-title" className="display text-[clamp(2.6rem,5vw,5.6rem)]" data-split="lines">
            How a project <em className="text-accent">runs.</em>
          </h2>
          <div className="mt-12 hidden items-stretch gap-6 md:flex" aria-hidden="true">
            <div ref={rail} className="approach-rail">
              {ticks.map((t) => (
                <span key={t} className={t % 10 === 0 ? "is-major" : ""} />
              ))}
              <div className="approach-head-track">
                <div ref={head} className="approach-head">
                  <span />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between py-1">
              <span ref={counter} className="text-[15px] font-semibold tabular-nums text-[var(--accent-text)]">
                01 / 04
              </span>
              <span className="display text-[1.9rem] italic leading-none">{approach[active].term}</span>
              <span className="eyebrow text-muted">{approach[active].plain}</span>
            </div>
          </div>
        </div>
      </div>

      <ol ref={list} className="col-span-12 mt-14 md:col-span-6 md:col-start-7 md:mt-0">
        {approach.map((s, i) => (
          <li
            key={s.code}
            data-step={i}
            className={`approach-step border-t border-rule py-10 md:py-16 ${i === active ? "is-active" : ""}`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="eyebrow text-accent">{s.code}</span>
              <span className="eyebrow text-muted">{s.plain}</span>
            </div>
            <h3 className="display mt-5 text-[clamp(2.2rem,3.6vw,3.6rem)] italic">{s.term}</h3>
            <p className="mt-5 max-w-[46ch] text-[1.08rem] leading-[1.6] text-fg-2">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
