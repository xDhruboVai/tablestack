"use client";

import { useRef, useState, type FocusEvent, type MouseEvent } from "react";
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

export default function TeamLinks({ member }: { member: Member }) {
  const dock = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const firstName = member.name.split(" ")[0];
  const links: DockLink[] = [
    ...(member.github
      ? [{ kind: "github" as const, label: "GitHub", href: member.github, detail: `See ${firstName}'s code and projects.`, destination: "github.com" }]
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

  const show = (event: MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>, index: number) => {
    const host = dock.current;
    if (!host) return;
    const hostBounds = host.getBoundingClientRect();
    const linkBounds = event.currentTarget.getBoundingClientRect();
    const previewWidth = Math.min(320, hostBounds.width);
    const centered = linkBounds.left - hostBounds.left + linkBounds.width / 2 - previewWidth / 2;
    host.style.setProperty("--preview-x", `${Math.max(0, Math.min(centered, hostBounds.width - previewWidth))}px`);
    setActive(index);
  };

  const hideOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
  };

  const current = active === null ? null : links[active];

  return (
    <div ref={dock} className="team-social-dock mt-5" onPointerLeave={() => setActive(null)} onBlur={hideOnBlur} onKeyDown={(event) => {
      if (event.key === "Escape") setActive(null);
    }}>
      <div className="team-preview" data-open={current ? "true" : undefined} aria-hidden="true">
        {current && (
          <div key={current.kind} className="team-preview-content">
            <p className="mono text-[12px] uppercase tracking-[0.12em] text-accent">{current.label} ↗</p>
            <p className="mt-2 font-semibold leading-snug">{current.detail}</p>
            <p className="mono mt-4 text-[12px] text-muted">{current.destination}</p>
          </div>
        )}
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
