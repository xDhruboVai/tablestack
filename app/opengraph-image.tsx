import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

/**
 * The picture shown when a link to the site is shared: the logo and headline beside a wall of our sites.
 * It is a saved file, not drawn here. To change it, run scripts/link-preview.mjs (instructions at its top).
 */
export const alt = `${site.name}: Websites built around your business`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default async function OG() {
  const picture = await readFile(join(process.cwd(), "assets/social/link-preview.jpg"));
  return new Response(new Uint8Array(picture), { headers: { "Content-Type": contentType } });
}
