import TLink from "@/components/layout/TLink";
import ProjectCover from "./ProjectCover";
import { BrowserBar, siteHost, stageColors } from "./Shot";
import type { Project } from "@/content/projects";

const descriptions: Record<string, string> = {
  "basic-kneads": "Fifty items to add as you read, then one order with a delivery time.",
  "smashed-burgers": "Bilingual menu and branch information for six locations.",
  pinewood: "Branch pricing, bookings and pre-orders across three cafés.",
  "brisket-and-bistro": "A 114-item menu, the dining room and the way up to Level 5.",
  "shang-high": "A searchable menu and a page for each of four outlets.",
  "rustic-eatery": "One menu, a monthly offer and four branches.",
  "the-backyard-chef": "A menu for each of two branches, with sharing platters.",
  threadline: "Twenty pieces with filters, and checkout with Cash on Delivery.",
};

/** `eager` loads the cover straight away: use it where the tile is on screen when the page opens. */
export default function ProjectTile({ project, headingLevel = 3, eager = false }: { project: Project; headingLevel?: 2 | 3; eager?: boolean }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="project-tile group">
      <TLink href={`/work/${project.slug}`} className="project-tile-link">
        {/* The site in a browser window, on the project's own colours. */}
        <div className="project-tile-media" style={stageColors(project)}>
          <div className="shot-win project-tile-win">
            <BrowserBar host={siteHost(project)} />
            <div className="shot-view cover-host aspect-[16/10]">
              <ProjectCover project={project} eager={eager} sizes="(min-width: 768px) 40vw, 80vw" />
            </div>
          </div>
        </div>
        <div className="project-tile-info">
          <div>
            <p className="project-tile-meta eyebrow text-accent">
              {project.concept && <span className="concept-tag">Concept</span>}
              {!project.concept && !project.placeholder && <span className="client-tag">Client project</span>}
              <span>{project.category} · {project.location}</span>
            </p>
            <Heading className="display project-tile-title">{project.title}</Heading>
            <p className="project-tile-description">{descriptions[project.slug] ?? project.summary}</p>
          </div>
          <span className="project-tile-arrow" aria-hidden="true">↗</span>
        </div>
      </TLink>
    </article>
  );
}
