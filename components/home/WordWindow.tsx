import type { CSSProperties } from "react";

/**
 * "Work." with the letters as a window onto one site at a time: whichever site is at the front of the
 * row below it (SiteFan). When the front changes, the new screenshot fades in over the old one.
 * `images` holds one screenshot address per site, in the same order as the row ("" = none).
 */
export default function WordWindow({ id, images, active }: { id: string; images: string[]; active: number }) {
  const word = (
    <>
      Work<em className="work-title-dot">.</em>
    </>
  );

  return (
    <h2 id={id} className="display word-window" data-reveal="rise">
      <span className="word-window-text">{word}</span>
      {images.map((url, i) => (
        // The same word again, filled with one site's screenshot. Only the active one is seen.
        <span
          className="word-window-layer"
          aria-hidden="true"
          data-on={i === active}
          key={i}
          // A faint wash (--word-tint) sits over the screenshot, so one the same colour as the page still shows the letters.
          style={url ? ({ backgroundImage: `linear-gradient(var(--word-tint), var(--word-tint)), url("${url}")` } as CSSProperties) : undefined}
        >
          {word}
        </span>
      ))}
    </h2>
  );
}
