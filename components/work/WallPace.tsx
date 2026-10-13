"use client";

import { useEffect, useRef } from "react";

/** Slows the drifting wall while the cursor is over it, and brings it back to speed after. */
export default function WallPace() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wall = marker.current?.closest<HTMLElement>(".work-wall");
    if (!wall || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const pace = (rate: number) => () => {
      for (const a of wall.getAnimations({ subtree: true })) {
        if (a instanceof CSSAnimation && a.animationName === "wall-drift") a.updatePlaybackRate(rate);
      }
    };
    const slow = pace(0.25);
    const normal = pace(1);
    wall.addEventListener("pointerenter", slow);
    wall.addEventListener("pointerleave", normal);
    return () => {
      wall.removeEventListener("pointerenter", slow);
      wall.removeEventListener("pointerleave", normal);
    };
  }, []);

  return <span ref={marker} hidden />;
}
