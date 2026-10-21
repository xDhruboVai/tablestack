import { jsonLdText, pageMeta } from "@/lib/seo";
import TLink from "@/components/layout/TLink";
import GlowLink from "@/components/ui/GlowLink";
import ToolList from "@/components/ui/ToolList";
import { ContactCTA } from "@/components/home/Sections";
import { bookCall, pillars, site, standards } from "@/content/site";
import { getVisibleProjects } from "@/lib/visibility";

export const metadata = pageMeta({
  title: "Web Development & Software Services in Bangladesh",
  description:
    "Web development, database architecture, and agentic AI automation by TableStack in Dhaka, Bangladesh. Custom web applications, e-commerce, and cloud tools.",
  path: "/services",
});

function CheckMark() {
  return (
    <svg className="h-4 w-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export default async function ServicesPage() {
  const visible = await getVisibleProjects();
  const showWork = visible.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${site.url}/services#webpage`,
        url: `${site.url}/services`,
        name: `Services & Capabilities | ${site.name}`,
        description:
          "Web development, database architecture, and agentic AI automation by TableStack in Dhaka, Bangladesh. Custom web applications, e-commerce, and cloud tools.",
        isPartOf: { "@id": `${site.url}/#website` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
          ],
        },
      },
      ...pillars.map((pillar, i) => ({
        "@type": "Service",
        "@id": `${site.url}/services#pillar-${i + 1}`,
        name: pillar.title,
        description: `${pillar.sub}. ${pillar.summary}`,
        provider: { "@id": `${site.url}/#organization` },
        areaServed: [
          { "@type": "Country", name: "Bangladesh" },
          { "@type": "AdministrativeArea", name: "Worldwide" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: pillar.title,
          itemListElement: pillar.items.map((item) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: item.name,
              description: item.note,
            },
          })),
        },
      })),
    ],
  };

  const pillarAnchors = [
    { id: "web-digital", label: "Web & Digital", count: pillars[0].items.length },
    { id: "data-databases", label: "Data & Databases", count: pillars[1].items.length },
    { id: "agentic-ai", label: "Agentic AI", count: pillars[2].items.length },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(jsonLd) }} />

      {/* Hero Header */}
      <section className="px-page pb-16 pt-[calc(var(--nav-h)+8svh)] md:pb-20" aria-labelledby="services-h" data-annot="page · /services">
        <div className="max-w-[72ch]">
          <p className="eyebrow text-accent" data-reveal="fade">
            Capabilities · What we build
          </p>
          <h1 id="services-h" className="display mt-4 text-[clamp(2.5rem,5.46vw,6.24rem)]" data-split="lines">
            Websites, databases <em className="text-accent">& software tools.</em>
          </h1>
          <p className="body-lg mt-6 max-w-[50ch] text-fg-2" data-reveal="fade">
            TableStack is a web and software team in Dhaka, Bangladesh. We build client-facing web applications, robust database architectures, and AI tools that automate real work.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10" data-reveal="rise">
            <GlowLink href="/contact">Start a project</GlowLink>
            <a {...bookCall} className="btn btn-ghost">
              Book a call
            </a>
            {showWork && (
              <TLink href="/work" className="btn btn-ghost">
                See our work
              </TLink>
            )}
          </div>
        </div>

        {/* Quick jump anchor bar */}
        <nav aria-label="Jump to service area" className="mt-12 flex flex-wrap gap-2 border-t border-rule pt-6 md:mt-16">
          <span className="eyebrow mr-2 self-center text-muted">Jump to:</span>
          {pillarAnchors.map((anchor) => (
            <a
              key={anchor.id}
              href={`#${anchor.id}`}
              className="chip tap-pad text-sm hover:border-fg"
            >
              {anchor.label}
              <span className="text-xs text-muted">({anchor.count})</span>
            </a>
          ))}
        </nav>
      </section>

      {/* The Three Core Pillars */}
      <div className="space-y-16 pb-20 md:space-y-24 md:pb-28">
        {pillars.map((pillar, idx) => {
          const anchorId = pillarAnchors[idx].id;
          const roman = String(idx + 1).padStart(2, "0");
          return (
            <section
              key={pillar.title}
              id={anchorId}
              className="px-page scroll-mt-[calc(var(--nav-h)+24px)]"
              aria-labelledby={`pillar-${anchorId}-h`}
            >
              <div className="border-t border-rule pt-10 md:pt-14">
                <div className="grid grid-cols-12 gap-x-6 gap-y-6">
                  {/* Pillar Lead Rail */}
                  <div className="col-span-12 lg:col-span-4">
                    <p className="font-mono text-sm tracking-wider text-accent">{roman} · PILLAR</p>
                    <h2
                      id={`pillar-${anchorId}-h`}
                      className="display mt-2 text-[clamp(2.1rem,3.2vw,3.6rem)]"
                    >
                      {pillar.title}
                    </h2>
                    <p className="body-lg mt-3 font-medium text-fg">{pillar.sub}</p>
                    <p className="mt-3 max-w-[34ch] text-fg-2">{pillar.summary}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <TLink
                        href={`/contact?need=${encodeURIComponent(pillar.title)}`}
                        className="btn btn-ghost text-sm"
                      >
                        Enquire about {pillar.title.toLowerCase()} <span className="btn-arrow" aria-hidden="true">↗</span>
                      </TLink>
                    </div>
                  </div>

                  {/* Pillar Service Items Grid */}
                  <div className="col-span-12 lg:col-span-8">
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {pillar.items.map((item) => (
                        <li
                          key={item.name}
                          className="group relative flex flex-col justify-between rounded-2xl border border-rule bg-surface p-6 transition-all hover:border-accent hover:shadow-sm"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-fg transition-colors group-hover:text-accent">
                                {item.name}
                              </h3>
                              <CheckMark />
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-fg-2">{item.note}</p>
                          </div>
                          <div className="mt-5 pt-3 border-t border-rule/50 flex items-center justify-between text-xs text-muted">
                            <span>TableStack scope</span>
                            <TLink
                              href={`/contact?need=${encodeURIComponent(item.name)}`}
                              className="font-medium text-fg hover:text-accent transition-colors"
                            >
                              Discuss this →
                            </TLink>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Cross-link to Portfolio & Pricing */}
      <section className="px-page pb-20 md:pb-24" aria-labelledby="related-h">
        <div className="rounded-3xl border border-rule bg-surface p-8 md:p-12">
          <div className="grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 md:col-span-8">
              <p className="eyebrow text-accent">Transparent scope</p>
              <h2 id="related-h" className="display mt-2 text-[clamp(1.8rem,2.8vw,3.1rem)]">
                See the work or check starting prices.
              </h2>
              <p className="mt-3 max-w-[48ch] text-fg-2">
                We agree on pages, features and timeline before quoting. See working examples in our portfolio or check our starting packages.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
              {showWork && (
                <TLink href="/work" className="btn btn-primary w-full sm:w-auto text-center">
                  View portfolio ({visible.length}) <span className="btn-arrow">→</span>
                </TLink>
              )}
              <TLink href="/pricing" className="btn btn-ghost w-full sm:w-auto text-center">
                Check pricing packages
              </TLink>
            </div>
          </div>
        </div>
      </section>

      {/* Tools We Build With */}
      <section className="pb-20 md:pb-24" aria-labelledby="tools-h">
        <div className="px-page">
          <h2 id="tools-h" className="text-center font-display text-[clamp(1.5rem,1.56vw,1.56rem)] font-semibold">
            What we build with
          </h2>
        </div>
        <ToolList className="mt-8 md:mt-10" />
      </section>

      {/* Standards */}
      <section className="px-page pb-20 md:pb-24" aria-labelledby="standards-h">
        <div className="border-t border-rule pt-12 md:pt-16">
          <h2 id="standards-h" className="display text-center text-[clamp(2rem,2.8vw,3.2rem)]">
            How we <em className="text-accent">work.</em>
          </h2>
          <p className="text-center mt-3 text-fg-2 max-w-[42ch] mx-auto">
            What a client can expect on every project — agreed scope, working preview, and ownership.
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
            {standards.map((s) => (
              <li key={s.k} className="rounded-2xl border border-rule bg-surface p-6">
                <p className="eyebrow font-bold text-fg">{s.k}</p>
                <p className="mt-2 text-sm text-fg-2">{s.v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Standard Reusable Contact CTA */}
      <ContactCTA />
    </>
  );
}
