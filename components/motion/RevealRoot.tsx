"use client";

import { useEffect } from "react";
import { animate, scrambleText, splitText, stagger, utils } from "animejs";
import { DUR, EASE, SCRAMBLE_CHARS, onIntroDone, prefersReducedMotion } from "@/lib/motion";
import { whenUncovered } from "@/components/layout/Transition";

/**
 * One observer drives every scroll-in reveal on the site, declared in markup:
 *
 *   data-split="lines"     paragraph/heading lines rise from a mask (front of house)
 *   data-split="chars"     display type, character by character
 *   data-reveal="rise"     block fades up
 *   data-reveal="fade"
 *   data-reveal="stagger"  direct children rise in sequence
 *   data-reveal="draw"     rules and leaders draw left → right (back of house)
 *   data-reveal="scramble" mono text decodes
 *   data-reveal="mask"     media wipes up from a clip, content settles from 1.12×
 *   data-delay="120"       optional delay in ms
 */

const SELECTOR = "[data-reveal]:not([data-bound]), [data-split]:not([data-bound])";

function reveal(el: HTMLElement) {
  const delay = Number(el.dataset.delay || 0);
  const kind = el.dataset.reveal;
  const split = el.dataset.split;

  if (split) {
    const s = splitText(el, {
      lines: { class: "split-line" },
      words: { class: "split-word" },
      chars: split === "chars" ? { class: "split-char" } : false,
    });
    const lines = s.lines as HTMLElement[];
    lines.forEach((line) => {
      const parts = line.querySelectorAll<HTMLElement>(split === "chars" ? ".split-char" : ".split-word");
      utils.set(parts, { y: "110%" });
    });
    el.setAttribute("data-revealed", "");
    let remaining = lines.length;
    lines.forEach((line, i) => {
      const parts = line.querySelectorAll<HTMLElement>(split === "chars" ? ".split-char" : ".split-word");
      animate(parts, {
        y: ["110%", "0%"],
        duration: split === "chars" ? 1000 : DUR.base,
        ease: EASE.out,
        delay: split === "chars" ? stagger(18, { start: delay + i * 90 }) : delay + i * 85,
        onComplete: () => {
          if (--remaining === 0) s.revert();
        },
      });
    });
    return;
  }

  el.setAttribute("data-revealed", "");
  switch (kind) {
    case "fade":
      animate(el, { opacity: [0, 1], duration: DUR.base, delay, ease: EASE.soft });
      break;
    case "draw":
      animate(el, { scaleX: [0, 1], duration: DUR.slow, delay, ease: EASE.inOut });
      break;
    case "stagger": {
      const kids = Array.from(el.children) as HTMLElement[];
      utils.set(kids, { opacity: 0, y: 28 });
      utils.set(el, { opacity: 1 });
      animate(kids, { opacity: [0, 1], y: [28, 0], duration: DUR.base, ease: EASE.out, delay: stagger(75, { start: delay }) });
      break;
    }
    case "scramble":
      utils.set(el, { opacity: 1 });
      animate(el, {
        innerHTML: scrambleText({ chars: SCRAMBLE_CHARS }),
        duration: Math.min(900, 300 + (el.textContent?.length ?? 10) * 18),
        delay,
      });
      break;
    case "mask": {
      utils.set(el, { opacity: 1 });
      animate(el, {
        clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
        duration: DUR.slow,
        delay,
        ease: EASE.inOut,
      });
      const inner = el.querySelector<HTMLElement>("[data-mask-inner]");
      if (inner) animate(inner, { scale: [1.12, 1], duration: DUR.slow + 400, delay, ease: EASE.out });
      break;
    }
    default:
      animate(el, { opacity: [0, 1], y: [36, 0], duration: DUR.base, delay, ease: EASE.out });
  }
}

export default function RevealRoot() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("anim-ready");

    if (prefersReducedMotion()) {
      html.classList.remove("motion");
      return;
    }

    let ready = false;
    const queue: HTMLElement[] = [];
    const run = (el: HTMLElement) => {
      if (!ready) return void queue.push(el);
      whenUncovered(() => reveal(el));
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          run(e.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    let raf = 0;
    const scan = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
          el.setAttribute("data-bound", "");
          io.observe(el);
        });
      });
    };

    // Wait for fonts so line splits are measured with the real typefaces.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(scan);

    const off = onIntroDone(() => {
      ready = true;
      queue.splice(0).forEach((el) => whenUncovered(() => reveal(el)));
    });

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      off();
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
