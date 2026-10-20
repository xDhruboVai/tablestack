import { jsonLdText, pageMeta } from "@/lib/seo";
import ToolList from "@/components/ui/ToolList";
import TeamLinks from "@/components/about/TeamLinks";
import GlowLink from "@/components/ui/GlowLink";
import { MARK_GAPS, MARK_SLAB, MARK_VIEWBOX } from "@/components/layout/Wordmark";
import { ContactCTA } from "@/components/home/Sections";
import { about, bookCall, site, team } from "@/content/site";

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

/**
 * The logo mark with one half lit: the top slab for what customers see, the two below it for what the
 * team works with. The other half stays faint.
 */
function SideMark({ side }: { side: "front" | "back" }) {
  return (
    <svg className="side-mark" viewBox={MARK_VIEWBOX} aria-hidden="true">
      <mask id={`side-gaps-${side}`} maskUnits="userSpaceOnUse" x="0" y="0" width="920" height="652">
        <rect width="920" height="652" fill="#fff" />
        <path d={MARK_GAPS} stroke="#000" strokeWidth="12.5" />
      </mask>
      <g mask={`url(#side-gaps-${side})`} className="side-mark-base">
        <path d={MARK_SLAB(320)} />
        <path d={MARK_SLAB(160)} />
      </g>
      <path d={MARK_SLAB(0)} className="side-mark-top" />
    </svg>
  );
}

/**
 * A small drawing of each half of a site: the page customers see, and the admin screen behind it
 * (switches like the ones we use to turn projects on and off). Pointing at the card flips a switch
 * or presses the button.
 */
function TeamArt({ side }: { side: "front" | "back" }) {
  return (
    <div className="team-art" aria-hidden="true">
      <div className="team-art-bar">
        <i />
        <i />
        <i />
      </div>
      {side === "front" ? (
        <div className="team-art-page">
          <span className="team-art-hero" />
          <span className="team-art-line" />
          <span className="team-art-line team-art-line-short" />
          <span className="team-art-button" />
        </div>
      ) : (
        <div className="team-art-admin">
          {[true, true, false, true].map((on, i) => (
            <span key={i} className={`team-art-row ${on ? "is-on" : ""}`}>
              <b />
              <u />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${site.url}/about#webpage`,
        url: `${site.url}/about`,
        name: `About Us | ${site.name}`,
        description: `Meet ${site.name}: a small team in Dhaka, Bangladesh building websites, software, databases and AI tools.`,
        isPartOf: { "@id": `${site.url}/#website` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "About Us", item: `${site.url}/about` },
          ],
        },
        mainEntity: { "@id": `${site.url}/#organization` },
      },
      ...team.map((m) => ({
        "@type": "Person",
        name: m.name,
        jobTitle: m.role,
        worksFor: { "@id": `${site.url}/#organization` },
        sameAs: [m.facebook, m.github, "portfolio" in m ? m.portfolio : undefined].filter(Boolean),
        alumniOf: {
          "@type": "EducationalOrganization",
          name: m.study.split(",")[0].trim(),
        },
      })),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(jsonLd) }} />
      {/* Hero: the pitch on the left, the quick facts as a small stack of cards on the right */}
      <section className="about-hero px-page" aria-labelledby="about-h" data-annot="page · /about">
        <div className="about-hero-copy">
          <h1 id="about-h" className="about-hero-title display" data-split="chars">
            Websites first. <em className="block text-accent">Tools when needed.</em>
          </h1>
          <p className="about-hero-intro" data-split="lines">
            {about.intro}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10" data-reveal="rise" data-delay="200">
            <GlowLink href="/contact">Start a project</GlowLink>
            <a {...bookCall} className="btn btn-ghost">
              Book a call
            </a>
          </div>
        </div>
        <ul className="about-stack" aria-label="TableStack at a glance" data-reveal="stagger" data-delay="250">
          {facts.map(([k, v]) => (
            <li key={k} className="about-stack-item">
              <div className="about-stack-card">
                <p className="about-stack-label">{k}</p>
                <p className="about-stack-value">{v}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Team */}
      <section className="px-page pb-16 md:pb-20" aria-labelledby="team-h">
        <h2 id="team-h" className="display text-[clamp(2.4rem,3.74vw,4.06rem)]" data-split="lines">
          The people <em className="text-accent">behind it.</em>
        </h2>
        <ul className="mt-10 grid auto-rows-fr grid-cols-1 gap-5 md:mt-12 lg:grid-cols-2">
          {team.map((m, i) => (
            <li key={m.name} className={`team-card team-card-${m.side}`} data-reveal="rise" data-delay={i * 120}>
              <div>
                <p className="team-card-side">{m.side === "back" ? "Back of house" : "Front of house"}</p>
                <h3 className="team-card-name">{m.name}</h3>
                <p className="team-card-role">{m.role}</p>
              </div>
              <TeamArt side={m.side} />
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
        <div className="sides mt-12 md:mt-14" data-reveal="stagger">
          {(
            [
              ["front", "Front of house", "What your customers get", sides.guests],
              ["back", "Back of house", "What your team gets", sides.team],
            ] as const
          ).map(([side, label, title, items]) => (
            <div key={side} className={`side-card side-card-${side}`}>
              <div className="side-card-top">
                <p className="side-card-label">{label}</p>
                <SideMark side={side} />
              </div>
              <h3 className="side-card-title display">{title}</h3>
              <ul className="side-card-list">
                {items.map((item) => (
                  <li key={item}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20 md:pb-24" aria-labelledby="tools-h">
        <div className="px-page">
          <h2 id="tools-h" className="text-center font-display text-[clamp(1.5rem,1.56vw,1.56rem)] font-semibold">
            What we build with
          </h2>
        </div>
        <ToolList className="mt-8 md:mt-10" />
      </section>

      <ContactCTA />
    </>
  );
}
