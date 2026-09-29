"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll, stagger } from "animejs";
import { prefersReducedMotion } from "@/lib/motion";

/** A statement that "lights up" word by word as it scrolls through the viewport. `*words*` render in accent italic. */
export default function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = el.querySelectorAll(".sw");
    const a = animate(words, {
      opacity: [0.16, 1],
      duration: 60,
      delay: stagger(12),
      ease: "linear",
      autoplay: onScroll({ target: el, enter: "bottom top", leave: "center bottom", sync: 0.4 }),
    });
    return () => {
      a.revert();
    };
  }, []);

  let italic = false;
  const tokens = text.split(/\s+/).map((raw, i) => {
    const starts = raw.startsWith("*");
    const ends = raw.endsWith("*") || raw.endsWith("*,") || raw.endsWith("*.");
    if (starts) italic = true;
    const word = raw.replace(/\*/g, "");
    const node = (
      <span key={i} className={`sw ${italic ? "italic text-accent" : ""}`}>
        {word}{" "}
      </span>
    );
    if (ends) italic = false;
    return node;
  });

  return (
    <p ref={ref} className={className}>
      {tokens}
    </p>
  );
}
