import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { posts } from "@/content/posts";

/**
 * Canonical, indexable pages only (no redirects, no API routes).
 * `lastModified` is set only where a real date exists (blog posts); a made-up date is worse than none.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/work", "/about", "/contact", "/why-tablestack", "/faq", "/blog", ...projects.map((p) => `/work/${p.slug}`)];
  return [
    ...paths.map((p) => ({ url: `${site.url}${p || "/"}` })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.date) })),
  ];
}
