"use client";

import { Children, useState, type ReactNode } from "react";
import type { Category } from "@/content/projects";

/**
 * Category buttons above the Work grid. The tiles are rendered on the server and passed in as children,
 * one per entry of `categories`; this only decides which of them to show.
 * Buttons appear once the visible projects span two or more categories, in the given `order` (CATEGORIES in content/projects.ts).
 */
export default function WorkFilter({ categories, order, children }: { categories: Category[]; order: readonly Category[]; children: ReactNode }) {
  const [filter, setFilter] = useState<Category | "All">("All");
  const tiles = Children.toArray(children);
  const used = order.filter((c) => categories.includes(c));
  const shown = tiles.filter((_, i) => filter === "All" || categories[i] === filter);

  return (
    <>
      {used.length > 1 && (
        <div role="group" aria-label="Filter projects by industry" className="mt-10 flex flex-wrap gap-2 md:mt-12">
          {(["All", ...used] as const).map((f) => (
            <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f} <span className="opacity-60">({f === "All" ? tiles.length : categories.filter((c) => c === f).length})</span>
            </button>
          ))}
        </div>
      )}
      {/* An odd number of projects: the first one runs the full width, so the last row is never half empty.
          A filter that leaves one project shows it full width too; the narrow single layout is for a site with one project. */}
      <div
        className={`project-tile-grid ${used.length > 1 ? "mt-8 md:mt-10" : "mt-12 md:mt-14"} ${tiles.length === 1 ? "project-tile-grid-single" : shown.length % 2 ? "project-tile-grid-lead" : ""}`}
        data-reveal="rise"
        aria-live="polite"
      >
        {shown}
      </div>
    </>
  );
}
