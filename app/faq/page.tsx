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
        <h1 id="faq-h" className="display max-w-[13ch] text-[clamp(2.6rem,7vw,8rem)]" data-split="lines">
          Questions before <em className="text-accent">we start.</em>
        </h1>
        <p className="body-lg mt-8 max-w-[52ch]" data-reveal="fade">
          Short answers to decisions that matter when you’re buying a website.
        </p>

        <div className="faq-details mt-14 md:mt-20">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
              {f.q.startsWith("How do you price") && <TLink href="/blog/how-much-does-a-website-cost-in-bangladesh" className="inline-link mt-4 inline-block">Read the cost guide ↗</TLink>}
            </details>
          ))}
        </div>

        <p className="body-lg mt-14 max-w-[52ch]" data-reveal="fade">
          Something else on your mind? <TLink href="/contact" className="inline-link">Ask us directly</TLink>
          {showWork && <> or <TLink href="/work" className="inline-link">explore the work</TLink></>}.
        </p>
      </section>
      <ContactCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
