import { jsonLdText, pageMeta } from "@/lib/seo";
import TLink from "@/components/layout/TLink";
import { ContactCTA } from "@/components/home/Sections";
import { hrTiers, plans } from "@/content/pricing";
import { site } from "@/content/site";

const path = "/hr-software-bangladesh";
const plan = plans.find((p) => p.id === "hr")!;
const from = hrTiers[0].price.bd;
const description = `HR and payroll software for companies in Bangladesh, built by ${site.name} in Dhaka. Employee records, attendance, leave, payroll and PDF payslips, from ${from}.`;

export const metadata = pageMeta({
  title: "HR & Payroll Software in Bangladesh",
  description,
  path,
});

/* Shown on the page and sent as FAQ structured data, so the two always match. */
const faqs = [
  {
    q: "How much does HR software cost in Bangladesh?",
    a: `Our HR management system starts at ${from} for Basic, ${hrTiers[1].price.bd} for Standard with payroll, and ${hrTiers[2].price.bd} for Enterprise. That is the price to build the system for your company. Hosting is extra unless your proposal includes it.`,
  },
  {
    q: "Does it handle payroll and payslips?",
    a: "Yes, from the Standard level: monthly payroll worksheets, allowances and deductions you can set up, leave balances and PDF payslips.",
  },
  {
    q: "Can it connect to our fingerprint or face attendance machine?",
    a: "Enterprise includes biometric device integration. Many offices use machines such as ZKTeco, so we first check that your devices are compatible before we agree on the scope.",
  },
  {
    q: "Can it be changed to fit how our company works?",
    a: "Yes. We build it for your company, so departments, approval steps and leave rules follow how you already work. Extra features are quoted separately.",
  },
] as const;

export default function HrPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${site.url}${path}#service`,
        name: "HR & Payroll Software",
        serviceType: "HR management software development",
        description,
        provider: { "@id": `${site.url}/#organization` },
        areaServed: { "@type": "Country", name: "Bangladesh" },
        offers: hrTiers.map((t) => ({ "@type": "Offer", name: t.name, priceCurrency: "BDT", price: t.price.bd.replace(/[^0-9]/g, "") })),
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
          { "@type": "ListItem", position: 2, name: "HR Software", item: `${site.url}${path}` },
        ],
      },
    ],
  };

  return (
    <>
      <article className="px-page pb-20 pt-[calc(var(--nav-h)+7svh)] md:pb-24">
        <p className="eyebrow text-accent">HR software · Bangladesh</p>
        <h1 className="display mt-8 max-w-[18ch] text-[clamp(2.4rem,4.68vw,4.99rem)]" data-split="lines">
          HR and payroll software for <em className="text-accent">Bangladesh.</em>
        </h1>

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-16">
          <div className="col-span-12 lg:col-span-3">
            <ul className="article-meta eyebrow text-muted">
              <li>Starting at {from}</li>
              <li>Built in {site.city}</li>
            </ul>
          </div>
          <div className="article col-span-12 lg:col-span-8 lg:col-start-5">
            <p className="article-lead">
              {site.name} builds HR management systems for companies in Bangladesh. Staff records, attendance, leave and payroll sit in one place, set up around the way your company already works.
            </p>

            <h2>Who it’s for</h2>
            <p>{plan.for}, and who are tired of keeping it in spreadsheets and paper files.</p>

            <h2>HR software price in Bangladesh</h2>
            <p>Three levels. Each one includes everything in the level before it.</p>
            {hrTiers.map((t) => (
              <div key={t.id}>
                <h3>{t.name}: from {t.price.bd}</h3>
                <ul>
                  {t.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h2>Common questions</h2>
            {faqs.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <p>
              Compare all packages on the <TLink href="/pricing#hr-levels" className="inline-link">pricing page</TLink>. Ready to start?{" "}
              <TLink href="/contact?package=hr" className="inline-link">Tell us about your team</TLink>.
            </p>
          </div>
        </div>
      </article>
      <ContactCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(jsonLd) }} />
    </>
  );
}
