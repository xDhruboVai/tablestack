"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, onScroll, stagger, utils, splitText } from "animejs";
import ExplodedTable, { LABEL_X, labelY, toPct } from "./ExplodedTable";
import TLink from "@/components/layout/TLink";
import { anatomy, site } from "@/content/site";
import { EASE, onIntroDone } from "@/lib/motion";

/* Assembled-state camera (translateX %, translateY %, scale) - the exploded state is identity. */
const CAM = {
  desktop: { x: 27, y: -29, s: 1.3 },
  mobile: { x: 21, y: 36, s: 1 },
};

// Label order top → bottom matches the anatomy copy.
const LABEL_LAYERS = ["foh", "menu", "res", "boh"];

export default function HeroAnatomy() {
  const root = useRef<HTMLElement>(null);
  const introPlayed = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const scope = createScope({
      root,
      mediaQueries: {
        desktop: "(min-width: 1024px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
    }).add((self) => {
      const { desktop, reduced } = self!.matches as { desktop: boolean; reduced: boolean };
      const intros = utils.$("[data-intro]");

      if (reduced) {
        utils.set(intros, { visibility: "visible" });
        return;
      }

      const cam = utils.$("[data-cam]");
      const copy = utils.$("[data-copy]");
      const layers = utils.$("[data-layer]");
      const labels = utils.$("[data-label]");
      const leaderDots = utils.$("[data-leader-dot]");
      const cam0 = desktop ? CAM.desktop : CAM.mobile;

      /* ── Scroll: the table explodes into its layers ─────────── */
      utils.set(leaderDots, { scale: 0 });
      utils.set(labels, { opacity: 0, x: -14 });

      const scroll = createTimeline({
        autoplay: onScroll({ target: el, enter: "top top", leave: "bottom bottom", sync: 0.45 }),
        defaults: { ease: "linear" },
      });

      scroll.add("[data-hint]", { opacity: [1, 0], duration: 80 }, 0);
      if (!desktop) {
        scroll.add(copy, { y: [0, -90], opacity: [1, 0], duration: 260, ease: "inOut(2)" }, 0);
      }
      scroll.add(
        cam,
        {
          x: [`${cam0.x}%`, "0%"],
          y: [`${cam0.y}%`, "0%"],
          scale: [cam0.s, 1],
          duration: 520,
          ease: EASE.inOut,
        },
        60,
      );
      layers.forEach((layer, i) => {
        const offset = Number((layer as HTMLElement).dataset.explode || 0);
        if (!offset) return;
        scroll.add(layer, { y: [0, offset], duration: 520, ease: EASE.inOut }, 60 + (layers.length - i) * 30);
      });

      LABEL_LAYERS.forEach((id, i) => {
        const at = 470 + i * 95;
        const group = el.querySelector(`[data-layer="${id}"]`);
        if (!group) return;
        // Lines "draw" by scaling from their start point (reverts cleanly, unlike dash tricks)
        const line = group.querySelector("[data-leader]")!;
        const tick = group.querySelector("[data-tick]")!;
        const dot = group.querySelector("[data-leader-dot]")!;
        utils.set(line, { scaleX: 0 });
        utils.set(tick, { scaleY: 0 });
        scroll.add(dot, { scale: [0, 1], duration: 60, ease: "outBack(2)" }, at);
        scroll.add(line, { scaleX: [0, 1], duration: 100, ease: "inOut(2)" }, at + 20);
        scroll.add(tick, { scaleY: [0, 1], duration: 50, ease: EASE.out }, at + 110);
        scroll.add(labels[i], { opacity: [0, 1], x: [-14, 0], duration: 120, ease: EASE.out }, at + 80);
      });
      scroll.add("[data-fig]", { opacity: [0, 1], duration: 120 }, 520);
      scroll.add("[data-fig]", { opacity: 1, duration: 1 }, 1000); // hold the final frame

      /* ── Intro: headline rises, table assembles slab by slab ─ */
      const title = el.querySelectorAll<HTMLElement>(".hl");
      const split = splitText(Array.from(title), { words: false, chars: true });
      const chars = split.chars;

      if (introPlayed.current) {
        utils.set(intros, { visibility: "visible" });
        return () => split.revert();
      }

      const legs = utils.$("[data-leg]");
      const drops = utils.$("[data-drop]");
      const details = utils.$("[data-detail]");

      utils.set(chars, { y: "110%" });
      utils.set(legs, { scaleY: 0 });
      utils.set(drops, { y: -150, opacity: 0 });
      utils.set(details, { opacity: 0 });
      utils.set("[data-intro-fade]", { opacity: 0, y: 18 });
      utils.set("[data-shadow]", { opacity: 0 });
      utils.set(intros, { visibility: "visible" });

      const intro = createTimeline({
        autoplay: false,
        defaults: { ease: EASE.out },
        // Only mark as played once finished - a revert mid-intro (StrictMode, resize) replays it.
        onComplete: () => {
          introPlayed.current = true;
        },
      })
        .add(chars, { y: ["110%", "0%"], duration: 1050, delay: stagger(14) }, 0)
        .add(legs, { scaleY: [0, 1], duration: 650, ease: EASE.inOut, delay: stagger(70) }, 150)
        .add("[data-shadow]", { opacity: [0, 1], duration: 900 }, 250)
        .add(drops, { y: [-150, 0], opacity: [0, 1], duration: 760, ease: EASE.settle, delay: stagger(115) }, 380)
        .add(details, { opacity: [0, 1], duration: 500, delay: stagger(110) }, 760)
        .add("[data-intro-fade]", { opacity: [0, 1], y: [18, 0], duration: 900, delay: stagger(90) }, 420);

      const off = onIntroDone(() => intro.play());

      return () => {
        off();
        split.revert();
      };
    });

    return () => scope.revert();
  }, []);

  return (
    <section ref={root} className="hero-track" aria-labelledby="hero-title" data-annot="section · hero · sticky scroll-scrub">
      <div className="hero-stage">
        <div className="hero-copy px-page" data-copy>
          <p className="eyebrow flex items-center gap-3 text-fg-2" data-intro data-intro-fade>
            <span className="live-dot" aria-hidden="true" />
            {site.availability}
          </p>

          <h1 id="hero-title" className="display mt-6 text-[clamp(2.3rem,9.8vw,3.8rem)] lg:mt-8 lg:text-[clamp(3.4rem,5.6vw,6.8rem)]" data-intro>
            <span className="split-line">
              <span className="hl">Websites built</span>
            </span>
            <span className="split-line">
              <span className="hl">around the way</span>
            </span>
            <span className="split-line">
              <span className="hl">your business</span>
            </span>
            <span className="split-line">
              <span className="hl italic text-accent">works.</span>
            </span>
          </h1>

          <p className="body-lg mt-6 max-w-[36ch] lg:mt-8" data-intro data-intro-fade>
            A small web team in Bangladesh. We build websites for all kinds of businesses, plus the tools behind
            them when you need them.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 lg:mt-9" data-intro data-intro-fade>
            <TLink href="/contact" className="btn btn-primary">
              Start a project <span className="btn-arrow" aria-hidden="true">→</span>
            </TLink>
            <TLink href="/work" className="btn btn-ghost">
              See the work
            </TLink>
          </div>
        </div>

        <div className="hero-cam-wrap">
          <div className="hero-cam" data-cam>
            <div className="h-full w-full" data-intro>
              <ExplodedTable />
            </div>
            <ol className="hero-labels" aria-label="What a TableStack site is made of">
              {LABEL_LAYERS.map((id, i) => {
                const a = anatomy[i];
                return (
                  <li
                    key={id}
                    data-label
                    style={{ left: `${toPct.x(LABEL_X)}%`, top: `${toPct.y(labelY(id))}%` }}
                  >
                    <span className="eyebrow text-accent">{a.code}</span>
                    <span className="hero-label-title">{a.title}</span>
                    <span className="hero-label-body">{a.body}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <p className="hero-fig eyebrow px-page text-muted" data-fig aria-hidden="true">
          Fig. 01 · Anatomy of a business website
        </p>
        <div className="hero-hint px-page" data-hint aria-hidden="true">
          <span className="eyebrow flex items-center gap-3 text-muted">
            <span className="hero-hint-line" /> Scroll to see how it’s built
          </span>
        </div>
      </div>
    </section>
  );
}
