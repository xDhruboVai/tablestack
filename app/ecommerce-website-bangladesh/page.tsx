import { jsonLdText, pageMeta } from "@/lib/seo";
import TLink from "@/components/layout/TLink";
import { ContactCTA } from "@/components/home/Sections";
import { plans } from "@/content/pricing";
import { site } from "@/content/site";
import { getVisibleProjects } from "@/lib/visibility";

const path = "/ecommerce-website-bangladesh";
const plan = plans.find((p) => p.id === "business")!;
const price = plan.price!.bd;
const description = `E-commerce website development in Bangladesh by ${site.name}, a Dhaka web team. Online stores with product pages, cart, admin dashboard and SEO, from ${price}.`;

export const metadata = pageMeta({
  title: "E-commerce Website Development & Price in Bangladesh",
  description,
  path,
});

/* Shown on the page and sent as FAQ structured data, so the two always match. */
const faqs = [
  {
    q: "How much does an e-commerce website cost in Bangladesh?",
    a: `Our e-commerce websites start at ${price}. The final price depends on the number of products, the features and the integrations you need. We agree on the scope first and give you a written quote.`,
  },
  {
    q: "Which payment methods can my store take?",
    a: "bKash and cash on delivery. bKash payments are quoted separately, because they need a bKash merchant account and their own setup.",
  },
  {
    q: "Can I manage products and orders myself?",
    a: "Yes. Every store comes with an admin dashboard where your team can add products, change prices and see orders.",
  },
  {
    q: "I sell on Facebook. Why do I need a website?",
    a: "A website gives every product its own page that shows up on Google, a cart customers can order from at any hour, and a store that belongs to you rather than a social media page.",
  },
  {
    q: "Can the store be in Bangla and English?",
    a: "Yes. We build bilingual sites with an English and Bangla switch.",
  },
  {
    q: "ই-কমার্স ওয়েবসাইট তৈরি করতে খরচ কত?",
    a: `${site.name}-এ ই-কমার্স ওয়েবসাইট তৈরির খরচ শুরু ${price} থেকে। প্রোডাক্টের সংখ্যা, ফিচার আর বিকাশ পেমেন্ট লাগবে কিনা, তার উপর চূড়ান্ত দাম নির্ভর করে। কাজ শুরুর আগে আমরা লিখিত কোটেশন দিই।`,
    lang: "bn",
  },
  {
    q: "ফেসবুক পেজ থেকে নিজের অনলাইন শপ ওয়েবসাইট বানাতে চাই, কী লাগবে?",
    a: "আপনার প্রোডাক্টের ছবি, দাম আর বিবরণ হলেই শুরু করা যায়। প্রতিটি প্রোডাক্টের নিজস্ব পেজ, কার্ট আর অর্ডার দেখার জন্য অ্যাডমিন ড্যাশবোর্ড আমরা তৈরি করে দিই।",
    lang: "bn",
  },
] as const;

export default async function EcommercePage() {
  const showWork = (await getVisibleProjects()).length > 0;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${site.url}${path}#service`,
        name: "E-commerce Website Development",
        serviceType: "E-commerce website development",
        description,
        provider: { "@id": `${site.url}/#organization` },
        areaServed: { "@type": "Country", name: "Bangladesh" },
        offers: { "@type": "Offer", priceCurrency: "BDT", price: price.replace(/[^0-9]/g, "") },
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}${path}#faq`,
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "E-commerce Websites", item: `${site.url}${path}` },
        ],
      },
    ],
  };

  return (
    <>
      <article className="px-page pb-20 pt-[calc(var(--nav-h)+7svh)] md:pb-24">
        <p className="eyebrow text-accent">E-commerce · Bangladesh</p>
        <h1 className="display mt-8 max-w-[18ch] text-[clamp(2.4rem,4.68vw,4.99rem)]" data-split="lines">
          E-commerce website development in <em className="text-accent">Bangladesh.</em>
        </h1>

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-16">
          <div className="col-span-12 lg:col-span-3">
            <ul className="article-meta eyebrow text-muted">
              <li>Starting at {price}</li>
              <li>Built in {site.city}</li>
            </ul>
          </div>
          <div className="article col-span-12 lg:col-span-8 lg:col-start-5">
            <p className="article-lead">
              {site.name} builds online stores for brands and businesses in Bangladesh. Your products get their own pages, customers can order from their phone, and your team runs the store from an admin dashboard.
            </p>

            <h2>Who it’s for</h2>
            <p>{plan.for}. It also suits sellers who take orders on Facebook or Instagram and want a proper store of their own.</p>

            <h2>What’s included</h2>
            <ul>
              {plan.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {plan.note && <p>{plan.note}</p>}

            <h2>E-commerce website price in Bangladesh</h2>
            <p>Our e-commerce websites start at {price}. The final price depends on how many products you sell, the features you need and whether you add bKash payments. You get a written quote before any work starts.</p>

            <h2>How a project runs</h2>
            <ul>
              <li><strong>Brief.</strong> Tell us what you sell, how many products you have and how customers should order.</li>
              <li><strong>Scope and quote.</strong> We agree on pages, features and a timeline, then give you a written price.</li>
              <li><strong>Design and build.</strong> You see layouts and a working preview before anything goes live.</li>
              <li><strong>Launch.</strong> We deploy the store and fix any bugs in the warranty period after launch.</li>
            </ul>

            <h2>Common questions</h2>
            {faqs.map((f) => (
              <div key={f.q} lang={"lang" in f ? f.lang : undefined}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <p>
              See all packages on the <TLink href="/pricing" className="inline-link">pricing page</TLink>, read{" "}
              <TLink href="/blog/how-much-does-a-website-cost-in-bangladesh" className="inline-link">what changes a website quote</TLink>
              {showWork && <>, or <TLink href="/work" className="inline-link">see our work</TLink></>}. Ready to start?{" "}
              <TLink href="/contact?package=business" className="inline-link">Send us a short brief</TLink>.
            </p>
          </div>
        </div>
      </article>
      <ContactCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(jsonLd) }} />
    </>
  );
}
