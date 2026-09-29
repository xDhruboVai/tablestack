"use client";

import { useEffect, useRef, useState } from "react";
import { animate, onScroll, scrambleText } from "animejs";
import { approach } from "@/content/site";
import { SCRAMBLE_CHARS, prefersReducedMotion } from "@/lib/motion";

/**
 * Four steps with a timeline "scrubber" - a nod to animation tooling.
 * The playhead tracks your scroll; the active step lights up as it crosses the middle of the screen.
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
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    steps.forEach((s) => io.observe(s));

    let a: ReturnType<typeof animate> | undefined;
    if (!prefersReducedMotion() && head.current && rail.current) {
      const railEl = rail.current;
      a = animate(head.current, {
        y: [0, () => railEl.clientHeight - 2],
        ease: "linear",
        duration: 1000,
        autoplay: onScroll({ target: l, enter: "center top", leave: "center bottom", sync: 0.35 }),
      });
    }
    return () => {
      io.disconnect();
      a?.revert();
    };
  }, []);

  useEffect(() => {
    if (!counter.current || prefersReducedMotion()) return;
    animate(counter.current, {
      innerHTML: scrambleText({ text: `${approach[active].code} / 0${approach.length}`, chars: SCRAMBLE_CHARS }),
      duration: 380,
    });
  }, [active]);

  const ticks = Array.from({ length: 41 }, (_, i) => i);

  return (
    <div className="mt-10 grid grid-cols-12 gap-x-6 md:mt-14">
      <div className="col-span-12 md:col-span-5">
        <div className="md:sticky md:top-[calc(var(--nav-h)+40px)]">
          <h2 id="app-title" className="display text-[clamp(2.6rem,5vw,5.6rem)]" data-split="lines">
            How a project <em className="text-accent">runs.</em>
          </h2>
          <p className="body-lg mt-6 max-w-[34ch]" data-split="lines">
            Four stages, borrowed from the kitchen. Plain language, fixed checkpoints, no surprises on the bill.
          </p>

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
