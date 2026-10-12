import TLink from "@/components/layout/TLink";
import ProjectCover from "./ProjectCover";
import type { Project } from "@/content/projects";

const descriptions: Record<string, string> = {
  "smashed-burgers": "Bilingual menu and branch information for six locations.",
  pinewood: "Branch pricing, bookings and pre-orders across three cafés.",
};

export default function ProjectTile({ project, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="project-tile group">
      <TLink href={`/work/${project.slug}`} className="project-tile-link">
        <div className="project-tile-media cover-host">
          <ProjectCover project={project} sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <div className="project-tile-info">
          <div>
            <p className="eyebrow text-accent">{project.category} · {project.location}</p>
            <Heading className="display project-tile-title">{project.title}</Heading>
            <p className="project-tile-description">{descriptions[project.slug] ?? project.summary}</p>
          </div>
          <span className="project-tile-arrow" aria-hidden="true">↗</span>
        </div>
      </TLink>
    </article>
  );
}
