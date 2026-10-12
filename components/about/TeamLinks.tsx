"use client";

import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type MouseEvent } from "react";
import SocialIcon from "@/components/ui/SocialIcon";

type Member = {
  name: string;
  facebook: string;
  whatsapp: string;
  github?: string;
  portfolio?: string;
};

type LinkKind = "github" | "portfolio" | "facebook" | "whatsapp";
type DockLink = { kind: LinkKind; label: string; href: string; detail: string; destination: string };
type Contribution = { date: string; count: number; level: number };
type GithubActivity = { total?: number; days: Contribution[] };

const EMPTY_DAYS = Array.from({ length: 364 }, () => 0);

export default function TeamLinks({ member }: { member: Member }) {
  const dock = useRef<HTMLDivElement>(null);
  const requestedGithub = useRef(false);
  const [active, setActive] = useState<number | null>(null);
  const [githubActivity, setGithubActivity] = useState<GithubActivity | null>(null);
  const [box, setBox] = useState({ x: 0, width: 320, height: 164 });
  const firstName = member.name.split(" ")[0];
  const username = member.github?.split("/").filter(Boolean).at(-1);
  const links: DockLink[] = [
    ...(member.github
      ? [{ kind: "github" as const, label: "GitHub", href: member.github, detail: `See ${firstName}'s code and projects.`, destination: username ? `github.com/${username}` : "github.com" }]
      : []),
    ...(member.portfolio
      ? [{ kind: "portfolio" as const, label: "Portfolio", href: member.portfolio, detail: `Explore ${firstName}'s selected work.`, destination: "saalim.space" }]
      : []),
    { kind: "facebook", label: "Facebook", href: member.facebook, detail: `Visit ${firstName}'s Facebook profile.`, destination: "facebook.com" },
    {
      kind: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/880${member.whatsapp.slice(1)}`,
      detail: `Message ${firstName} directly.`,
      destination: member.whatsapp,
    },
  ];
  const current = active === null ? null : links[active];
  const githubActive = current?.kind === "github";

  useEffect(() => {
    if (!githubActive || !username || requestedGithub.current) return;
    requestedGithub.current = true;
    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`)
      .then((response) => {
        if (!response.ok) throw new Error("GitHub activity unavailable");
        return response.json() as Promise<{ total?: { lastYear?: number }; contributions?: Contribution[] }>;
      })
      .then((data) => {
        if (Array.isArray(data.contributions)) {
          setGithubActivity({ total: data.total?.lastYear, days: data.contributions.slice(-364) });
        }
      })
      .catch(() => {
        // The preview still works when the public activity service is unavailable.
      });
  }, [githubActive, username]);

  const show = (event: MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>, index: number) => {
    const host = dock.current;
    if (!host) return;
    const hostBounds = host.getBoundingClientRect();
    const linkBounds = event.currentTarget.getBoundingClientRect();
    const kind = links[index].kind;
    const width = Math.min(kind === "github" ? 390 : kind === "portfolio" ? 330 : 300, hostBounds.width, window.innerWidth - 24);
    const height = kind === "github" ? 204 : kind === "portfolio" ? 176 : 164;
    const centered = linkBounds.left - hostBounds.left + linkBounds.width / 2 - width / 2;
    const minX = Math.max(0, 12 - hostBounds.left);
    const maxX = Math.min(hostBounds.width - width, window.innerWidth - 12 - width - hostBounds.left);
    setBox({ x: Math.max(minX, Math.min(centered, maxX)), width, height });
    setActive(index);
  };

  const hideOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
  };

  const graph = githubActivity?.days.map((day) => Math.max(0, Math.min(4, day.level))) ?? EMPTY_DAYS;
  const boxStyle = {
    "--preview-x": `${box.x}px`,
    "--preview-width": `${box.width}px`,
    "--preview-height": `${box.height}px`,
  } as CSSProperties;

  return (
    <div
      ref={dock}
      className="team-social-dock mt-5"
      style={boxStyle}
      onPointerLeave={() => setActive(null)}
      onBlur={hideOnBlur}
      onKeyDown={(event) => { if (event.key === "Escape") setActive(null); }}
    >
      <div className="team-preview-bridge" data-open={current ? "true" : undefined} aria-hidden="true">
        <div className="team-preview">
          {current && (
            <div key={current.kind} className="team-preview-content">
              {current.kind === "github" ? (
                <>
                  <div className="team-preview-heading">
                    <span className="team-preview-mark"><SocialIcon name="github" /></span>
                    <div className="min-w-0">
                      <p className="team-preview-title">{username}</p>
                      <p className="team-preview-subtitle">
                        {githubActivity?.total === undefined
                          ? "Contributions in the last year"
                          : `${githubActivity.total.toLocaleString()} contributions in the last year`}
                      </p>
                    </div>
                    <span className="team-preview-arrow">↗</span>
                  </div>
                  <div className="team-contribution-graph">
                    {graph.map((level, day) => <span key={day} data-level={level} />)}
                  </div>
                  <p className="team-preview-destination">{current.destination}</p>
                </>
              ) : (
                <>
                  <div className="team-preview-heading">
                    <span className="team-preview-mark">
                      {current.kind === "portfolio" ? <span>↗</span> : <SocialIcon name={current.kind} />}
                    </span>
                    <span className="team-preview-kind">{current.label}</span>
                    <span className="team-preview-arrow">↗</span>
                  </div>
                  <p className="team-preview-detail">{current.detail}</p>
                  <p className="team-preview-destination">{current.destination}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <ul className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <li key={link.kind}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="team-chip"
              data-active={active === index ? "true" : undefined}
              onPointerEnter={(event) => show(event, index)}
              onFocus={(event) => show(event, index)}
              aria-label={`${link.label} for ${member.name} (opens in a new tab)`}
            >
              {link.kind === "portfolio" ? <span aria-hidden="true">↗</span> : <SocialIcon name={link.kind} />}
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
