import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Metadata for one public page: its own title and description, a canonical address, and matching
 * share tags (Open Graph + Twitter) with the default share image.
 * `title` gets the "| TableStack" suffix from the root layout; pass `absoluteTitle` when the title
 * already contains the brand name.
 */
export function pageMeta({
  title,
  description,
  path,
  absoluteTitle = false,
  type = "website",
  publishedTime,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const shareTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      locale: "en_US",
      title: shareTitle,
      description,
      url: path,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} | ${site.tagline}` }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: ["/opengraph-image"] },
  };
}
