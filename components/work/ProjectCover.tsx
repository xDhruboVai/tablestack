import Image from "next/image";
import ProjectMock from "./ProjectMock";
import type { Project } from "@/content/projects";

/**
 * A project's cover image, cropped like `object-fit: cover` but through a centered 16:10 box,
 * so the image frames the same way in any container shape.
 * Parent must be `position: relative` with `container-type: size` (the `.cover-host` class).
 * Falls back to code-drawn artwork when there's no cover image.
 */
export default function ProjectCover({
  project,
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
  decorative = false,
}: {
  project: Project;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const cover = project.media?.cover;

  if (!cover) {
    return (
      <ProjectMock
        project={project}
        layer="foh"
        slice
        title={decorative ? undefined : `${project.title} website preview (placeholder artwork)`}
      />
    );
  }

  const focus = project.media?.focusX ?? 50;

  return (
    <div
      className="cover-box"
      style={{ background: project.art.palette.bg, left: `${focus}%`, transform: `translate(-${focus}%, -50%)` }}
    >
      <Image
        src={cover}
        alt={decorative ? "" : project.media?.coverAlt ?? `${project.title} website`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
