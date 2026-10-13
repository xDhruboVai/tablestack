"use client";

import { useState } from "react";
import SiteFan, { type FanItem } from "./SiteFan";
import WordWindow from "./WordWindow";

/**
 * The top of the home page's work section: the big word and the turning row of sites under it.
 * They share one piece of information, which site is at the front, so the word always shows that site.
 */
export default function WorkStage({ id, items, images }: { id: string; items: FanItem[]; images: string[] }) {
  const [front, setFront] = useState(0);
  return (
    <>
      <WordWindow id={id} images={images} active={front} />
      <SiteFan items={items} onFront={setFront} />
    </>
  );
}
