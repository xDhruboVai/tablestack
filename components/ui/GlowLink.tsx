"use client";

import type { PointerEvent, ReactNode } from "react";
import TLink from "@/components/layout/TLink";

export default function GlowLink({
  href,
  children,
  tone = "primary",
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "invert";
}) {
  const trackPointer = (event: PointerEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <TLink href={href} className={`btn glow-link ${tone === "invert" ? "glow-link-invert" : ""}`} onPointerMove={trackPointer}>
      <span className="glow-link-label">{children}</span>
      <span className="glow-link-orb" aria-hidden="true">
        <svg className="glow-link-arrow" viewBox="0 0 16 16" fill="none">
          <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </TLink>
  );
}
