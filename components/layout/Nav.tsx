"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { animate, stagger, utils } from "animejs";
import TLink from "./TLink";
import ModeToggle from "./ModeToggle";
import Wordmark from "./Wordmark";
import { nav, site } from "@/content/site";
import { EASE, prefersReducedMotion } from "@/lib/motion";

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
          y: ["110%", "0%"],
          duration: 900,
          delay: stagger(70, { start: 250 }),
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

  return (
    <>
      <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`} data-annot="<Nav /> fixed">
        <div className="px-page flex h-[var(--nav-h)] items-center justify-between gap-4">
          <TLink href="/" aria-label={`${site.name}, home`} className="relative z-[70]">
            <Wordmark />
          </TLink>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {links.map((item) => (
              <TLink
                key={item.href}
                href={item.href}
                className="link-draw nav-link"
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
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
        <div className="px-page flex h-full flex-col justify-between pb-8 pt-[calc(var(--nav-h)+5svh)]">
          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-1">
              {[{ label: "Home", href: "/" }, ...links].map((item) => (
                <li key={item.href} className="split-line">
                  <TLink
                    href={item.href}
                    data-menu-item
                    className="flex items-baseline gap-4 py-1"
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className="display text-[clamp(2.6rem,12vw,4.2rem)]">{item.label}</span>
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-5" data-menu-fade>
            <TLink href="/contact" className="btn btn-primary self-start" onClick={() => setOpen(false)}>
              Start a project <span className="btn-arrow">→</span>
            </TLink>
            <a href={`mailto:${site.email}`} className="text-lg">
              {site.email}
            </a>
            <p className="eyebrow text-muted">{site.availability}</p>
          </div>
        </div>
      </div>
    </>
  );
}
