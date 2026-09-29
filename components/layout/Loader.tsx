"use client";

import { useEffect, useRef } from "react";
import { createTimeline, stagger, utils } from "animejs";
import { EASE, markIntroDone } from "@/lib/motion";

/**
 * First-visit intro (once per session, ~1.2s, skippable).
 * Three slabs land on each other - the table gets set - then the cover lifts.
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
        y: [-60, 0],
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
        <svg viewBox="0 0 64 64" className="h-16 w-16 overflow-visible">
          <path data-slab d="M6 44 32 57 58 44" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path data-slab d="M6 33 32 46 58 33" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path data-slab d="M32 8 58 21 32 34 6 21Z" fill="var(--accent)" />
        </svg>
        <div className="flex items-baseline gap-0 overflow-hidden leading-none">
          <span className="split-line">
            <span data-word className="inline-block font-display text-[34px] font-extrabold italic tracking-[-0.045em]">
              Table
            </span>
          </span>
          <span className="split-line">
            <span data-word className="inline-block font-display text-[34px] font-extrabold tracking-[-0.045em]">
              Stacks
            </span>
          </span>
        </div>
        <p className="eyebrow text-muted">
          Setting the table · <span data-count>000</span>
        </p>
      </div>
    </div>
  );
}
