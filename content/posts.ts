/** Blog posts. Each one has its own page file in app/blog/<slug>/page.tsx; this list feeds the blog index and the sitemap. */
export const posts = [
  {
    slug: "how-much-does-a-website-cost-in-bangladesh",
    title: "How Much Does a Website Cost in Bangladesh?",
    description:
      "What a website costs in Bangladesh, what drives the price up or down, the yearly running costs, and how to get a quote you can trust.",
    date: "2026-10-01",
    readingTime: "6 min read",
  },
] as const;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
