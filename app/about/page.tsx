import type { Metadata } from "next";
import SectionLabel from "@/components/ui/SectionLabel";
import DotField from "@/components/about/DotField";
import { Approach, ContactCTA } from "@/components/home/Sections";
import { about, integrations, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.intro,
  alternates: { canonical: "/about" },
};

const sides = {
  guests: [
    "A site built around your business",
    "Menus, products or services that are easy to find",
    "Booking, ordering or enquiring in a few taps",
    "Hours, locations and contact details that are right",
  ],
  team: [
    "Content you can update yourselves, where it’s in scope",
    "Bookings and orders collected in one place",
    "Dashboards and admin tools when they’re needed",
    "A team to talk to when something changes",
  ],
};

const facts = [
  ["Based in", site.location],
  ["We build", "Websites, online shops and the systems behind them"],
  ["How we work", "Discuss, design, build, launch"],
];

export default function AboutPage() {
  return (
    <>
      <section className="px-page pb-24 pt-[calc(var(--nav-h)+10svh)] md:pb-36" aria-labelledby="about-h" data-annot="page · /about">
        <p className="eyebrow text-muted" data-reveal="scramble">
          About {site.name}
        </p>
        <h1 id="about-h" className="display mt-6 text-[clamp(2.8rem,8vw,9rem)]" data-split="chars">
          Websites first. <em className="text-accent">Tools when needed.</em>
        </h1>
        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-12 md:mt-20">
          <p className="col-span-12 text-[clamp(1.4rem,2.3vw,2.3rem)] font-semibold leading-[1.14] tracking-[-0.035em] md:col-span-7 md:col-start-6 md:row-start-1 lg:col-span-8 lg:col-start-5" data-split="lines">
            {about.intro}
          </p>
          {/* Quick facts fill the left column beside the intro */}
          <dl className="about-facts col-span-12 md:col-span-4 md:col-start-1 md:row-start-1 lg:col-span-3" data-reveal="stagger">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div>
              <dt className="eyebrow text-muted">Status</dt>
              <dd className="flex items-center gap-2">
                <span className="live-dot" aria-hidden="true" /> {site.availability}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* The two sides - the idea behind the name */}
      <section className="px-page pb-28 md:pb-40" aria-labelledby="sides-h">
        <SectionLabel index="01" label="The idea" />
        <h2 id="sides-h" className="display mt-10 max-w-[16ch] text-[clamp(2.4rem,4.8vw,5.2rem)] md:mt-14" data-split="lines">
          Table, plus <em className="text-accent">tech stack.</em>
        </h2>
        <div className="mt-14 grid grid-cols-1 border border-rule md:mt-20 md:grid-cols-2" data-reveal="rise">
          <div className="bg-surface p-6 md:p-12">
            <p className="eyebrow text-accent">Front of house</p>
            <h3 className="display mt-3 text-[clamp(1.8rem,2.4vw,2.4rem)]">What your customers get</h3>
            <ul className="mt-8">
              {sides.guests.map((g, i) => (
                <li key={g} className="flex items-baseline gap-4 border-t border-rule py-4 text-[1.1rem]">
                  <span className="eyebrow w-6 text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="cap-dark p-6 md:p-12">
            <p className="eyebrow text-accent">Back of house</p>
            <h3 className="display mt-3 text-[clamp(1.8rem,2.4vw,2.4rem)]">What your team gets</h3>
            <ul className="mt-8">
              {sides.team.map((g, i) => (
                <li key={g} className="flex items-baseline gap-4 border-t border-[rgb(242_238_230/0.16)] py-4 text-[1.1rem]">
                  <span className="eyebrow w-6 opacity-60">{String(i + 1).padStart(2, "0")}</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-page pb-28 md:pb-40" aria-labelledby="principles-h">
        <SectionLabel index="02" label="What makes us different" />
        <h2 id="principles-h" className="sr-only">
          Principles
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-x-6 md:mt-16 md:grid-cols-2" data-reveal="stagger">
          {about.principles.map((p) => (
            <article key={p.code} className="principle relative border-t border-rule py-10 md:py-14 md:pr-12">
              <DotField />
              <div className="relative flex items-baseline gap-5">
                <span className="display text-[3.2rem] italic leading-none text-accent">{p.code}</span>
                <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium tracking-[-0.03em]">{p.title}</h3>
              </div>
              <p className="relative mt-5 max-w-[46ch] text-[1.08rem] leading-[1.6] text-fg-2">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <Approach index="03" />

      <section className="px-page pb-28 md:pb-36" aria-labelledby="tools-h">
        <SectionLabel index="04" label="What we build with" />
        <h2 id="tools-h" className="sr-only">
          What we build with
        </h2>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 md:mt-14" data-reveal="stagger">
          {integrations.map((t) => (
            <li key={t} className="font-display text-[clamp(1.5rem,2.6vw,2.6rem)] font-bold italic leading-tight tracking-[-0.04em]">
              {t}
              <span className="ml-8 text-[0.45em] not-italic text-accent" aria-hidden="true">
                ✳
              </span>
            </li>
          ))}
        </ul>
      </section>

      <ContactCTA />
    </>
  );
}
