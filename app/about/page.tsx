import type { Metadata } from "next";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";
import DotField from "@/components/about/DotField";
import StackCards from "@/components/ui/StackCards";
import ToolMarquee from "@/components/ui/ToolMarquee";
import { ContactCTA } from "@/components/home/Sections";
import { about, site, team } from "@/content/site";

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
  ["We build", "Websites, databases, software and AI"],
  ["How we work", "Discuss, design, build, launch"],
];

export default function AboutPage() {
  return (
    <>
      <section className="px-page pb-24 pt-[calc(var(--nav-h)+10svh)] md:pb-28" aria-labelledby="about-h" data-annot="page · /about">
        <p className="eyebrow text-muted" data-reveal="scramble">
          About {site.name}
        </p>
        <h1 id="about-h" className="display mt-6 text-[clamp(2.8rem,8vw,9rem)]" data-split="chars">
          Websites first. <em className="text-accent">Tools when needed.</em>
        </h1>
        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-12 md:mt-20 md:gap-y-16">
          <p className="col-span-12 text-[clamp(1.5rem,2.6vw,2.6rem)] font-semibold leading-[1.14] tracking-[-0.035em] md:col-span-10 lg:col-span-9" data-split="lines">
            {about.intro}
          </p>
          {/* Quick facts as one row under the intro */}
          <dl className="about-facts col-span-12" data-reveal="stagger">
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
      <section className="px-page pb-20 md:pb-28" aria-labelledby="sides-h">
        <SectionLabel index="01" label="The idea" />
        <h2 id="sides-h" className="display mt-10 max-w-[16ch] text-[clamp(2.4rem,4.8vw,5.2rem)] md:mt-14" data-split="lines">
          Table, plus <em className="text-accent">tech stack.</em>
        </h2>
        <div className="mt-14 grid grid-cols-1 border border-rule md:mt-20 md:grid-cols-2" data-reveal="rise">
          <div className="bg-surface p-6 md:p-12">
            <p className="eyebrow text-accent">Front of house</p>
            <h3 className="display mt-3 text-[clamp(1.8rem,2.4vw,2.4rem)]">What your customers get</h3>
            <ul className="mt-8">
              {sides.guests.map((g) => (
                <li key={g} className="flex items-baseline gap-4 border-t border-rule py-4 text-[1.1rem]">
                  <span className="list-bar" aria-hidden="true" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="cap-dark p-6 md:p-12">
            <p className="eyebrow text-accent">Back of house</p>
            <h3 className="display mt-3 text-[clamp(1.8rem,2.4vw,2.4rem)]">What your team gets</h3>
            <ul className="mt-8">
              {sides.team.map((g) => (
                <li key={g} className="flex items-baseline gap-4 border-t border-[rgb(242_238_230/0.16)] py-4 text-[1.1rem]">
                  <span className="list-bar" aria-hidden="true" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-page pb-20 md:pb-28" aria-labelledby="principles-h">
        <SectionLabel index="02" label="What makes us different" />
        <h2 id="principles-h" className="sr-only">
          Principles
        </h2>
        <div className="mt-12 md:mt-16">
          <StackCards items={about.principles} extra={<DotField />} />
        </div>
      </section>

      {/* Team */}
      <section className="px-page pb-20 md:pb-28" aria-labelledby="team-h">
        <SectionLabel index="03" label="The team" />
        <h2 id="team-h" className="display mt-10 text-[clamp(2.4rem,4.8vw,5.2rem)] md:mt-14" data-split="lines">
          The people <em className="text-accent">behind it.</em>
        </h2>
        {/* Three across once there are three people; until then two wider cards, not an empty column. */}
        <ul className={`mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-20 ${team.length >= 3 ? "lg:grid-cols-3" : "lg:max-w-[64rem]"}`}>
          {team.map((m, i) => (
            <li key={m.name} className="team-card" data-reveal="rise" data-delay={i * 120}>
              <div className="team-photo" data-reveal="mask">
                <Image src={m.photo} alt={m.name} fill style={{ objectPosition: m.focus }} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
              </div>
              <h3 className="mt-5 text-[clamp(1.35rem,1.8vw,1.6rem)] font-semibold tracking-[-0.03em]">{m.name}</h3>
              <p className="mt-2 text-fg-2">{m.study}</p>
              <p className="text-muted">{m.graduation}</p>
              {"github" in m && (
                <a href={m.github} target="_blank" rel="noopener noreferrer" className="team-link mt-4">
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.34.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
                    />
                  </svg>
                  GitHub
                  <span className="sr-only"> profile of {m.name} (opens in a new tab)</span>
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-20 md:pb-28" aria-labelledby="tools-h">
        <div className="px-page">
          <SectionLabel index="04" label="What we build with" />
          <h2 id="tools-h" className="sr-only">
            What we build with
          </h2>
        </div>
        <ToolMarquee className="mt-10 md:mt-14" />
      </section>

      <ContactCTA />
    </>
  );
}
