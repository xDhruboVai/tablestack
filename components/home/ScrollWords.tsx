"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll, stagger } from "animejs";
import { prefersReducedMotion } from "@/lib/motion";

/** A statement that "lights up" word by word as it scrolls through the viewport. `*words*` render in accent italic, `**words**` in bold. */
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
  let bold = false;
  const tokens = text.split(/\s+/).map((raw, i) => {
    // `**words**` = bold; `*words*` = accent italic. Closing marks may sit before , or .
    const boldStart = raw.startsWith("**");
    const boldEnd = /\*\*[,.]?$/.test(raw);
    const starts = !boldStart && raw.startsWith("*");
    const ends = !boldEnd && /\*[,.]?$/.test(raw);
    if (boldStart) bold = true;
    if (starts) italic = true;
    const word = raw.replace(/\*/g, "");
    const node = (
      <span key={i} className={`sw ${italic ? "italic text-accent" : ""} ${bold ? "font-extrabold" : ""}`}>
        {word}{" "}
      </span>
    );
    if (ends) italic = false;
    if (boldEnd) bold = false;
    return node;
  });

  return (
    <p ref={ref} className={className}>
      {tokens}
    </p>
  );
}
