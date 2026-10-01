import { pageMeta } from "@/lib/seo";
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

/** Rough market ranges, as a guide only. Keep the note under the list. */
const ranges = [
  ["A one-page or template site", "Tk 10,000 to Tk 30,000", "A ready-made design with your text and photos dropped in."],
  ["A custom business website", "Tk 25,000 to Tk 150,000", "Designed around your business, usually 5 to 15 pages, with a contact or enquiry form."],
  ["An online shop", "Tk 50,000 to Tk 300,000 and up", "Products, cart, orders and payments such as bKash or cards."],
  ["A web app or custom system", "Tk 150,000 and up", "Booking systems, dashboards, customer portals and other software built for one business."],
];

export default async function PostPage() {
  const showWork = (await getVisibleProjects()).length > 0;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <article className="px-page pb-20 pt-[calc(var(--nav-h)+7svh)] md:pb-28">
        <TLink href="/blog" className="eyebrow link-draw">
          ← All posts
        </TLink>
        <p className="eyebrow mt-10 text-muted">
          {formatDate(post.date)} · {post.readingTime} · By {site.name}
        </p>
        <h1 className="display mt-4 max-w-[18ch] text-[clamp(2.4rem,6vw,6.4rem)]" data-split="lines">
          How much does a website cost in <em className="text-accent">Bangladesh?</em>
        </h1>

        <div className="article mt-12 md:mt-16">
          <p className="article-lead">
            The honest answer is that a website in Bangladesh can cost anything from a few thousand taka to several lakh. That range is not very helpful on its own, so this guide breaks down what you are actually paying for, what pushes the price up or down, and how to get a quote you can trust.
          </p>

          <h2>The short answer</h2>
          <p>
            For most small and medium businesses in Bangladesh, a properly designed website falls somewhere between Tk 25,000 and Tk 150,000. Simple template sites cost less. Online shops and custom software cost more. The figures below are rough market ranges to help you plan, not fixed prices. Every agency and freelancer prices differently.
          </p>
          <ul className="article-ranges">
            {ranges.map(([name, price, note]) => (
              <li key={name}>
                <span className="font-semibold">{name}</span>
                <span className="text-[var(--accent-text)]">{price}</span>
                <span className="text-fg-2">{note}</span>
              </li>
            ))}
          </ul>

          <h2>What decides the price</h2>
          <h3>1. How many pages and how much is custom</h3>
          <p>
            A five-page site that follows a ready-made layout takes far less time than a site where every page is designed from scratch. Custom design costs more, but it is also what makes a business look like itself and not like every other template.
          </p>
          <h3>2. What the site has to do</h3>
          <p>
            Showing information is the simple part. The cost goes up when the site has to take orders, accept payments, handle bookings, send emails, or let your team log in and manage things. Each of those is a small piece of software, and software takes time to build and test.
          </p>
          <h3>3. Who writes the words and supplies the photos</h3>
          <p>
            If you provide the text and photos, the price stays lower. If the team has to write the copy, take photos, or design a logo, that is extra work and should be listed separately in the quote.
          </p>
          <h3>4. How it performs on phones</h3>
          <p>
            Most visitors in Bangladesh arrive on a phone, often on mobile data. A site that loads fast and reads well on a small screen takes more care to build than one that only looks good on a laptop. It is worth paying for, because a slow site loses customers before they see anything.
          </p>
          <h3>5. Who builds it</h3>
          <p>
            A solo freelancer usually charges less than an agency with an office and a sales team. A small team sits in between. Price alone does not tell you about quality, so ask to see live websites they have built and open them on your own phone.
          </p>

          <h2>The yearly costs people forget</h2>
          <p>Building the site is a one-time cost. Keeping it online is a small yearly one. Plan for these:</p>
          <ul>
            <li>
              <strong>Domain name.</strong> Your address, such as yourbusiness.com. Usually Tk 1,200 to Tk 2,500 a year. A .com.bd address costs a little more.
            </li>
            <li>
              <strong>Hosting.</strong> Where the site lives. From around Tk 2,000 a year for basic hosting to much more for busy shops. Some modern sites can be hosted free at low traffic.
            </li>
            <li>
              <strong>Maintenance.</strong> Updates, small changes and fixes. Some teams charge monthly, others per request. Agree this before launch.
            </li>
            <li>
              <strong>Paid tools.</strong> Payment gateways, SMS, email services and similar. These depend on what your site does.
            </li>
          </ul>

          <h2>Why very cheap websites often cost more later</h2>
          <p>
            A Tk 5,000 website is usually a template that many other businesses also use, set up quickly, with little thought for speed or phones. That can be fine as a starting point. The problems come later: it is hard to change, it is slow, the developer disappears, or the domain turns out to be registered in someone else&rsquo;s name. Rebuilding then costs more than doing it properly once.
          </p>
          <p>Whatever you pay, make sure of three things:</p>
          <ul>
            <li>The domain and hosting accounts are in your name.</li>
            <li>You can see the site on your phone before paying the final amount.</li>
            <li>You know what happens when something needs changing after launch.</li>
          </ul>

          <h2>How to get a quote you can trust</h2>
          <p>A good quote is specific. Before you ask for one, write down:</p>
          <ul>
            <li>What your business does and who your customers are.</li>
            <li>The pages you think you need, even as a rough list.</li>
            <li>Anything the site must do, such as take orders or bookings.</li>
            <li>Two or three websites you like, and why.</li>
            <li>Your budget range and when you need it.</li>
          </ul>
          <p>
            Then ask for a written scope: the pages, the features, the timeline and one price. If a quote is a single number with no details, ask what it includes. Compare quotes by what you get, not only by the total.
          </p>

          <h2>How {site.name} prices a project</h2>
          <p>
            At {site.name} we agree the pages, features and timeline with you first, then give one fixed quote before any work starts. You see the layouts, then a working preview, before launch. Your domain, content and accounts stay yours. Our project form has budget ranges from under Tk 25,000 to Tk 50,000 and above, so you can tell us what you are working with.
          </p>
          <p>
            Want a real number for your business?{" "}
            <TLink href="/contact" className="inline-link">
              Send us a short brief
            </TLink>{" "}
            and we will come back with a scope and a quote. You can also{" "}
            <TLink href="/#services" className="inline-link">
              see what we build
            </TLink>
            {showWork && (
              <>
                ,{" "}
                <TLink href="/work" className="inline-link">
                  look at our work
                </TLink>
              </>
            )}
            , or read the{" "}
            <TLink href="/faq" className="inline-link">
              frequently asked questions
            </TLink>
            .
          </p>
        </div>
      </article>
      <ContactCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
