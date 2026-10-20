import { jsonLdText, pageMeta } from "@/lib/seo";
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${site.url}/blog#webpage`,
        url: `${site.url}/blog`,
        name: `Blog | ${site.name}`,
        description: `Plain-language guides from ${site.name} on websites, costs and web development in Bangladesh.`,
        isPartOf: { "@id": `${site.url}/#website` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
          ],
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(jsonLd) }} />
      <section className="px-page pb-20 pt-[calc(var(--nav-h)+8svh)] md:pb-24" aria-labelledby="blog-h">
        <h1 id="blog-h" className="display text-[clamp(2.8rem,6.24vw,7.02rem)]" data-split="chars">
          Blog
        </h1>
        <ul className="mt-14 border-t border-rule md:mt-16">
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-rule" data-reveal="rise">
              <TLink href={`/blog/${p.slug}`} className="group grid grid-cols-12 gap-x-6 gap-y-3 py-8 md:py-10">
                <p className="eyebrow col-span-12 text-muted md:col-span-3">
                  {formatDate(p.date)} · {p.readingTime}
                </p>
                <div className="col-span-12 md:col-span-9">
                  <h2 className="display text-[clamp(1.7rem,2.34vw,2.34rem)] transition-colors group-hover:text-accent">{p.title}</h2>
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
