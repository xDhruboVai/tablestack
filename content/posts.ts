/** Blog posts. Each one has its own page file in app/blog/<slug>/page.tsx; this list feeds the blog index and the sitemap. */
export const posts = [
  {
    slug: "how-much-does-a-website-cost-in-bangladesh",
    title: "How Much Does a Website Cost in Bangladesh?",
    description:
      "What changes a website quote, what to include in your brief, and how to compare the work behind two prices.",
    date: "2026-10-01",
    readingTime: "3 min read",
  },
] as const;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
