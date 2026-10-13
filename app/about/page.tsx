import { pageMeta } from "@/lib/seo";
import DotField from "@/components/about/DotField";
import StackCards from "@/components/ui/StackCards";
import ToolMarquee from "@/components/ui/ToolMarquee";
import TeamLinks from "@/components/about/TeamLinks";
import { ContactCTA } from "@/components/home/Sections";
import { about, site, team } from "@/content/site";

export const metadata = pageMeta({
  title: "About Us",
  description: `Meet ${site.name}: a small team in Dhaka, Bangladesh building websites, software, databases and AI tools. See who we are and how we work.`,
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
      <section className="px-page pb-24 pt-[calc(var(--nav-h)+10svh)] md:pb-24" aria-labelledby="about-h" data-annot="page · /about">
        <h1 id="about-h" className="display text-[clamp(2.8rem,6.24vw,7.02rem)]" data-split="chars">
          Websites first. <em className="text-accent">Tools when needed.</em>
        </h1>
        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-12 md:mt-16 md:gap-y-16">
          <p className="col-span-12 text-[clamp(1.5rem,2.03vw,2.03rem)] font-semibold leading-[1.14] tracking-[-0.035em] md:col-span-10 lg:col-span-9" data-split="lines">
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
      <section className="px-page pb-16 md:pb-20" aria-labelledby="team-h">
        <h2 id="team-h" className="display text-[clamp(2.4rem,3.74vw,4.06rem)]" data-split="lines">
          The people <em className="text-accent">behind it.</em>
        </h2>
        <ul className="mt-10 grid auto-rows-fr grid-cols-1 gap-5 md:mt-12 lg:grid-cols-2">
          {team.map((m, i) => (
            <li key={m.name} className="team-card" data-reveal="rise" data-delay={i * 120}>
              <div>
                {"role" in m && <p className="team-card-role">{m.role}</p>}
                <h3 className="team-card-name">{m.name}</h3>
              </div>
              <div className="team-card-details">
                <div>
                  <p className="text-fg-2">{m.study}</p>
                  <p className="text-muted">{m.graduation}</p>
                </div>
                <TeamLinks member={m} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* The two sides - the idea behind the name */}
      <section className="px-page pb-20 md:pb-24" aria-labelledby="sides-h">
        <h2 id="sides-h" className="display max-w-[16ch] text-[clamp(2.4rem,3.74vw,4.06rem)]" data-split="lines">
          Table, plus <em className="text-accent">tech stack.</em>
        </h2>
        <div className="mt-14 grid grid-cols-1 border border-rule md:mt-16 md:grid-cols-2" data-reveal="rise">
          <div className="bg-surface p-6 md:p-12">
            <p className="eyebrow text-accent">Front of house</p>
            <h3 className="display mt-3 text-[clamp(1.8rem,1.87vw,1.87rem)]">What your customers get</h3>
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
            <h3 className="display mt-3 text-[clamp(1.8rem,1.87vw,1.87rem)]">What your team gets</h3>
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
      <section className="px-page pb-12 md:pb-16" aria-labelledby="principles-h">
        <h2 id="principles-h" className="display text-[clamp(2.4rem,3.74vw,4.06rem)]" data-split="lines">
          What makes us different.
        </h2>
        <div className="mt-12 md:mt-16">
          <StackCards items={about.principles} extra={<DotField />} />
        </div>
      </section>

      <section className="pb-20 md:pb-24" aria-labelledby="tools-h">
        <div className="px-page">
          <h2 id="tools-h" className="text-center font-display text-[clamp(1.5rem,1.56vw,1.56rem)] font-semibold">
            What we build with
          </h2>
        </div>
        <ToolMarquee className="mt-6" />
      </section>

      <ContactCTA />
    </>
  );
}
