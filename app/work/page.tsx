import type { Metadata } from "next";
import WorkIndex from "@/components/work/WorkIndex";
import { projects } from "@/content/projects";
import { ContactCTA } from "@/components/home/Sections";

export const metadata: Metadata = {
  title: "Work",
  description: "Restaurant websites designed and built by TableStacks: menus, bookings, ordering and everything behind them.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const anyPlaceholder = projects.some((p) => p.placeholder);
  return (
    <>
      <section className="px-page pb-24 pt-[calc(var(--nav-h)+10svh)] md:pb-36" aria-labelledby="work-h" data-annot="page · /work">
        <div className="flex items-start gap-4">
          <h1 id="work-h" className="display text-[clamp(4rem,14vw,13rem)]" data-split="chars">
            Work
          </h1>
          <span className="mt-[1.2vw] text-[clamp(1.1rem,1.6vw,1.6rem)] font-semibold tabular-nums text-[var(--accent-text)]" data-reveal="scramble">
            ({String(projects.length).padStart(2, "0")})
          </span>
        </div>
        <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-4 md:mt-4">
          <p className="body-lg col-span-12 max-w-[44ch] md:col-span-6 md:col-start-7" data-split="lines">
            Restaurants first, plus the occasional bookshop. Every project is designed and hand-built in-house,
            front of house to back.
          </p>
          {anyPlaceholder && (
            <p className="eyebrow col-span-12 text-muted md:col-span-6 md:col-start-7" data-reveal="fade">
              Sample projects shown. Replace with real work before launch.
            </p>
          )}
        </div>

        <div className="mt-16 md:mt-24" data-reveal="rise">
          <WorkIndex projects={projects} />
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
