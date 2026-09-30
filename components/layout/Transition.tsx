"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { nav } from "@/content/site";
import { usePathname, useRouter } from "next/navigation";
import { animate, scrambleText, utils } from "animejs";
import { EASE, SCRAMBLE_CHARS, prefersReducedMotion } from "@/lib/motion";

/**
 * Page transitions: an ink panel swings up over the page, the route name
 * types itself in, the next page loads underneath, then the door lifts away.
 */

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const useTransitionNav = () => useContext(TransitionContext);

declare global {
  interface Window {
    __tsCovered?: boolean;
  }
}

/** Run a callback once the page is uncovered (immediately if it already is). */
export function whenUncovered(cb: () => void) {
  if (!window.__tsCovered) return cb();
  window.addEventListener("ts:uncovered", () => cb(), { once: true });
}

function labelFor(href: string) {
  const path = href.split(/[?#]/)[0];
  if (path === "/") return "Home";
  const named = nav.find((n) => n.href === path);
  if (named) return named.label;
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const door = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const path = useRef<HTMLSpanElement>(null);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const lift = useCallback(() => {
    if (!door.current) return;
    pending.current = null;
    const d = door.current;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    animate(d, {
      y: ["0%", "-100%"],
      duration: 760,
      delay: 140,
      ease: EASE.inOut,
      onBegin: () => {
        window.__tsCovered = false;
        window.dispatchEvent(new Event("ts:uncovered"));
      },
      onComplete: () => {
        utils.set(d, { visibility: "hidden" });
        busy.current = false;
        // Put keyboard and screen-reader users at the start of the new page
        document.getElementById("main")?.focus({ preventScroll: true });
      },
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const target = href.split("#")[0] || "/";
      if (busy.current) return;
      if (prefersReducedMotion() || !door.current || target === pathname) {
        router.push(href);
        return;
      }
      busy.current = true;
      pending.current = target;
      window.__tsCovered = true;

      const d = door.current;
      title.current!.textContent = labelFor(target);
      path.current!.textContent = target;
      utils.set(d, { visibility: "visible", y: "100%" });
      utils.set(title.current!, { y: "110%" });

      animate(d, {
        y: ["100%", "0%"],
        duration: 620,
        ease: EASE.inOut,
        onComplete: () => {
          router.push(href);
          // Safety net: if the route never changes (error, same page), lift the door anyway.
          window.setTimeout(() => {
            if (pending.current === target) lift();
          }, 4000);
        },
      });
      animate(title.current!, { y: ["110%", "0%"], duration: 700, delay: 260, ease: EASE.out });
      animate(path.current!, {
        innerHTML: scrambleText({ chars: SCRAMBLE_CHARS }),
        duration: 600,
        delay: 200,
      });
    },
    [pathname, router, lift],
  );


  useEffect(() => {
    if (pending.current) lift();
  }, [pathname, lift]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={door} className="page-door" aria-hidden="true">
        <div className="page-door-inner px-page">
          <span className="eyebrow text-accent" ref={path} />
          <span className="split-line">
            <span ref={title} className="display block text-[clamp(3rem,11vw,10rem)]" />
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
