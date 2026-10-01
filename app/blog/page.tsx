import { pageMeta } from "@/lib/seo";
import TLink from "@/components/layout/TLink";
import { ContactCTA } from "@/components/home/Sections";
import { formatDate, posts } from "@/content/posts";
import { site } from "@/content/site";

export const metadata = pageMeta({
  title: "Blog",
  description: `Plain-language guides from ${site.name} on websites, costs and web development in Bangladesh.`,
  path: "/blog",
});

export default function BlogIndex() {
  return (
    <>
      <section className="px-page pb-20 pt-[calc(var(--nav-h)+8svh)] md:pb-28" aria-labelledby="blog-h">
        <p className="eyebrow text-muted" data-reveal="fade">
          Guides from {site.name}
        </p>
        <h1 id="blog-h" className="display mt-6 text-[clamp(2.8rem,8vw,9rem)]" data-split="chars">
          Blog
        </h1>
        <ul className="mt-14 border-t border-rule md:mt-20">
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-rule" data-reveal="rise">
              <TLink href={`/blog/${p.slug}`} className="group grid grid-cols-12 gap-x-6 gap-y-3 py-8 md:py-10">
                <p className="eyebrow col-span-12 text-muted md:col-span-3">
                  {formatDate(p.date)} · {p.readingTime}
                </p>
                <div className="col-span-12 md:col-span-9">
                  <h2 className="display text-[clamp(1.7rem,3vw,3rem)] transition-colors group-hover:text-accent">{p.title}</h2>
                  <p className="mt-3 max-w-[60ch] leading-[1.6] text-fg-2">{p.description}</p>
                </div>
              </TLink>
            </li>
          ))}
        </ul>
      </section>
      <ContactCTA />
    </>
  );
}
