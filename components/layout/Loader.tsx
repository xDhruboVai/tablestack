"use client";

import { useEffect, useRef } from "react";
import { createTimeline, stagger, utils } from "animejs";
import { EASE, markIntroDone } from "@/lib/motion";
import { MARK_SLAB, MARK_VIEWBOX } from "./Wordmark";

// The two thin gaps of the logo, each cut into the slab below it so it travels with that slab.
const GAP_MIDDLE = "M98.2 222.2L450.2 327.6";
const GAP_BOTTOM = "M98.2 382.2L434.2 482.8";

/**
 * First-visit intro (once per session, ~1.2s, skippable).
 * The three slabs of the logo land on each other, bottom first, then the cover lifts.
 * The inline script in <head> adds `first-visit` to <html> only when this should play,
 * so returning visitors and reduced-motion users never see it.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el || !html.classList.contains("first-visit")) {
      markIntroDone();
      return;
    }

    const count = el.querySelector<HTMLElement>("[data-count]")!;
    const counter = { v: 0 };
    let finished = false;

    const tl = createTimeline({ defaults: { ease: EASE.out } })
      .add(el.querySelectorAll("[data-slab]"), {
        y: [-300, 0],
        opacity: [0, 1],
        duration: 520,
        ease: EASE.settle,
        delay: stagger(140),
      })
      .add(el.querySelectorAll("[data-word]"), { y: ["110%", "0%"], duration: 700, delay: stagger(60) }, 120)
      .add(
        counter,
        {
          v: 100,
          duration: 900,
          ease: "inOut(3)",
          onUpdate: () => {
            count.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0,
      )
      .call(() => lift(), 980);

    function lift() {
      if (finished) return;
      finished = true;
      tl.pause();
      markIntroDone();
      const lifted = createTimeline({ defaults: { ease: EASE.inOut } }).add(el!, {
        clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"],
        duration: 800,
        onComplete: () => {
          html.classList.remove("first-visit");
          utils.set(el!, { display: "none" });
        },
      });
      void lifted;
    }

    const skip = () => lift();
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("touchstart", skip, { once: true, passive: true });
    window.addEventListener("keydown", skip, { once: true });
    el.addEventListener("click", skip, { once: true });

    return () => {
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
      tl.pause();
    };
  }, []);

  return (
    <div ref={root} className="loader" aria-hidden="true">
      <div className="flex flex-col items-center gap-7">
        {/* The logo mark, as in the header: two slabs in the text colour under the red one. */}
        <svg viewBox={MARK_VIEWBOX} className="h-[80px] w-[113px] overflow-visible">
          <defs>
            {[
              ["loader-gap-middle", GAP_MIDDLE],
              ["loader-gap-bottom", GAP_BOTTOM],
            ].map(([id, d]) => (
              <mask key={id} id={id} maskUnits="userSpaceOnUse" x="-100" y="-400" width="1120" height="1200">
                <rect x="-100" y="-400" width="1120" height="1200" fill="#fff" />
                <path d={d} stroke="#000" strokeWidth="14" />
              </mask>
            ))}
          </defs>
          <g data-slab>
            <path d={MARK_SLAB(320)} fill="currentColor" mask="url(#loader-gap-bottom)" />
          </g>
          <g data-slab>
            <path d={MARK_SLAB(160)} fill="currentColor" mask="url(#loader-gap-middle)" />
          </g>
          <g data-slab>
            <path d={MARK_SLAB(0)} fill="var(--accent)" />
          </g>
        </svg>
        <div className="flex items-baseline gap-0 overflow-hidden leading-none">
          <span className="split-line">
            <span data-word className="inline-block font-display text-[34px] font-extrabold tracking-[-0.045em]">
              Table
            </span>
          </span>
          <span className="split-line">
            <span data-word className="inline-block font-display text-[34px] font-extrabold tracking-[-0.045em]">
              Stack
            </span>
          </span>
        </div>
        <p className="eyebrow text-muted">
          Building the stack · <span data-count>000</span>
        </p>
      </div>
    </div>
  );
}
