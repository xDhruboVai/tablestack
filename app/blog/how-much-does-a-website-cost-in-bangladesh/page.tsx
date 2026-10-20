import { jsonLdText, pageMeta } from "@/lib/seo";
import TLink from "@/components/layout/TLink";
import { ContactCTA } from "@/components/home/Sections";
import { formatDate, posts } from "@/content/posts";
import { site } from "@/content/site";
import { getVisibleProjects } from "@/lib/visibility";

const post = posts.find((p) => p.slug === "how-much-does-a-website-cost-in-bangladesh")!;

export const metadata = pageMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  type: "article",
  publishedTime: post.date,
});

export default async function PostPage() {
  // The link to the Work page is left out while every project is switched off.
  const showWork = (await getVisibleProjects()).length > 0;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${site.url}/blog/${post.slug}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: "2026-10-11",
        author: { "@type": "Organization", name: site.name, url: site.url },
        publisher: { "@type": "Organization", name: site.name, url: site.url },
        mainEntityOfPage: `${site.url}/blog/${post.slug}`,
        isPartOf: { "@id": `${site.url}/blog#webpage` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${site.url}/blog/${post.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${site.url}/blog/${post.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <article className="px-page pb-20 pt-[calc(var(--nav-h)+7svh)] md:pb-24">
        <TLink href="/blog" className="eyebrow link-draw tap-pad">← All posts</TLink>
        <h1 className="display mt-8 max-w-[18ch] text-[clamp(2.4rem,4.68vw,4.99rem)]" data-split="lines">
          How much does a website cost in <em className="text-accent">Bangladesh?</em>
        </h1>

        {/* Wide screens: post details in a left rail, the article beside it, so the text isn't alone on the left. */}
        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-16">
          <div className="col-span-12 lg:col-span-3">
            <ul className="article-meta eyebrow text-muted">
              <li>{formatDate(post.date)}</li>
              <li>{post.readingTime}</li>
              <li>By {site.name}</li>
            </ul>
          </div>
          <div className="article col-span-12 lg:col-span-8 lg:col-start-5">
            <p className="article-lead">
              The useful answer starts with what the website needs to do. A page that explains your business, a menu your team can edit, and a booking flow are different jobs. Here is how to get a quote you can actually compare.
            </p>

            <h2>What changes the cost?</h2>
            <p>The main variables are the amount of content, the design work, and the features behind the pages.</p>
            <ul>
              <li><strong>Pages and content.</strong> Count the pages, languages and content types. Decide who provides the words and images.</li>
              <li><strong>Customer actions.</strong> A contact form is simpler than bookings, pre-orders, payments or accounts. Each flow needs design and testing.</li>
              <li><strong>Staff tools.</strong> If your team needs to update a menu, prices, locations or orders, include those screens in the scope.</li>
            </ul>

            <h2>Write a short brief first</h2>
            <p>You do not need a technical specification. A useful starting brief answers five questions:</p>
            <ul>
              <li>What does your business do, and who will use the website?</li>
              <li>What should visitors be able to find or do?</li>
              <li>What must your team be able to change after launch?</li>
              <li>Do you already have text, photos and a domain?</li>
              <li>When do you want to launch?</li>
            </ul>

            <h2>What should the quote include?</h2>
            <p>Ask for the pages and features in writing, along with a timeline and price. It should say when you will review layouts and a working version, who supplies content, and what is included after launch. Domain, hosting and paid services should be listed separately if they are not part of the build.</p>

            <h2>Compare the scope, not just the number</h2>
            <p>Two quotes can look far apart while describing different work. Check whether both include mobile layouts, content entry, language versions, editing tools, testing and handover. Ask what happens if you add a feature later.</p>

            <h2>How we quote</h2>
            <p>At {site.name}, we discuss the business and agree on pages, features and a timeline before quoting. You see layouts and a working preview before launch. We spell out any ongoing support separately.</p>
            <p>To get a number for your project, <TLink href="/contact" className="inline-link">send us a short brief</TLink>.{showWork && <> You can also <TLink href="/work" className="inline-link">see our work</TLink> for the kind of sites we build.</>}</p>
          </div>
        </div>
      </article>
      <ContactCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(jsonLd) }} />
    </>
  );
}
