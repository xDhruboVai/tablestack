import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";
import DotField from "@/components/about/DotField";
import StackCards from "@/components/ui/StackCards";
import ToolMarquee from "@/components/ui/ToolMarquee";
import SocialIcon from "@/components/ui/SocialIcon";
import { ContactCTA } from "@/components/home/Sections";
import { about, site, team } from "@/content/site";

export const metadata = pageMeta({
  title: "About Us",
  description: `Meet ${site.name}: three people in Dhaka, Bangladesh who design and build websites, software, databases and AI tools. See who we are and how we work.`,
  path: "/about",
});

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
          About Us
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

      {/* Team */}
      <section className="px-page pb-20 md:pb-28" aria-labelledby="team-h">
        <SectionLabel index="01" label="Who we are" />
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
              <p className="mt-1 font-medium text-[var(--accent-text)]">{m.role}</p>
              <p className="mt-3 text-fg-2">{m.study}</p>
              <p className="text-muted">{m.graduation}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {"github" in m && (
                  <li>
                    <a href={m.github} target="_blank" rel="noopener noreferrer" className="team-chip">
                      <SocialIcon name="github" />
                      GitHub<span className="sr-only"> profile of {m.name} (opens in a new tab)</span>
                    </a>
                  </li>
                )}
                <li>
                  <a href={m.facebook} target="_blank" rel="noopener noreferrer" className="team-chip">
                    <SocialIcon name="facebook" />
                    Facebook<span className="sr-only"> profile of {m.name} (opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/880${m.whatsapp.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-chip"
                    title={`WhatsApp ${m.whatsapp.slice(0, 5)} ${m.whatsapp.slice(5)}`}
                  >
                    <SocialIcon name="whatsapp" />
                    WhatsApp<span className="sr-only"> {m.name} on {m.whatsapp} (opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* The two sides - the idea behind the name */}
      <section className="px-page pb-20 md:pb-28" aria-labelledby="sides-h">
        <SectionLabel index="02" label="The idea" />
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
                <li key={g} className="flex items-baseline gap-4 border-t border-[rgb(238_232_227/0.16)] py-4 text-[1.1rem]">
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
        <SectionLabel index="03" label="What makes us different" />
        <h2 id="principles-h" className="sr-only">
          Principles
        </h2>
        <div className="mt-12 md:mt-16">
          <StackCards items={about.principles} extra={<DotField />} />
        </div>
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
