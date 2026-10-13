import Image from "next/image";
import type { CSSProperties } from "react";
import { projects, type Project, type ProjectLook } from "@/content/projects";

/**
 * How a screenshot is presented:
 *   brand   a browser window on the project's own colours
 *   studio  a browser window on our off-white
 *   angled  tilted browser windows on black
 *   plain   the image on its own, with rounded corners and a soft shadow
 * Each project page uses one of these for all of its screenshots (see lookFor).
 */
export type ShotLook = ProjectLook;

const LOOKS: ShotLook[] = ["studio", "brand", "angled", "plain"];

/** The look a project's screenshots use: the one set on the project, or the next in turn by its place in the list. */
export function lookFor(project: Project): ShotLook {
  return project.look ?? LOOKS[Math.max(0, projects.findIndex((p) => p.slug === project.slug)) % LOOKS.length];
}

const brightness = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

/** True when the project's own site is mostly dark, so its browser bar should be dark too. */
export const darkSite = (project: Project) => brightness(project.art.palette.bg) < 0.4;

/** The project's colours for a backdrop: always a dark base, lit by one of its brighter colours. */
export function stageColors(project: Project): CSSProperties {
  const { bg, fg, accent, soft } = project.art.palette;
  const dark = darkSite(project);
  // A second colour that is nearly as dark as the base would not show, so the accent lights it instead.
  const glow = dark && brightness(soft) - brightness(bg) > 0.04 ? soft : accent;
  return { "--st-base": dark ? bg : fg, "--st-glow": glow, "--st-accent": accent } as CSSProperties;
}

export const siteHost = (project: Project) => (project.liveUrl ? new URL(project.liveUrl).host : "");

/** The top bar of a browser window. Decoration only. */
export function BrowserBar({ host, light = false }: { host: string; light?: boolean }) {
  return (
    <div className={`shot-bar ${light ? "shot-bar-light" : ""}`} aria-hidden="true">
      <span className="shot-dots">
        <i />
        <i />
        <i />
      </span>
      {host ? <span className="shot-addr">{host}</span> : <span />}
      <span />
    </div>
  );
}

export default function Shot({
  project,
  src,
  alt,
  look,
  wide = false,
  behind,
}: {
  project: Project;
  src: string;
  alt: string;
  look: ShotLook;
  wide?: boolean;
  /** For the wide angled look: a second screenshot shown behind the first. */
  behind?: string;
}) {
  const host = siteHost(project);
  const shape = wide ? "shot-wide" : "shot-square";
  const sizes = wide ? "(min-width: 1024px) 75vw, 100vw" : "(min-width: 1024px) 37vw, (min-width: 768px) 50vw, 100vw";

  if (look === "plain") {
    return (
      <div className={`shot shot-plain ${shape}`} data-reveal="rise">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  if (look === "angled") {
    return (
      <div className={`shot shot-angled ${shape}`} style={stageColors(project)} data-reveal="mask">
        <div data-mask-inner className="shot-inner">
          {wide ? (
            <>
              {behind && (
                <div className="shot-win shot-win-back">
                  <BrowserBar host={host} />
                  <div className="shot-view aspect-square">
                    <Image src={behind} alt="" fill sizes="(min-width: 1024px) 46vw, 62vw" className="object-cover object-top" />
                  </div>
                </div>
              )}
              <div className="shot-win shot-win-front">
                <BrowserBar host={host} />
                <div className="shot-view aspect-[16/10]">
                  <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 50vw, 66vw" className="object-cover object-top" />
                </div>
              </div>
            </>
          ) : (
            <div className="shot-win shot-win-solo">
              <BrowserBar host={host} />
              <div className="shot-view aspect-square">
                <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // A browser window on a backdrop. Wide: the whole page, floating. Square: the top of the page, running off the bottom.
  const light = look === "studio";
  return (
    <div className={`shot shot-${look} ${shape}`} style={light ? undefined : stageColors(project)} data-reveal="mask">
      <div data-mask-inner className="shot-inner">
        <div className={`shot-win ${wide ? "shot-win-float" : "shot-win-peek"} ${light ? "shot-win-light" : ""}`}>
          <BrowserBar host={host} light={light} />
          <div className={`shot-view ${wide ? "aspect-[16/10]" : ""}`}>
            <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />
          </div>
        </div>
      </div>
    </div>
  );
}
