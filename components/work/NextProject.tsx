import TLink from "@/components/layout/TLink";
import ProjectCover from "./ProjectCover";
import type { Project } from "@/content/projects";

/** Big "next project" link at the end of a case study. */
export default function NextProject({ project }: { project: Project }) {
  return (
    <section className="px-page pb-24 pt-10 md:pb-32" aria-label="Next project">
      <TLink href={`/work/${project.slug}`} className="next-project group grid grid-cols-12 items-end gap-x-6 gap-y-6 border-t border-rule pt-10">
        <div className="col-span-12 md:col-span-7">
          <p className="eyebrow text-accent">Next project →</p>
          <p className="display mt-4 text-[clamp(3rem,8.5vw,9rem)] transition-[font-style] group-hover:italic">{project.title}</p>
          <p className="eyebrow mt-3 text-muted">{project.kind}</p>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="next-project-media aspect-[16/10] overflow-hidden">
            <div className="cover-host relative h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-out-quart)] group-hover:scale-[1.05]">
              <ProjectCover project={project} sizes="(min-width: 768px) 40vw, 100vw" decorative />
            </div>
          </div>
        </div>
      </TLink>
    </section>
  );
}
