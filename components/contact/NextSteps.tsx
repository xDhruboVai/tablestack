"use client";

import { useEffect, useRef } from "react";
import { animate, createDrawable, stagger, utils } from "animejs";
import { prefersReducedMotion, whenInView } from "@/lib/motion";

const steps = [
  {
    n: "01",
    t: "We talk",
    b: "Your business and what you need built.",
    // speech bubble
    icon: ["M5 7h26v17H17l-7 6v-6H5z", "M11 13h14", "M11 18h9"],
  },
  {
    n: "02",
    t: "We agree the scope",
    b: "Pages, features, timeline and quote.",
    // checklist
    icon: ["M7 9h14", "M7 17h14", "M7 25h9", "M24 23l3 3 6-7"],
  },
  {
    n: "03",
    t: "We get to work",
    b: "Layouts first, then a working preview.",
    // browser window
    icon: ["M4 7h28v21H4z", "M4 13h28", "M9 19h10", "M9 23h6"],
  },
];

/**
 * "What happens next" on the contact page. Each step has a line icon that draws itself in when
 * the list comes into view, and redraws when you hover the step.
 */
export default function NextSteps() {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const all = createDrawable(el.querySelectorAll<SVGPathElement>(".step-icon path"));
    utils.set(all, { draw: "0 0" });
    const stop = whenInView(el, () => {
      animate(all, { draw: ["0 0", "0 1"], duration: 1100, delay: stagger(70), ease: "inOut(3)" });
    }, 0.2);

    const rows = Array.from(el.querySelectorAll<HTMLElement>("li"));
    const redraw = (row: HTMLElement) => () =>
      animate(createDrawable(row.querySelectorAll<SVGPathElement>(".step-icon path")), {
        draw: ["0 0", "0 1"],
        duration: 800,
        delay: stagger(60),
        ease: "inOut(3)",
      });
    const handlers = rows.map((r) => {
      const h = redraw(r);
      r.addEventListener("pointerenter", h);
      return h;
    });
    return () => {
      stop();
      rows.forEach((r, i) => r.removeEventListener("pointerenter", handlers[i]));
      utils.set(all, { draw: "0 1" });
    };
  }, []);

  return (
    <ol ref={root} className="mt-4" data-reveal="stagger">
      {steps.map((s) => (
        <li key={s.n} className="grid grid-cols-[40px_1fr_auto] gap-x-3 border-t border-rule py-5">
          <span className="eyebrow pt-1 text-accent">{s.n}</span>
          <div>
            <p className="font-medium">{s.t}</p>
            <p className="mt-1 text-fg-2">{s.b}</p>
          </div>
          <svg className="step-icon" viewBox="0 0 36 36" aria-hidden="true">
            {s.icon.map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
        </li>
      ))}
    </ol>
  );
}
