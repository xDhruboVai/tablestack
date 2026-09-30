"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** How far each card sits below the one before it once they're stacked (px). */
const OFFSET = 16;

export type StackItem = { code: string; title: string; body: string; eyebrow?: string };

/**
 * A stack of big cards. Each one sticks under the nav; the next slides up over it, and the card
 * underneath eases back and dims. `extra` renders inside the light cards (e.g. a background effect).
 */
export default function StackCards({ items, extra }: { items: readonly StackItem[]; extra?: ReactNode }) {
  const wrap = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const w = wrap.current;
    if (!w || prefersReducedMotion()) return;
    const cards = Array.from(w.querySelectorAll<HTMLElement>(".stack-card"));
    let raf = 0;
    const update = () => {
      raf = 0;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const own = card.getBoundingClientRect();
        // 0 while the next card is still a full card-height away, 1 once it has landed on top.
        const cover = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - own.top - OFFSET) / own.height));
        card.style.setProperty("--cover", cover.toFixed(3));
      });
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
    };
  }, []);

  return (
    <ol ref={wrap} className="stack">
      {items.map((s, i) => {
        const paper = i % 2 === 0;
        const last = i === items.length - 1;
        return (
          <li
            key={s.code}
            className={`stack-card ${last ? "tone-accent" : paper ? "tone-paper" : "tone-ink"}`}
            style={{ top: `calc(var(--nav-h) + 24px + ${i * OFFSET}px)` }}
          >
            <div className="stack-inner">
              {paper && !last && extra}
              <span className="stack-num" aria-hidden="true">
                {s.code}
              </span>
              <div className="stack-body">
                {s.eyebrow && <p className="eyebrow stack-plain">{s.eyebrow}</p>}
                <h3 className="display mt-3 text-[clamp(2.2rem,4.2vw,4.6rem)] italic">{s.title}</h3>
                <p className="mt-5 max-w-[42ch] text-[clamp(1.05rem,1.3vw,1.25rem)] leading-[1.55]">{s.body}</p>
              </div>
              <div className="stack-meter" aria-hidden="true">
                <span className="stack-bars">
                  {items.map((_, j) => (
                    <i key={j} className={j <= i ? "is-on" : ""} />
                  ))}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
