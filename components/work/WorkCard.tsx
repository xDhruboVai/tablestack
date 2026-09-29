import TLink from "@/components/layout/TLink";
import LensMedia from "./LensMedia";
import type { Project } from "@/content/projects";

/** Project card: lens preview + number, type, title, services. */
export default function WorkCard({
  project,
  index,
  aspect = "aspect-[16/10]",
  titleSize = "text-[clamp(2rem,3.2vw,3.2rem)]",
}: {
  project: Project;
  index: number;
  aspect?: string;
  titleSize?: string;
}) {
  return (
    <article className="work-card group">
      <TLink href={`/work/${project.slug}`} className="block">
        <LensMedia project={project} aspect={aspect} />
        <div className="mt-5 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="eyebrow text-muted" data-reveal="scramble">
              {String(index + 1).padStart(2, "0")} · {project.kind}
            </p>
            <h3 className={`display mt-2 flex flex-wrap items-baseline gap-x-3 ${titleSize}`}>
              <span className="work-card-title">{project.title}</span>
              <span className="work-card-arrow text-accent" aria-hidden="true">
                →
              </span>
            </h3>
          </div>
          <ul className="eyebrow hidden shrink-0 pt-1 text-right text-muted xl:block">
            {project.services.slice(0, 3).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </TLink>
    </article>
  );
}
