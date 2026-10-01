import { pageMeta } from "@/lib/seo";
import TLink from "@/components/layout/TLink";
import { ContactCTA } from "@/components/home/Sections";
import { bookCall, site } from "@/content/site";
import { getVisibleProjects } from "@/lib/visibility";

export const metadata = pageMeta({
  title: "Why Choose TableStack?",
  absoluteTitle: true,
  description: `Why businesses in Bangladesh choose ${site.name}: a fixed quote, a working preview before launch, sites built for phones, and full ownership.`,
  path: "/why-tablestack",
});

const reasons = [
  {
    title: "You know the price before we start",
    body: "We agree the pages, features and timeline with you first, then give one fixed quote. No surprise invoices halfway through.",
  },
  {
    title: "You see it before it goes live",
    body: "First the layouts, then a working preview you can click through on your own phone. Nothing launches until you have seen it.",
  },
  {
    title: "You talk to the people doing the work",
    body: "We are a team of three in Dhaka. The person you message is the person designing or building your site, so nothing gets lost in between.",
  },
  {
    title: "Built for phones first",
    body: "Most of your customers will find you on a phone. We design for that screen first, then make sure it works just as well on a computer.",
  },
  {
    title: "It stays yours",
    body: "Your domain, your content and your accounts are in your name. If you ever move on, you take everything with you.",
  },
  {
    title: "Plain language, short updates",
    body: "We explain what we are doing and why, without jargon, and we are honest about what is included and what is not.",
  },
];

const fit = [
  "A new business that needs its first proper website",
  "A shop or brand that wants to sell online",
  "A company whose current site is slow, dated or hard to use on phones",
  "A team doing repetitive work by hand that software or AI could take over",
  "A business with customer or sales data scattered across spreadsheets",
];

export default async function WhyPage() {
  const showWork = (await getVisibleProjects()).length > 0;
  return (
    <>
      <section className="px-page pb-20 pt-[calc(var(--nav-h)+8svh)] md:pb-28" aria-labelledby="why-h">
        <p className="eyebrow text-muted" data-reveal="fade">
          Why {site.name}
        </p>
        <h1 id="why-h" className="display mt-6 text-[clamp(2.6rem,7vw,8rem)]" data-split="lines">
          Why choose <em className="text-accent">TableStack?</em>
        </h1>
        <p className="body-lg mt-8 max-w-[56ch]" data-reveal="fade">
          There are many web development companies in Bangladesh. Here is what working with {site.name} is actually like, so you can decide whether we are the right fit for your business.
        </p>

        <h2 className="display mt-16 text-[clamp(1.9rem,3.4vw,3.4rem)] md:mt-24" data-split="lines">
          Six things you can count on
        </h2>
        <ul className="why-grid mt-10 md:mt-14">
          {reasons.map((r) => (
            <li key={r.title} className="why-item" data-reveal="rise">
              <span className="list-bar mt-[0.4em]" aria-hidden="true" />
              <div>
                <h3 className="text-[clamp(1.25rem,1.7vw,1.6rem)] font-semibold tracking-[-0.025em]">{r.title}</h3>
                <p className="mt-2 max-w-[44ch] leading-[1.6] text-fg-2">{r.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-24">
          <div className="col-span-12 md:col-span-6">
            <h2 className="display text-[clamp(1.9rem,3.4vw,3.4rem)]" data-split="lines">
              Who we are a good fit for
            </h2>
            <ul className="mt-8" data-reveal="stagger">
              {fit.map((f) => (
                <li key={f} className="flex items-baseline gap-4 border-t border-rule py-4 text-[1.08rem]">
                  <span className="list-bar" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8">
            <h2 className="display text-[clamp(1.9rem,3.4vw,3.4rem)]" data-split="lines">
              See it for yourself
            </h2>
            <p className="mt-8 max-w-[44ch] leading-[1.6] text-fg-2" data-reveal="fade">
              We are a young team, and we would rather show than tell.{" "}
              {showWork && (
                <>
                  Our{" "}
                  <TLink href="/work" className="inline-link">
                    work page
                  </TLink>{" "}
                  has the projects we have launched, each with a link to the live site.{" "}
                </>
              )}
              You can{" "}
              <TLink href="/about" className="inline-link">
                meet the team
              </TLink>
              , read what we{" "}
              <TLink href="/#services" className="inline-link">
                build
              </TLink>
              , or check the{" "}
              <TLink href="/faq" className="inline-link">
                frequently asked questions
              </TLink>
              .
            </p>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal="rise">
              <TLink href="/contact" className="btn btn-primary">
                Start a project <span className="btn-arrow">→</span>
              </TLink>
              <a {...bookCall} className="btn btn-ghost">
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
