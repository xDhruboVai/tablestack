"use client";

import { useEffect, useRef, useState } from "react";
import { approach } from "@/content/site";

type Role = "text" | "accent" | "muted" | "image" | "card";
/** Shown in place of step numbers. */
const ORDER = ["First", "Then", "Next", "Finally"];

/** The page that gets built, in a 480 x 320 browser frame: [x, y, w, h, role]. */
const BLOCKS: [number, number, number, number, Role][] = [
  [24, 46, 58, 12, "text"],
  [300, 49, 156, 6, "muted"],
  [24, 86, 244, 22, "text"],
  [24, 114, 186, 22, "accent"],
  [24, 150, 220, 7, "muted"],
  [24, 164, 176, 7, "muted"],
  [24, 186, 88, 24, "accent"],
  [296, 82, 160, 128, "image"],
  [24, 232, 136, 66, "card"],
  [172, 232, 136, 66, "card"],
  [320, 232, 136, 66, "card"],
];

/** The notes from the first conversation: position, tilt and colour. */
const NOTES = [
  { x: 60, y: 70, r: -6, c: "var(--note-1)" },
  { x: 190, y: 120, r: 4, c: "var(--note-2)" },
  { x: 310, y: 64, r: -3, c: "var(--note-3)" },
];

/**
 * "How a project runs" as a page being built. The browser window and the four steps pin in the
 * middle of the screen; scrolling moves through the steps (the active one opens) while the window
 * changes: notes (Discuss), grey wireframe (Design), real colour on a preview link (Build), then a
 * live address and badge (Launch).
 */
export default function ApproachAssemble({
  titleId = "app-title",
}: {
  titleId?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = track.current;
    const p = pin.current;
    if (!t || !p) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      // How far through the scroll track we are (0 to 1) while the block is pinned.
      const r = t.getBoundingClientRect();
      const run = r.height - p.offsetHeight;
      const progress =
        run > 0
          ? Math.min(
              1,
              Math.max(0, (p.getBoundingClientRect().top - r.top) / run),
            )
          : 0;
      setActive(
        Math.min(approach.length - 1, Math.floor(progress * approach.length)),
      );
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="mt-10 md:mt-14">
      <h2
        id={titleId}
        className="display text-[clamp(2.6rem,5vw,5.6rem)]"
        data-split="lines"
      >
        How a project <em className="text-accent">runs.</em>
      </h2>

      <div
        ref={track}
        className="asm mt-6 md:mt-8"
        style={{ ["--steps" as string]: approach.length }}
      >
        <div ref={pin} className="asm-pin">
          <div className="asm-stage" aria-hidden="true">
            <svg
              className="asm-frame"
              viewBox="0 0 480 320"
              data-stage={active}
            >
              <rect
                className="asm-window"
                x="0.75"
                y="0.75"
                width="478.5"
                height="318.5"
                rx="10"
              />
              <line
                className="asm-window"
                x1="0.75"
                y1="28"
                x2="479.25"
                y2="28"
              />
              <circle className="asm-dot is-accent" cx="16" cy="14" r="4" />
              <circle className="asm-dot" cx="30" cy="14" r="4" />
              <circle className="asm-dot" cx="44" cy="14" r="4" />
              <rect
                className="asm-url"
                x="120"
                y="7"
                width="240"
                height="14"
                rx="7"
              />
              <text className="asm-url-text is-preview" x="240" y="17.5">
                preview.yourbusiness.com
              </text>
              <text className="asm-url-text is-live" x="240" y="17.5">
                yourbusiness.com
              </text>

              {NOTES.map((n, i) => (
                <g
                  key={i}
                  transform={`translate(${n.x} ${n.y}) rotate(${n.r})`}
                >
                  <g className="asm-note" style={{ ["--i" as string]: i }}>
                    <rect width="112" height="96" rx="3" fill={n.c} />
                    <rect
                      className="asm-scribble"
                      x="12"
                      y="18"
                      width="80"
                      height="6"
                      rx="3"
                    />
                    <rect
                      className="asm-scribble"
                      x="12"
                      y="34"
                      width="64"
                      height="6"
                      rx="3"
                    />
                    <rect
                      className="asm-scribble"
                      x="12"
                      y="50"
                      width="72"
                      height="6"
                      rx="3"
                    />
                  </g>
                </g>
              ))}

              {BLOCKS.map(([x, y, w, h, role], i) => (
                <rect
                  key={i}
                  className={`asm-block is-${role}`}
                  style={{ ["--i" as string]: i }}
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx={role === "accent" && h > 22 ? 12 : 3}
                />
              ))}

              {/* Wireframe image placeholder (Design), then a picture (Build onwards) */}
              <g className="asm-x">
                <line x1="296" y1="82" x2="456" y2="210" />
                <line x1="456" y1="82" x2="296" y2="210" />
              </g>
              <g className="asm-photo">
                <circle cx="420" cy="114" r="14" />
                <path d="M296 210 L346 150 L382 184 L414 158 L456 198 L456 210 Z" />
              </g>

              <g className="asm-live">
                <rect x="400" y="6" width="58" height="16" rx="8" />
                <circle cx="413" cy="14" r="3.5" />
                <text x="422" y="17.5">
                  Live
                </text>
              </g>
            </svg>
            <p className="asm-caption">
              <span className="text-[var(--accent-text)]">
                {ORDER[active]}
              </span>{" "}
              {approach[active].plain}
            </p>
          </div>

          <ol className="asm-steps">
            {approach.map((s, i) => (
              <li
                key={s.code}
                className={`asm-step ${i === active ? "is-active" : ""}`}
                aria-current={i === active ? "step" : undefined}
              >
                <div className="flex items-baseline gap-4">
                  <span className="eyebrow w-14 shrink-0 text-accent">{ORDER[i]}</span>
                  <h3 className="display text-[clamp(1.9rem,3vw,3.2rem)] italic">
                    {s.term}
                  </h3>
                </div>
                <div className="asm-step-more">
                  <p className="max-w-[40ch] pt-3 text-[1.05rem] leading-[1.6] text-fg-2">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
