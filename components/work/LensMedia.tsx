"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll } from "animejs";
import ProjectCover from "./ProjectCover";
import type { Project } from "@/content/projects";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Project preview with an inverted lens: a circle under the cursor shows the image with its
 * colours inverted. On touch screens the lens sweeps across as the preview scrolls into view.
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
        "--lr": ["0px", "48px"],
        ease: "linear",
        duration: 1000,
        autoplay: onScroll({ target: el, enter: "bottom top", leave: "top bottom", sync: 0.5 }),
      });
      return () => {
        sweep.revert();
      };
    }

    const radius = () => Math.max(36, Math.min(56, el.clientWidth * 0.06));
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--lx", `${e.clientX - r.left}px`);
      el.style.setProperty("--ly", `${e.clientY - r.top}px`);
    };
    let open = false;
    const enter = (e: PointerEvent) => {
      open = true;
      move(e);
      animate(el, { "--lr": `${radius()}px`, duration: 650, ease: "out(4)" });
    };
    const leave = () => {
      if (!open) return;
      open = false;
      animate(el, { "--lr": "0px", duration: 500, ease: "inOut(3)" });
    };
    // pointerleave can be missed (cursor leaves the window fast, or the page scrolls under a still
    // cursor), which would leave the lens stuck open. Close it in those cases too.
    const onPageScroll = () => {
      if (open && !el.matches(":hover")) leave();
    };
    const onDocLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) leave();
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("scroll", onPageScroll, { passive: true });
    document.addEventListener("mouseout", onDocLeave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("scroll", onPageScroll);
      document.removeEventListener("mouseout", onDocLeave);
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
      <div className="lens-invert cover-host pointer-events-none absolute inset-0" aria-hidden="true">
        <ProjectCover project={project} sizes={sizes} decorative />
      </div>
      {project.placeholder && (
        <span className="eyebrow absolute left-3 top-3 bg-[var(--bg)] px-2 py-1 !text-[13px] text-fg">Placeholder</span>
      )}
      <span className="lens-tip eyebrow" aria-hidden="true">
        Hover to see how it’s built
      </span>
    </div>
  );
}
