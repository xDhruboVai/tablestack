import Image from "next/image";
import ProjectMock from "./ProjectMock";
import type { Project } from "@/content/projects";

/**
 * A project's cover image, cropped like `object-fit: cover` but through a centered 16:10 box,
 * so overlays positioned in % of the image (lens annotations) stay aligned in any container shape.
 * Parent must be `position: relative` with `container-type: size` (the `.cover-host` class).
 * Falls back to code-drawn artwork when there's no cover image.
 */
export default function ProjectCover({
  project,
  variant = "foh",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
  decorative = false,
}: {
  project: Project;
  variant?: "foh" | "boh";
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const cover = project.media?.cover;

  if (!cover) {
    return (
      <ProjectMock
        project={project}
        layer={variant}
        slice
        title={decorative || variant === "boh" ? undefined : `${project.title} website preview (placeholder artwork)`}
      />
    );
  }

  const boh = variant === "boh";
  const bohSrc = project.media?.coverBoh;
  const focus = project.media?.focusX ?? 50;

  return (
    <div
      className="cover-box"
      style={{ background: boh ? "#15130F" : project.art.palette.bg, left: `${focus}%`, transform: `translate(-${focus}%, -50%)` }}
    >
      <Image
        src={boh && bohSrc ? bohSrc : cover}
        alt={decorative || variant === "boh" ? "" : project.media?.coverAlt ?? `${project.title} website`}
        fill
        sizes={sizes}
        priority={priority}
        className={boh && !bohSrc ? "blueprint-img object-cover" : "object-cover"}
      />
      {variant === "boh" && (
        <>
          <div className="blueprint-grid" aria-hidden="true" />
          {project.media?.annotations?.map((a) => (
            <div
              key={a.label}
              className={`blueprint-box ${a.x >= 50 ? "is-right" : ""}`}
              style={{ left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}%`, height: `${a.h}%` }}
            >
              <span>{a.label}</span>
            </div>
          ))}
          <span className="blueprint-stack">stack: {project.stack.join(" · ")}</span>
        </>
      )}
    </div>
  );
}
