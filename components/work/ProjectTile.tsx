import TLink from "@/components/layout/TLink";
import ProjectCover from "./ProjectCover";
import type { Project } from "@/content/projects";

const descriptions: Record<string, string> = {
  "smashed-burgers": "Bilingual menu and branch information for six locations.",
  pinewood: "Branch pricing, bookings and pre-orders across three cafés.",
  "brisket-and-bistro": "A 114-item menu, the dining room and the way up to Level 5.",
  "shang-high": "A searchable menu and a page for each of four outlets.",
  "rustic-eatery": "One menu, a monthly offer and four branches.",
  "the-backyard-chef": "A menu for each of two branches, with sharing platters.",
};

/** `eager` loads the cover straight away: use it where the tile is on screen when the page opens. */
export default function ProjectTile({ project, headingLevel = 3, eager = false }: { project: Project; headingLevel?: 2 | 3; eager?: boolean }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="project-tile group">
      <TLink href={`/work/${project.slug}`} className="project-tile-link">
        <div className="project-tile-media cover-host">
          <ProjectCover project={project} eager={eager} sizes="(min-width: 768px) 50vw, 100vw" />
          {project.concept && <span className="concept-tag project-tile-tag">Concept</span>}
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
