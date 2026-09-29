import type { Metadata } from "next";
import SectionLabel from "@/components/ui/SectionLabel";
import { Approach, ContactCTA } from "@/components/home/Sections";
import { about, integrations, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.intro,
  alternates: { canonical: "/about" },
};

const sides = {
  guests: [
    "A site that feels like your room",
    "The menu in one thumb-scroll",
    "Booking in two taps",
    "Hours and directions that are right",
  ],
  team: [
    "Menus and prices edited in a minute",
    "Bookings routed to one place",
    "Hours updated everywhere at once",
    "A person to message when you need one",
  ],
};

export default function AboutPage() {
  return (
    <>
      <section className="px-page pb-24 pt-[calc(var(--nav-h)+10svh)] md:pb-36" aria-labelledby="about-h" data-annot="page · /about">
        <p className="eyebrow text-muted" data-reveal="scramble">
          About {site.name}
        </p>
        <h1 id="about-h" className="display mt-6 text-[clamp(2.8rem,8vw,9rem)]" data-split="chars">
          Both sides <em className="text-accent">of the pass.</em>
        </h1>
        <div className="mt-12 grid grid-cols-12 gap-x-6 md:mt-20">
          <p className="col-span-12 text-[clamp(1.4rem,2.3vw,2.3rem)] font-semibold leading-[1.14] tracking-[-0.035em] md:col-span-8 md:col-start-5" data-split="lines">
            {about.intro}
          </p>
        </div>
      </section>

      {/* The two sides - the idea behind the name */}
      <section className="px-page pb-28 md:pb-40" aria-labelledby="sides-h">
        <SectionLabel index="01" label="The idea" />
        <h2 id="sides-h" className="display mt-10 max-w-[16ch] text-[clamp(2.4rem,4.8vw,5.2rem)] md:mt-14" data-split="lines">
          Tables for guests. <em className="text-accent">Stacks</em> for the team.
        </h2>
        <div className="mt-14 grid grid-cols-1 border border-rule md:mt-20 md:grid-cols-2" data-reveal="rise">
          <div className="bg-surface p-6 md:p-12">
            <p className="eyebrow text-accent">Front of house</p>
            <h3 className="display mt-3 text-[clamp(1.8rem,2.4vw,2.4rem)]">What your guests get</h3>
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
            <article key={p.code} className="principle border-t border-rule py-10 md:py-14 md:pr-12">
              <div className="flex items-baseline gap-5">
                <span className="display text-[3.2rem] italic leading-none text-accent">{p.code}</span>
                <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium tracking-[-0.03em]">{p.title}</h3>
              </div>
              <p className="mt-5 max-w-[46ch] text-[1.08rem] leading-[1.6] text-fg-2">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* People */}
      <section className="px-page pb-28 md:pb-40" aria-labelledby="people-h">
        <SectionLabel index="03" label="The people" />
        <div className="mt-10 grid grid-cols-12 gap-x-6 md:mt-14">
          <h2 id="people-h" className="display col-span-12 text-[clamp(2.4rem,4.8vw,5.2rem)] md:col-span-6" data-split="lines">
            Small team. <em className="text-accent">Senior hands.</em>
          </h2>
          <p className="body-lg col-span-12 mt-6 max-w-[38ch] md:col-span-4 md:col-start-9 md:mt-0 md:self-end" data-split="lines">
            You work directly with the people designing and building your site. No account managers in between.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {about.team.map((m, i) => (
            <figure key={i} data-reveal="rise" data-delay={i * 120}>
              <div className="hatch relative flex aspect-[4/5] items-end border border-rule bg-surface p-4" data-reveal="mask">
                <span className="display absolute inset-0 grid place-items-center text-[7rem] italic text-[var(--rule-strong)]" aria-hidden="true">
                  {m.placeholder ? "?" : m.name.charAt(0)}
                </span>
                {m.placeholder && (
                  <span className="eyebrow relative bg-[var(--bg)] px-2 py-1 !text-[13px]">Replace: portrait, 1200×1500</span>
                )}
              </div>
              <figcaption className="mt-4">
                <p className="text-xl font-medium tracking-[-0.02em]">
                  {m.name}
                  {m.placeholder && <span className="eyebrow ml-2 text-accent">Placeholder</span>}
                </p>
                <p className="eyebrow mt-1 text-muted">{m.role}</p>
                <p className="mt-3 max-w-[40ch] text-fg-2">{m.bio}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Approach index="04" />

      <section className="px-page pb-28 md:pb-36" aria-labelledby="tools-h">
        <SectionLabel index="05" label="Tools we connect" />
        <h2 id="tools-h" className="sr-only">
          Tools we connect
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
