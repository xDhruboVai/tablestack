import ProjectCover from "./ProjectCover";
import type { Project } from "@/content/projects";

export default function ProjectMontage({ projects }: { projects: Project[] }) {
  const pair = projects.slice(0, 2);
  if (pair.length < 2) return null;

  return (
    <div className="project-montage" aria-label="Screenshots of our websites">
      {pair.map((project, index) => (
        <figure className={`project-montage-frame project-montage-frame-${index + 1}`} key={project.slug}>
          <div className="project-montage-image cover-host">
            <ProjectCover project={project} decorative eager sizes="(min-width: 768px) 30vw, 75vw" />
          </div>
          <figcaption>{project.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}
