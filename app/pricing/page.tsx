import { cookies, headers } from "next/headers";
import { jsonLdText, pageMeta } from "@/lib/seo";
import TLink from "@/components/layout/TLink";
import { ContactCTA } from "@/components/home/Sections";
import RegionToggle from "@/components/ui/RegionToggle";
import { addOns, hrTiers, plans, pricingNotes, REGION_COOKIE, regionNotes, regionOf } from "@/content/pricing";
import { bookCall, site } from "@/content/site";

export const metadata = pageMeta({
  title: "Pricing",
  description: `Starting prices from ${site.name} for landing pages, business and e-commerce sites, HR management systems, and custom work by quote.`,
  path: "/pricing",
});

function Tick() {
  return (
    <svg className="price-tick" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}

export default async function PricingPage() {
  // The visitor's pick from the currency switch, else Vercel's IP lookup (no permission prompt). Local dev: USD.
  const region = regionOf((await headers()).get("x-vercel-ip-country"), (await cookies()).get(REGION_COOKIE)?.value);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${site.url}/pricing#webpage`,
        url: `${site.url}/pricing`,
        name: `Pricing | ${site.name}`,
        description: `Starting prices from ${site.name} for landing pages, business and e-commerce sites, HR management systems, and custom work by quote.`,
        isPartOf: { "@id": `${site.url}/#website` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "Pricing", item: `${site.url}/pricing` },
          ],
        },
      },
      {
        "@type": "OfferCatalog",
        "@id": `${site.url}/pricing#catalog`,
        name: `${site.name} Web Development Plans`,
        provider: { "@id": `${site.url}/#organization` },
        itemListElement: plans.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          description: `${plan.for}. Included: ${plan.included.join(", ")}`,
          priceCurrency: region === "bd" ? "BDT" : "USD",
          ...(plan.price?.[region] ? { price: plan.price[region].replace(/[^0-9]/g, "") } : {}),
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(jsonLd) }} />
      <section className="px-page pb-20 pt-[calc(var(--nav-h)+8svh)] md:pb-24" aria-labelledby="pricing-h" data-annot="page · /pricing">
        <h1 id="pricing-h" className="display text-[clamp(2.6rem,5.46vw,6.24rem)]" data-split="lines">
          Prices to <em className="text-accent">start from.</em>
        </h1>
        <div className="mt-8">
          <RegionToggle region={region} />
        </div>

        {/* The four packages: paper, black, amber and yellow, so each one is easy to tell apart. */}
        <div className="price-grid mt-14 md:mt-16" data-reveal="rise">
          {plans.map((plan) => (
            <article key={plan.id} className={`price-card price-card-${plan.tone}`} aria-labelledby={`plan-${plan.id}`}>
              <h2 id={`plan-${plan.id}`} className="price-name">{plan.name}</h2>
              <p className="price-for">{plan.for}</p>
              <p className="price-amount">
                <span className="price-from">{plan.price ? "Starting at" : "Priced per project"}</span>
                <b className={plan.price ? "" : "price-quote"}>{plan.price?.[region] ?? "Request a quote"}</b>
              </p>
              <ul className="price-list">
                {plan.included.map((item) => (
                  <li key={item}>
                    <Tick />
                    {item}
                  </li>
                ))}
              </ul>
              {plan.id === "hr" && (
                <ul className="price-tiers" aria-label="HR system levels">
                  {hrTiers.map((tier) => (
                    <li key={tier.name}>
                      <span>{tier.name}</span>
                      <b>{tier.price[region]}</b>
                    </li>
                  ))}
                </ul>
              )}
              {plan.note && <p className="price-note">{plan.note}</p>}
              <div className="price-actions">
                {plan.id === "hr" && (
                  <a href="#hr-levels" className="price-more">
                    Compare the three levels <span aria-hidden="true">↓</span>
                  </a>
                )}
                <TLink href={`/contact?package=${plan.id}`} className="btn price-cta">
                  {plan.cta} <span className="btn-arrow" aria-hidden="true">↗</span>
                </TLink>
              </div>
            </article>
          ))}
        </div>

        <ul className="price-fine mt-10" aria-label="Good to know" data-reveal="fade">
          {[...regionNotes[region], ...pricingNotes].map((note) => (
            <li key={note}>
              <span className="list-bar" aria-hidden="true" />
              {note}
            </li>
          ))}
        </ul>
      </section>

      {/* The HR system's three levels side by side. */}
      <section id="hr-levels" className="px-page scroll-mt-[var(--nav-h)] pb-20 md:pb-24" aria-labelledby="hr-h">
        <div className="grid grid-cols-12 gap-x-6">
          <h2 id="hr-h" className="display col-span-12 text-[clamp(2.2rem,3.1vw,3.6rem)] md:col-span-8" data-split="lines">
            The HR system, <em className="text-accent">three levels.</em>
          </h2>
          <p className="body-lg col-span-12 mt-6 max-w-[38ch] md:col-span-4 md:mt-0 md:self-end" data-reveal="fade">
            Each level includes everything in the one before it.
          </p>
        </div>
        <div className="hr-levels mt-12" data-reveal="rise">
          {hrTiers.map((tier) => (
            <div key={tier.name} className="hr-level">
              <h3>{tier.name}</h3>
              <p className="hr-level-price">{tier.price[region]}</p>
              <p className="hr-level-lead">{tier.lead}</p>
              <ul className="price-list">
                {tier.items.map((item) => (
                  <li key={item}>
                    <Tick />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between" data-reveal="fade">
          <p className="max-w-[62ch] text-fg-2">
            Country-specific payroll tax and other legal requirements are not included. If you need them, we scope them separately.
          </p>
          <TLink href="/contact?package=hr" className="btn btn-primary">
            Discuss HR requirements <span className="btn-arrow" aria-hidden="true">↗</span>
          </TLink>
        </div>
      </section>

      {/* Add-ons, folded away until someone wants them. */}
      <section className="px-page pb-20 md:pb-24" aria-labelledby="extras-h">
        <details className="price-extras">
          <summary>
            <span>
              <span id="extras-h" className="price-extras-title">Add-ons</span>
              <span className="price-extras-sub">SEO setup and extra features</span>
            </span>
          </summary>
          <ul className="price-extras-list">
            {addOns.map((a) => (
              <li key={a.id}>
                <span>{a.name}</span>
                <b>{a.price[region]}</b>
              </li>
            ))}
          </ul>
          <p className="price-extras-note">
            These prices are a guide. The final quote depends on the scope. Not sure what you need?{" "}
            <a {...bookCall} className="inline-link">Book a call</a>.
          </p>
        </details>
      </section>

      <ContactCTA />
    </>
  );
}
