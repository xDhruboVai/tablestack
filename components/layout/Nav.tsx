"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { animate, stagger, utils } from "animejs";
import TLink from "./TLink";
import ModeToggle from "./ModeToggle";
import Wordmark from "./Wordmark";
import { nav, site } from "@/content/site";
import { EASE, prefersReducedMotion } from "@/lib/motion";

/** The short line under each page in the phone menu. */
const MENU_NOTES: Record<string, string> = {
  "/": "Start here",
  "/work": "Sites we have built",
  "/pricing": "Starting prices",
  "/about": "Who we are",
  "/contact": "Tell us about your business",
};

export default function Nav({ showWork = true }: { showWork?: boolean }) {
  const pathname = usePathname();
  const links = showWork ? nav : nav.filter((n) => n.href !== "/work");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // Mobile menu choreography + focus management
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    if (open) {
      document.body.style.overflow = "hidden";
      utils.set(el, { visibility: "visible" });
      if (!reduced) {
        animate(el, { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"], duration: 700, ease: EASE.inOut });
        animate(el.querySelectorAll("[data-menu-item]"), {
          y: [28, 0],
          opacity: [0, 1],
          duration: 700,
          delay: stagger(60, { start: 220 }),
          ease: EASE.out,
        });
        animate(el.querySelectorAll("[data-menu-fade]"), { opacity: [0, 1], duration: 600, delay: 550 });
      }
      el.querySelector<HTMLElement>("a")?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
        if (e.key !== "Tab") return;
        // Keep focus inside the menu (plus the close button)
        const items = [menuBtn.current, ...Array.from(el.querySelectorAll<HTMLElement>("a, button"))].filter(
          Boolean,
        ) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
      if (el.style.visibility === "visible") {
        if (reduced) utils.set(el, { visibility: "hidden" });
        else
          animate(el, {
            clipPath: ["inset(0 0 0% 0)", "inset(0 0 100% 0)"],
            duration: 550,
            ease: EASE.inOut,
            onComplete: () => utils.set(el, { visibility: "hidden" }),
          });
        menuBtn.current?.focus({ preventScroll: true });
      }
    }
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const whatsapp = site.social.find((l) => l.label === "WhatsApp")?.href;

  return (
    <>
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`} data-annot="<Nav /> fixed">
        <div className="px-page flex h-[var(--nav-h)] items-center justify-between gap-4">
          <TLink href="/" aria-label={`${site.name}, home`} className="relative z-[70] flex items-center">
            <Wordmark />
          </TLink>

          <nav aria-label="Primary" className="gradient-nav hidden items-center md:flex">
            {[{ label: "Home", href: "/" }, ...links].map((item) => (
              <TLink
                key={item.href}
                href={item.href}
                className="gradient-nav-link nav-link"
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <span className="gradient-nav-glow" aria-hidden="true" />
                <span className="gradient-nav-face">{item.label}</span>
                <span className="gradient-nav-back" aria-hidden="true">{item.label}</span>
              </TLink>
            ))}
          </nav>

          <div className="relative z-[70] flex items-center gap-2 sm:gap-3">
            <ModeToggle />
            <TLink href="/contact" className="btn btn-primary hidden !h-11 !px-5 lg:inline-flex">
              Start a project
            </TLink>
            <button
              ref={menuBtn}
              type="button"
              className="menu-btn md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span className="menu-btn-lines" data-open={open || undefined} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={panel}
        id="mobile-menu"
        className="mobile-menu md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={false}
        style={{ visibility: "hidden" }}
      >
        {/* Each page as a card with a short line about it; the page you are on is the dark one. */}
        <div className="mobile-menu-inner px-page">
          <nav aria-label="Mobile">
            <ul className="mm-list">
              {[{ label: "Home", href: "/" }, ...links].map((item) => (
                <li key={item.href}>
                  <TLink
                    href={item.href}
                    data-menu-item
                    className={`mm-item ${isActive(item.href) ? "is-current" : ""}`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span>
                      <span className="mm-name">{item.label}</span>
                      {MENU_NOTES[item.href] && <span className="mm-note">{MENU_NOTES[item.href]}</span>}
                    </span>
                    <span className="mm-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mm-foot" data-menu-fade>
            <TLink href="/contact" className="mm-cta" onClick={() => setOpen(false)}>
              Start a project
            </TLink>
            <div className="mm-quick">
              <a href={`mailto:${site.email}`}>Email</a>
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              <a href={`tel:${site.phoneIntl}`}>Call</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
