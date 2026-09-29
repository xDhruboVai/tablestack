"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, createAnimatable, stagger, utils } from "animejs";
import TLink from "@/components/layout/TLink";
import ProjectCover from "./ProjectCover";
import WorkCard from "./WorkCard";
import type { Project } from "@/content/projects";
import { EASE, prefersReducedMotion } from "@/lib/motion";

const FILTERS = ["All", "Restaurants", "Beyond restaurants"] as const;
type Filter = (typeof FILTERS)[number];

/**
 * The project index: number, name, hover line, type, year.
 * Hovering a row floats a live preview that trails the cursor (anime.js createAnimatable).
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<"list" | "grid">("list");
  const [hovered, setHovered] = useState<string | null>(null);
  // The preview renders into <body>: ancestors with transforms (scroll reveals) would otherwise
  // trap a position:fixed element and let later sections paint over it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const listRef = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const follower = useRef<ReturnType<typeof createAnimatable> | null>(null);

  const shown = useMemo(
    () => projects.filter((p) => filter === "All" || p.category === filter),
    [projects, filter],
  );

  // Cursor-trailing preview
  useEffect(() => {
    const el = preview.current;
    if (!el || view !== "list" || !mounted) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const reduced = prefersReducedMotion();
    follower.current = createAnimatable(el, {
      x: reduced ? 0 : 650,
      y: reduced ? 0 : 650,
      rotate: reduced ? 0 : 900,
      ease: "out(3)",
    });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      const f = follower.current;
      if (!f) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      // Sit beside the cursor (flip to the left near the right edge) so titles stay readable
      const right = e.clientX + 36 + w < window.innerWidth - 16;
      (f.x as (v: number) => void)(right ? e.clientX + 36 : e.clientX - 36 - w);
      // Centre on the cursor, but never slide under the nav or past the bottom of the screen
      const top = 76;
      const bottom = window.innerHeight - h - 16;
      (f.y as (v: number) => void)(Math.max(top, Math.min(bottom, e.clientY - h / 2)));
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      (f.rotate as (v: number) => void)(Math.max(-6, Math.min(6, dx * 0.35)));
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      follower.current?.revert();
      follower.current = null;
    };
  }, [view, mounted]);

  // Preview show/hide
  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    animate(el, {
      opacity: hovered ? 1 : 0,
      scale: hovered ? 1 : 0.85,
      duration: hovered ? 500 : 300,
      ease: EASE.out,
    });
  }, [hovered]);

  // Re-stage rows after filtering / switching views
  useEffect(() => {
    const el = listRef.current;
    if (!el || prefersReducedMotion()) return;
    const items = el.querySelectorAll("[data-item]");
    utils.set(items, { opacity: 0, y: 30 });
    animate(items, { opacity: [0, 1], y: [30, 0], duration: 700, delay: stagger(60), ease: EASE.out });
  }, [filter, view]);

  const hoveredProject = projects.find((p) => p.slug === hovered);

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-rule pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
          {FILTERS.filter((f) => f === "All" || projects.some((p) => p.category === f))
            .filter((_, __, shown) => shown.length > 2)
            .map((f) => {
            const count = f === "All" ? projects.length : projects.filter((p) => p.category === f).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className="chip"
              >
                {f} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
        <div role="group" aria-label="Layout" className="flex gap-2">
          {(["list", "grid"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className="chip">
              {v === "list" ? "List" : "Grid"}
            </button>
          ))}
        </div>
      </div>

      <div ref={listRef} aria-live="polite">
        {view === "list" ? (
          <ol className="work-list" onPointerLeave={() => setHovered(null)}>
            {shown.map((p) => {
              const n = projects.indexOf(p) + 1;
              return (
                <li key={p.slug} data-item>
                  <TLink
                    href={`/work/${p.slug}`}
                    className="work-row"
                    onPointerEnter={() => setHovered(p.slug)}
                    onFocus={() => setHovered(p.slug)}
                    onBlur={() => setHovered(null)}
                  >
                    <span className="eyebrow w-10 shrink-0 text-accent">{String(n).padStart(2, "0")}</span>
                    <span className="work-row-thumb cover-host relative md:hidden" aria-hidden="true">
                      <ProjectCover project={p} sizes="96px" decorative />
                    </span>
                    <span className="work-row-title display">{p.title}</span>
                    <span className="leader hidden md:block" aria-hidden="true" />
                    <span className="work-row-meta">
                      <span>{p.kind}</span>
                      <span className="hidden xl:inline">{p.services.slice(0, 2).join(" · ")}</span>
                      <span>
                        {p.year}
                        {p.placeholder && <span className="ml-2 text-accent">Placeholder</span>}
                      </span>
                    </span>
                    <span className="row-arrow hidden md:inline-block" aria-hidden="true">→</span>
                  </TLink>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 pt-12 md:grid-cols-2">
            {shown.map((p, i) => (
              <div key={p.slug} data-item className={i % 2 === 1 ? "md:mt-24" : ""}>
                <WorkCard project={p} index={projects.indexOf(p)} aspect="aspect-[16/10]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {mounted &&
        createPortal(
          <div ref={preview} className="work-preview" aria-hidden="true">
            {hoveredProject && (
              <div className="cover-host relative h-full w-full overflow-hidden">
                <ProjectCover project={hoveredProject} sizes="420px" decorative />
                <span className="eyebrow absolute bottom-2 left-2 bg-[var(--ink)] px-2 py-1 !text-[13px] text-[var(--linen)]">
                  {hoveredProject.kind}
                </span>
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
