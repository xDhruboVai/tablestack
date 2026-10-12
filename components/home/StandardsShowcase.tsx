"use client";

import type { PointerEvent } from "react";
import { standards } from "@/content/site";

const scopeParts = ["Pages", "Features", "Timeline", "Quote"];

/** The supplied bento layout and spotlight idea, adapted to TableStack's six project promises. */
export default function StandardsShowcase() {
  const trackPointer = (event: PointerEvent<HTMLLIElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <ul className="standards-grid mt-14 md:mt-20">
      {standards.map((item, index) => (
        <li
          key={item.k}
          className={`standard-card ${index === 0 ? "standard-card-featured" : ""}`}
          onPointerMove={trackPointer}
        >
          <div className="standard-card-content">
            <h3 className="standard-card-title">{item.k}</h3>
            <p className="standard-card-description">{item.v}</p>
          </div>
          {index === 0 && (
            <div className="standard-scope-parts" aria-hidden="true">
              {scopeParts.map((part) => (
                <span key={part}>{part}</span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
