"use client";

import { useEffect, useRef, useState } from "react";
import TLink from "./TLink";
import { nav, site } from "@/content/site";

function LocalTime() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone });
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t ?? "--:--"}</span>;
}

/** The big wordmark, sized so "TableStack" spans the full content width at any screen size. */
function FooterMark() {
  const box = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const b = box.current;
    const w = word.current;
    if (!b || !w) return;
    // The size is measured and set here, so it must apply instantly: the reduced-motion reset gives
    // every element a tiny transition, which would make the measurement read the old size.
    [b, ...b.querySelectorAll<HTMLElement>("*")].forEach((el) => el.style.setProperty("transition", "none", "important"));
    const fit = () => {
      b.style.fontSize = "100px";
      const natural = w.offsetWidth;
      // The word is pulled left by 0.07em (see .footer-mark-word) so the italic T lines up with the text above.
      if (natural > 7) b.style.fontSize = `${(100 * b.clientWidth) / (natural - 7)}px`;
    };
    // Refit whenever a web font finishes loading (the italic face can arrive after first paint)
    // and when the footer scrolls into view, so it's always measured with the real font.
    fit();
    document.fonts?.ready.then(fit);
    document.fonts?.addEventListener("loadingdone", fit);
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    const io = new IntersectionObserver((e) => e[0]?.isIntersecting && fit());
    io.observe(b);
    return () => {
      ro.disconnect();
      io.disconnect();
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, []);
  return (
    <div ref={box} className="footer-mark" data-reveal="rise">
      <span ref={word} className="footer-mark-word">
        <span className="italic">Table</span>Stack
      </span>
    </div>
  );
}

export default function Footer() {
  const social = site.social.filter((s) => s.href);

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
              <a href={`mailto:${site.email}`} className="link-draw">
                Email us
              </a>
            </li>
            {site.bookingUrl && (
              <li>
                <a href={site.bookingUrl} className="link-draw" target="_blank" rel="noreferrer">
                  Book a call
                </a>
              </li>
            )}
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
          <p className="eyebrow text-muted">Based in</p>
          <p className="mt-4">{site.location}</p>
          <p className="mt-1 whitespace-nowrap tabular-nums text-fg-2">
            Dhaka time <LocalTime />
          </p>
        </div>
      </div>

      <div className="px-page" aria-hidden="true">
        <FooterMark />
      </div>

      <div className="px-page flex flex-col gap-3 border-t border-rule py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Websites first. Tools when needed.
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
