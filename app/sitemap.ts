import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getVisibleProjects } from "@/lib/visibility";
import { posts } from "@/content/posts";

/**
 * Canonical, indexable pages only (no redirects, no API routes).
 * `lastModified` is set only where a real date exists (blog posts); a made-up date is worse than none.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only projects that are switched on; with none, the Work page is left out too.
  const projects = await getVisibleProjects();
  const work = projects.length ? ["/work", ...projects.map((p) => `/work/${p.slug}`)] : [];
  const paths = ["", "/about", "/contact", "/why-tablestack", "/faq", "/blog", ...work];
  return [
    ...paths.map((p) => ({ url: `${site.url}${p || "/"}` })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.date) })),
  ];
}
