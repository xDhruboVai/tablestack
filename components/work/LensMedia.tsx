"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll } from "animejs";
import ProjectCover from "./ProjectCover";
import type { Project } from "@/content/projects";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Project preview with the back-of-house lens: the cursor reveals the blueprint underneath.
 * On touch screens the lens sweeps across as the preview scrolls through the viewport.
 */
export default function LensMedia({
  project,
  aspect = "aspect-[16/10]",
  className = "",
  priority = false,
  hoverScale = true,
  sizes,
}: {
  project: Project;
  aspect?: string;
  className?: string;
  priority?: boolean;
  hoverScale?: boolean;
  sizes?: string;
}) {
  const lens = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lens.current;
    if (!el || prefersReducedMotion()) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) {
      el.style.setProperty("--ly", "50%");
      const sweep = animate(el, {
        "--lx": ["-15%", "115%"],
        "--lr": ["0px", "110px"],
        ease: "linear",
        duration: 1000,
        autoplay: onScroll({ target: el, enter: "bottom top", leave: "top bottom", sync: 0.5 }),
      });
      return () => {
        sweep.revert();
      };
    }

    const radius = () => Math.max(90, Math.min(170, el.clientWidth * 0.16));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--lx", `${e.clientX - r.left}px`);
      el.style.setProperty("--ly", `${e.clientY - r.top}px`);
    };
    const enter = (e: PointerEvent) => {
      move(e);
      animate(el, { "--lr": `${radius()}px`, duration: 650, ease: "out(4)" });
    };
    const leave = () => animate(el, { "--lr": "0px", duration: 500, ease: "inOut(3)" });

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={lens}
      className={`lens cover-host relative overflow-hidden bg-surface ${aspect} ${className}`}
      data-reveal="mask"
      data-annot={`<LensMedia slug="${project.slug}" />`}
    >
      <div data-mask-inner className="absolute inset-0">
        <div
          className={`cover-host absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-quart)] ${
            hoverScale ? "group-hover:scale-[1.03]" : ""
          }`}
        >
          <ProjectCover project={project} priority={priority} sizes={sizes} />
        </div>
      </div>
      <div className="lens-boh cover-host pointer-events-none absolute inset-0" aria-hidden="true">
        <ProjectCover project={project} variant="boh" sizes={sizes} decorative />
      </div>
      {project.placeholder && (
        <span className="eyebrow absolute left-3 top-3 bg-[var(--bg)] px-2 py-1 !text-[13px] text-fg">Placeholder</span>
      )}
      <span className="lens-tip eyebrow foh-only" aria-hidden="true">
        Hover to see the kitchen
      </span>
    </div>
  );
}
