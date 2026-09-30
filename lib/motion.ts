/**
 * Motion language
 * ───────────────
 * Front of house (display type, images) RISES out of a mask - like a plate arriving.
 * Back of house (mono, lines, diagrams) DRAWS or SCRAMBLES - like a system booting.
 * Everything uses the same two eases and three durations.
 */

export const EASE = {
  out: "out(4)", // quart-ish, decisive arrival
  inOut: "inOut(4)", // for covers and transitions
  soft: "out(2)",
  settle: "outBack(1.15)", // plates landing on the stack
} as const;

export const DUR = {
  micro: 380,
  base: 900,
  slow: 1300,
} as const;

export const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* The intro (loader) broadcasts when the page is ready for its hero choreography. */
declare global {
  interface Window {
    __tsIntroDone?: boolean;
  }
}

export function onIntroDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if (window.__tsIntroDone) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("ts:intro-done", handler, { once: true });
  return () => window.removeEventListener("ts:intro-done", handler);
}

export function markIntroDone() {
  window.__tsIntroDone = true;
  window.dispatchEvent(new Event("ts:intro-done"));
}

/** Runs `cb` once, the first time `el` scrolls into view. Returns a cleanup. */
export function whenInView(el: Element, cb: () => void, threshold = 0.35, rootMargin = "0px") {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { threshold, rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}
