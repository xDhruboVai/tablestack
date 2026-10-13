"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import TLink from "@/components/layout/TLink";
import { prefersReducedMotion } from "@/lib/motion";

export type FanItem = { slug: string; title: string; kind: string; concept: boolean; window: ReactNode };

/** Sites turned per second when left alone, and at most while the cursor steers. */
const AUTO = 0.22;
const STEER = 1.1;
/** Where the row starts: the first site at the front, a little off-centre so all six can be seen. */
const START = 0.4;

/**
 * A curved row of every site that turns slowly on its own. Each site links to its project page.
 * Mouse: the row turns towards the side the cursor is on, and holds still near the middle.
 * Touch: swipe to turn. Keyboard: the focused site comes to the front.
 * Where each site sits is one number, --p (0 = front, negative = left); the stylesheet does the rest.
 */
export default function SiteFan({ items, onFront }: { items: FanItem[]; onFront?: (index: number) => void }) {
  // At least six places in the row, so it is full whatever is switched on.
  const slots = useMemo(() => Array.from({ length: Math.max(6, items.length) }, (_, i) => items[i % items.length]), [items]);
  const n = slots.length;
  const root = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const turn = useRef(START);
  const seek = useRef<number | null>(null);
  const dragged = useRef(false);
  const [front, setFront] = useState(0);

  // Distance from the front, wrapped so the row is a loop.
  const offset = (i: number, at: number) => ((((i - at + n / 2) % n) + n) % n) - n / 2;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = prefersReducedMotion();
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let shown = 3;
    let speed = still ? 0 : AUTO;
    let target = speed;
    let raf = 0;
    let last = 0;
    let drag: { x: number; turn: number; step: number } | null = null;

    const place = () => {
      cards.current.forEach((card, i) => {
        if (!card) return;
        const p = offset(i, turn.current);
        card.style.setProperty("--p", p.toFixed(4));
        card.style.setProperty("--abs", Math.abs(p).toFixed(4));
        // A site that has faded out at the end of the row should not catch clicks.
        card.style.visibility = Math.abs(p) > shown - 0.03 ? "hidden" : "visible";
      });
      const f = ((Math.round(turn.current) % n) + n) % n;
      setFront((was) => (was === f ? was : f));
    };
    const measure = () => {
      shown = parseFloat(getComputedStyle(el).getPropertyValue("--fan-vis")) || 3;
      place();
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      if (seek.current !== null) {
        turn.current += offset(seek.current, turn.current) * Math.min(1, dt * 6);
      } else if (!drag) {
        speed += (target - speed) * Math.min(1, dt * 4);
        turn.current += speed * dt;
      }
      place();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const steer = (e: PointerEvent) => {
      if (drag) {
        const dx = e.clientX - drag.x;
        if (Math.abs(dx) > 8) dragged.current = true;
        turn.current = drag.turn - dx / drag.step;
        return;
      }
      if (!fine || still || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      // The middle third holds still, so a site can be read and clicked.
      target = Math.abs(x) < 0.33 ? 0 : Math.sign(x) * ((Math.abs(x) - 0.33) / 0.67) * STEER;
    };
    const leave = () => {
      target = still ? 0 : AUTO;
    };
    const down = (e: PointerEvent) => {
      dragged.current = false;
      if (e.pointerType === "mouse") return;
      const step = (cards.current[0]?.offsetWidth ?? 200) * 0.55;
      drag = { x: e.clientX, turn: turn.current, step };
    };
    const up = () => {
      drag = null;
    };
    // After a swipe, the tap that ends it should not open a project.
    const click = (e: MouseEvent) => {
      if (dragged.current) {
        e.preventDefault();
        e.stopPropagation();
        dragged.current = false;
      }
    };

    const seen = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { rootMargin: "120px" });
    const sized = new ResizeObserver(measure);
    seen.observe(el);
    sized.observe(el);
    measure();
    el.addEventListener("pointermove", steer);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    el.addEventListener("click", click, true);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      stop();
      seen.disconnect();
      sized.disconnect();
      el.removeEventListener("pointermove", steer);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("click", click, true);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    // `offset` only depends on n.
  }, [n]);

  // Tells whoever is listening (the big word above) which site is now at the front.
  useEffect(() => {
    onFront?.(front % items.length);
  }, [front, items.length, onFront]);

  const shownNow = slots[front];

  return (
    <div className="site-fan" ref={root} data-reveal="rise">
      <div className="site-fan-stage">
        {slots.map((item, i) => {
          const p = offset(i, START);
          return (
            <TLink
              href={`/work/${item.slug}`}
              className="site-fan-item"
              key={i}
              ref={(node: HTMLAnchorElement | null) => {
                cards.current[i] = node;
              }}
              style={{ "--p": p, "--abs": Math.abs(p) } as CSSProperties}
              draggable={false}
              // A site repeated to fill the row is the same link twice: only the first is announced and tabbed to.
              aria-hidden={i >= items.length || undefined}
              tabIndex={i >= items.length ? -1 : undefined}
              aria-label={`${item.title}${item.concept ? " (concept)" : ""}: view the project`}
              onFocus={() => {
                seek.current = i;
              }}
              onBlur={() => {
                seek.current = null;
              }}
            >
              {item.window}
            </TLink>
          );
        })}
      </div>
      {/* Names the site at the front. */}
      <TLink href={`/work/${shownNow.slug}`} className="site-fan-caption" tabIndex={-1} aria-hidden="true">
        {shownNow.concept && <span className="concept-tag">Concept</span>}
        <span className="site-fan-name">{shownNow.title}</span>
        <span className="site-fan-kind">{shownNow.kind}</span>
        <span className="site-fan-arrow">↗</span>
      </TLink>
    </div>
  );
}
