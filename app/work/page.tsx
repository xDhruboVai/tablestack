import { pageMeta } from "@/lib/seo";
import { site } from "@/content/site";
import WorkIndex from "@/components/work/WorkIndex";
import BuildTicker from "@/components/work/BuildTicker";
import { projects } from "@/content/projects";
import { ContactCTA } from "@/components/home/Sections";

export const metadata = pageMeta({
  title: "Work",
  description: `Websites ${site.name} has designed and built for businesses in Bangladesh, each with a case study and a link to the live site.`,
  path: "/work",
});

export default function WorkPage() {
  const anyPlaceholder = projects.some((p) => p.placeholder);
  return (
    <>
      <section className="px-page pb-24 pt-[calc(var(--nav-h)+6svh)] md:pb-28" aria-labelledby="work-h" data-annot="page · /work">
        {/* Title on the left, intro beside it on the right, so the header stays compact. */}
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <div className="col-span-12 flex items-start gap-4 md:col-span-7">
            <h1 id="work-h" className="display text-[clamp(4rem,14vw,13rem)]" data-split="chars">
              Work
            </h1>
            <span className="mt-[1.2vw] text-[clamp(1.1rem,1.6vw,1.6rem)] font-semibold tabular-nums text-[var(--accent-text)]" data-reveal="scramble">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
          </div>
          <div className="col-span-12 md:col-span-5 md:pb-[1.2vw]">
            <p className="body-lg max-w-[44ch]" data-split="lines">
              Our ongoing works so far. We’re a young team, so the list is short and there’s more in progress.
            </p>
            {anyPlaceholder && (
              <p className="eyebrow mt-4 text-muted" data-reveal="fade">
                Sample projects shown. Replace with real work before launch.
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 md:mt-16" data-reveal="rise">
          <WorkIndex projects={projects} />
        </div>

        {/* The list is short for now, so follow it with the range of work we take on. */}
        <div className="mt-16 md:mt-20" data-reveal="rise">
          <BuildTicker />
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
