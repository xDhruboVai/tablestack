"use client";

import { useEffect, useState } from "react";
import TLink from "./TLink";
import { nav, site } from "@/content/site";

function LocalTime() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t ?? "--:--"}</span>;
}

export default function Footer() {
  const social = site.social.filter((s) => s.href);
  const bookHref = site.bookingUrl || `mailto:${site.email}?subject=${encodeURIComponent("Book a call")}`;

  return (
    <footer className="site-footer relative z-[2] overflow-hidden border-t border-rule" data-annot="<Footer />">
      <div className="px-page grid grid-cols-2 gap-x-6 gap-y-10 pb-14 pt-16 md:grid-cols-12 md:pt-24">
        <div className="col-span-2 md:col-span-5">
          <p className="eyebrow text-muted">Say hello</p>
          <a href={`mailto:${site.email}`} className="footer-email mt-4 inline-block font-display text-[clamp(1.4rem,2vw,2rem)] font-bold leading-tight tracking-[-0.03em]">
            {site.email}
          </a>
          <p className="mt-4 max-w-[34ch] text-fg-2">{site.responseTime}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-2 md:col-start-7">
          <p className="eyebrow text-muted">Studio</p>
          <ul className="mt-4 flex flex-col gap-2">
            <li>
              <TLink href="/" className="link-draw">
                Home
              </TLink>
            </li>
            {nav.map((n) => (
              <li key={n.href}>
                <TLink href={n.href} className="link-draw">
                  {n.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="eyebrow text-muted">Contact</p>
          <ul className="mt-4 flex flex-col gap-2">
            <li>
              <TLink href="/contact" className="link-draw">
                Start a project
              </TLink>
            </li>
            <li>
              <a href={bookHref} className="link-draw" {...(site.bookingUrl ? { target: "_blank", rel: "noreferrer" } : {})}>
                Book a call
              </a>
            </li>
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="link-draw" target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow text-muted">Kitchen</p>
          <p className="mt-4">{site.location}</p>
          <p className="mt-1 tabular-nums text-fg-2">
            Local time <LocalTime />
          </p>
        </div>
      </div>

      <div className="px-page" aria-hidden="true">
        <div className="footer-mark" data-reveal="rise">
          <span className="italic">Table</span>
          <span>Stacks</span>
        </div>
      </div>

      <div className="px-page flex flex-col gap-3 border-t border-rule py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Front of house to back.
        </p>
        <button
          type="button"
          className="eyebrow link-draw self-start sm:self-auto"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
