"use client";

import { useState, type ReactNode } from "react";
import TLink from "@/components/layout/TLink";

export type ShowcaseItem = {
  slug: string;
  title: string;
  summary: string;
  concept: boolean;
  liveUrl?: string;
  /** The site in a browser window, shown big. */
  window: ReactNode;
  /** A small picture of the site for its thumbnail button. */
  thumb: ReactNode;
};

/**
 * One site shown big, with its name, a line about it and a link to open it, and every site as a small
 * thumbnail beside it. Choosing a thumbnail swaps the big site. Nothing moves on its own.
 */
export default function SiteShowcase({ items }: { items: ShowcaseItem[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className="showcase" data-reveal="rise">
      {/* Every big window is in the page; only the chosen one shows, so switching is instant. */}
      <TLink href={`/work/${current.slug}`} className="showcase-stage" aria-label={`${current.title}: see the project`}>
        {items.map((item, i) => (
          <div key={item.slug} className={`showcase-slide ${i === active ? "is-on" : ""}`} aria-hidden={i !== active}>
            {item.window}
          </div>
        ))}
      </TLink>

      <div className="showcase-side">
        {/* Keyed by the site, so the text plays its short entrance each time the site changes. */}
        <div key={current.slug} className="showcase-info" aria-live="polite">
          <span className={`showcase-tag ${current.concept ? "" : "showcase-tag-client"}`}>{current.concept ? "Concept" : "Client project"}</span>
          <h3 className="showcase-title">{current.title}</h3>
          <p className="showcase-summary">{current.summary}</p>
          <div className="showcase-links">
            {current.liveUrl && (
              <a href={current.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                Open the site <span className="btn-arrow">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            <TLink href={`/work/${current.slug}`} className="showcase-more">
              How we built it →
            </TLink>
          </div>
        </div>

        <ul className="showcase-thumbs" aria-label="Choose a site">
          {items.map((item, i) => (
            <li key={item.slug}>
              <button
                type="button"
                className={`showcase-thumb ${i === active ? "is-on" : ""}`}
                aria-pressed={i === active}
                aria-label={item.title}
                onClick={() => setActive(i)}
              >
                {item.thumb}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
