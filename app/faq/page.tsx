import { pageMeta } from "@/lib/seo";
import TLink from "@/components/layout/TLink";
import { ContactCTA } from "@/components/home/Sections";
import { faqs } from "@/content/faq";
import { site } from "@/content/site";
import { getVisibleProjects } from "@/lib/visibility";

export const metadata = pageMeta({
  title: "FAQ",
  description: `Answers to common questions about ${site.name} and web development in Bangladesh: cost, timelines, ownership, support and how a project runs.`,
  path: "/faq",
});

export default async function FaqPage() {
  const showWork = (await getVisibleProjects()).length > 0;
  // The same questions, as structured data, so Google can show them in results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <section className="px-page pb-20 pt-[calc(var(--nav-h)+8svh)] md:pb-28" aria-labelledby="faq-h">
        <p className="eyebrow text-muted" data-reveal="fade">
          Questions and answers
        </p>
        <h1 id="faq-h" className="display mt-6 text-[clamp(2.6rem,7vw,8rem)]" data-split="lines">
          Frequently asked <em className="text-accent">questions.</em>
        </h1>
        <p className="body-lg mt-8 max-w-[52ch]" data-reveal="fade">
          The things people ask us most about {site.name} and about getting a website built in Bangladesh. Something missing?{" "}
          <TLink href="/contact" className="inline-link">
            Ask us directly
          </TLink>
          .
        </p>

        <dl className="faq-list mt-14 md:mt-20">
          {faqs.map((f) => (
            <div key={f.q} className="faq-item" data-reveal="rise">
              <dt>
                <h2 className="faq-q">{f.q}</h2>
              </dt>
              <dd className="faq-a">
                {f.a}
                {f.q.startsWith("How much") && (
                  <>
                    {" "}
                    <TLink href="/blog/how-much-does-a-website-cost-in-bangladesh" className="inline-link">
                      Read the full cost guide
                    </TLink>
                    .
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="body-lg mt-14 max-w-[52ch]" data-reveal="fade">
          Want to know more about how we work? See{" "}
          <TLink href="/why-tablestack" className="inline-link">
            why businesses choose TableStack
          </TLink>
          {showWork && (
            <>
              {" "}
              or{" "}
              <TLink href="/work" className="inline-link">
                look at our work
              </TLink>
            </>
          )}
          .
        </p>
      </section>
      <ContactCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
