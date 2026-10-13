"use client";

import { useEffect, useRef, useState } from "react";
import { approach } from "@/content/site";
import "./ApproachAssemble.css";

const STAGES = [
  { tab: "Discuss", headline: "Agree on what matters.", outcome: "A clear brief and an agreed scope" },
  { tab: "Design", headline: "See the shape before we build.", outcome: "Page layouts you can review" },
  { tab: "Build", headline: "Try it before it goes live.", outcome: "A working preview of your site" },
  { tab: "Launch", headline: "Go live with a plan.", outcome: "A tested site and agreed support" },
] as const;

/** The existing scroll sequence now reveals a brief, wireframe and working site as stacked sheets. */
export default function ApproachAssemble({ titleId = "app-title" }: { titleId?: string }) {
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
      const r = t.getBoundingClientRect();
      const run = r.height - p.offsetHeight;
      const progress = run > 0 ? Math.min(1, Math.max(0, (p.getBoundingClientRect().top - r.top) / run)) : 0;
      setActive(Math.min(approach.length - 1, Math.floor(progress * approach.length)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    // The pinned block's height feeds the CSS that centres it on screen while it is stuck.
    const measure = () => t.style.setProperty("--asm-pin-h", `${p.offsetHeight}px`);
    measure();
    const ro = new ResizeObserver(() => {
      measure();
      schedule();
    });
    ro.observe(p);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div>
      <div ref={track} className="asm" style={{ ["--steps" as string]: approach.length }}>
        <div ref={pin} className="asm-pin">
          {/* The title sits inside the pinned block, so it stays on screen while the steps play. */}
          <h2 id={titleId} className="asm-title display" data-split="lines">
            How a project <em className="text-accent">runs.</em>
          </h2>
          <div className="asm-scene" data-stage={active} aria-hidden="true">
            <div className="asm-sheet asm-sheet--brief">
              <p className="asm-sheet-label">Brief</p>
              <div className="asm-brief-content">
                <strong>What matters most</strong>
                <span>Pages</span>
                <span>Features</span>
                <span>Timeline & quote</span>
              </div>
            </div>

            <div className="asm-sheet asm-sheet--wireframe">
              <p className="asm-sheet-label">Wireframe</p>
              <div className="asm-wireframe-content">
                <span className="asm-wireframe-hero" />
                <span className="asm-wireframe-block" />
                <span className="asm-wireframe-block" />
                <span className="asm-wireframe-line" />
                <span className="asm-wireframe-line is-short" />
              </div>
            </div>

            <div className="asm-sheet asm-sheet--preview">
              <div className="asm-preview-top">
                <p className="asm-sheet-label">{active === 3 ? "Live site" : "Working preview"}</p>
                <span className="asm-preview-live"><span />Live</span>
              </div>
              <div className="asm-preview-content">
                <div>
                  <strong>Your business,<br />made easy to find.</strong>
                  <span className="asm-preview-button">Explore more</span>
                </div>
                <span className="asm-preview-orb" />
              </div>
              <p className="asm-preview-url">{active === 3 ? "yourbusiness.com" : "preview.yourbusiness.com"}</p>
            </div>
          </div>

          <div className="asm-detail" aria-label="Current project stage">
            <ol className="asm-tabs" aria-label="Project stages">
              {STAGES.map((stage, i) => (
                <li key={stage.tab} className={i === active ? "is-active" : ""} aria-current={i === active ? "step" : undefined}>
                  {stage.tab}
                </li>
              ))}
            </ol>

            <div key={active} className="asm-detail-copy">
              <h3>{STAGES[active].headline}</h3>
              <p>{approach[active].body}</p>
            </div>

            <div className="asm-outcome">
              <strong>{STAGES[active].outcome}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
