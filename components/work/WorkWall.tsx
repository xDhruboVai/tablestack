import type { ReactNode } from "react";
import ProjectCover from "./ProjectCover";
import WallPace from "./WallPace";
import { BrowserBar, siteHost } from "./Shot";
import type { Project } from "@/content/projects";

/**
 * The top of the Work page: a black panel with a tilted wall of every site drifting behind the title.
 * The wall is decoration; the title and intro are passed in as children.
 */
export default function WorkWall({ projects, children }: { projects: Project[]; children: ReactNode }) {
  // At least six windows per column, so a column is always taller than the panel, whatever is switched on.
  const base = Array.from({ length: Math.max(6, projects.length) }, (_, i) => projects[i % projects.length]);
  // Each column starts at a different site, so neighbours never line up.
  const columns = [0, 2, 5, 1].map((k) => [...base.slice(k % base.length), ...base.slice(0, k % base.length)]);

  return (
    <div className="work-wall">
      <div className="work-wall-scene" aria-hidden="true">
        <div className="work-wall-plane">
          {columns.map((column, c) => (
            <div className="work-wall-col" key={c}>
              {/* The list twice over: it slides up by one list's height, then starts again unnoticed. */}
              <div className="work-wall-track" style={{ animationDelay: `${-c * 11}s` }}>
                {[...column, ...column].map((project, i) => (
                  <div className="work-wall-item" key={i}>
                    <div className="shot-win">
                      <BrowserBar host={siteHost(project)} />
                      <div className="shot-view cover-host aspect-[16/10]">
                        <ProjectCover project={project} decorative eager sizes="(min-width: 768px) 30vw, 70vw" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="work-wall-copy">{children}</div>
      <WallPace />
    </div>
  );
}
