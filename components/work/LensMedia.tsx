"use client";

import { useEffect, useRef } from "react";
import ProjectCover from "./ProjectCover";
import type { Project } from "@/content/projects";
import { prefersReducedMotion } from "@/lib/motion";
import { createFluid, type FluidSim } from "@/lib/fluid";

/** How long the fluid keeps settling after the cursor leaves, before the canvas fades out (ms). */
const SETTLE = 2200;

/**
 * Project preview with a fluid distortion: moving the cursor over it stirs a liquid that bends the
 * picture and shows it inverted where the fluid is (WebGL, see lib/fluid.ts). On touch screens a finger
 * dragged across the image stirs it (page scrolling is never blocked). The simulation only starts on
 * the first touch or hover, and only runs while in use or settling. Reduced motion and browsers
 * without WebGL2 keep the plain image.
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const src = project.media?.cover;
  const focusX = project.media?.focusX ?? 50;

  useEffect(() => {
    const el = lens.current;
    const canvas = canvasRef.current;
    if (!el || !canvas || !src || prefersReducedMotion()) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let sim: FluidSim | null = null;
    let loading = false;
    let failed = false;
    let inside = false;
    let raf = 0;
    let lastT = 0;
    let stopAt = 0;

    const loop = (t: number) => {
      const dt = lastT ? (t - lastT) / 1000 : 1 / 60;
      lastT = t;
      sim?.step(dt);
      if (!inside && t > stopAt) {
        canvas.classList.remove("is-on");
        raf = 0;
        lastT = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const run = () => {
      if (!sim) return;
      canvas.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (sim || loading || failed) return;
      loading = true;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loading = false;
        try {
          sim = createFluid(canvas, img, focusX);
        } catch {
          sim = null;
        }
        if (!sim) failed = true;
        else if (inside) run();
      };
      img.onerror = () => {
        loading = false;
        failed = true;
      };
      img.src = src;
    };

    const local = (e: { clientX: number; clientY: number }) => {
      const r = canvas.getBoundingClientRect();
      // The canvas can be scaled by the hover zoom; convert back to its own CSS pixels.
      return [((e.clientX - r.left) / r.width) * canvas.clientWidth, ((e.clientY - r.top) / r.height) * canvas.clientHeight];
    };
    const enter = (e: PointerEvent) => {
      inside = true;
      start();
      sim?.resetPointer();
      const [x, y] = local(e);
      sim?.pointer(x, y);
      run();
    };
    const move = (e: PointerEvent) => {
      if (!sim) return;
      const [x, y] = local(e);
      sim.pointer(x, y);
    };
    const leave = () => {
      if (!inside) return;
      inside = false;
      stopAt = performance.now() + SETTLE;
    };
    const onDocLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) leave();
    };
    const onPageScroll = () => {
      if (inside && !el.matches(":hover")) leave();
    };
    const ro = new ResizeObserver(() => sim?.resize());
    ro.observe(canvas);

    // Touch: passive listeners, so the page still scrolls; the finger's path (and the image moving
    // under it while scrolling) stirs the fluid.
    const touchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      inside = true;
      start();
      sim?.resetPointer();
      const [x, y] = local(t);
      sim?.pointer(x, y);
      run();
    };
    const touchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!sim || !t) return;
      const [x, y] = local(t);
      sim.pointer(x, y);
    };
    if (!fine) {
      el.addEventListener("touchstart", touchStart, { passive: true });
      el.addEventListener("touchmove", touchMove, { passive: true });
      el.addEventListener("touchend", leave);
      el.addEventListener("touchcancel", leave);
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        sim?.destroy();
        el.removeEventListener("touchstart", touchStart);
        el.removeEventListener("touchmove", touchMove);
        el.removeEventListener("touchend", leave);
        el.removeEventListener("touchcancel", leave);
      };
    }

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("scroll", onPageScroll, { passive: true });
    document.addEventListener("mouseout", onDocLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      sim?.destroy();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("scroll", onPageScroll);
      document.removeEventListener("mouseout", onDocLeave);
    };
  }, [src, focusX]);

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
          {/* Drawn over the image (same crop) while the fluid is moving. */}
          <canvas ref={canvasRef} className="lens-fluid" aria-hidden="true" />
        </div>
      </div>
      {project.placeholder && (
        <span className="eyebrow absolute left-3 top-3 bg-[var(--bg)] px-2 py-1 !text-[13px] text-fg">Placeholder</span>
      )}
    </div>
  );
}
