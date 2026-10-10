import SectionLabel from "@/components/ui/SectionLabel";
import ToolMarquee from "@/components/ui/ToolMarquee";
import TLink from "@/components/layout/TLink";
import GlowLink from "@/components/ui/GlowLink";
import WorkCard from "@/components/work/WorkCard";
import StandardsChecklist from "./StandardsChecklist";
import ScrollWords from "./ScrollWords";
import ApproachAssemble from "./ApproachAssemble";
import type { Project } from "@/content/projects";
import { bookCall, pillars, positioning, site, testimonials } from "@/content/site";

/* ── (01) Positioning ──────────────────────────────────────── */
export function Positioning() {
  return (
    <section className="px-page relative pb-20 pt-24 md:pb-28 md:pt-36" aria-labelledby="pos-label" data-annot="section · positioning">
      <h2 id="pos-label" className="sr-only">
        What we do
      </h2>
      <SectionLabel index="01" label="The studio" />
      <div className="mt-10 grid grid-cols-12 gap-x-6 md:mt-16">
        {/* Full width so the long statement doesn't leave an empty column beside it */}
        <ScrollWords
          text={positioning}
          className="col-span-12 text-[clamp(1.7rem,3.6vw,3.8rem)] font-semibold leading-[1.08] tracking-[-0.04em] lg:col-span-11"
        />
        <p className="eyebrow col-span-12 mt-6 text-muted md:col-span-4 md:col-start-9 md:mt-8 md:text-right" data-reveal="fade">
          Websites first. Tools when needed.
        </p>
      </div>
    </section>
  );
}

/* ── (02) Selected work ────────────────────────────────────── */
const LAYOUT = [
  // Every frame is 16:10, the shape of a desktop screenshot, so nothing gets cropped away.
  // The stagger comes from column widths and vertical offsets instead.
  { col: "md:col-span-7", aspect: "aspect-[16/10]", offset: "" },
  { col: "md:col-span-5 md:col-start-8", aspect: "aspect-[16/10]", offset: "md:mt-[6vw]" },
  { col: "md:col-span-5 md:col-start-2", aspect: "aspect-[16/10]", offset: "md:mt-[4vw]" },
  { col: "md:col-span-6 md:col-start-7", aspect: "aspect-[16/10]", offset: "md:mt-[12vw]" },
];

export function SelectedWork({ projects }: { projects: Project[] }) {
  const featured = projects.slice(0, 4);
  return (
    <section className="px-page relative pb-20 md:pb-28" aria-labelledby="work-title" data-annot="section · selected work">
      <SectionLabel index="02" label="Selected work" />
      <div className="mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-end md:justify-between">
        <h2 id="work-title" className="display text-[clamp(2.8rem,7vw,7.5rem)]" data-split="chars">
          The work
        </h2>
        <div className="flex flex-col items-start gap-4 md:items-end md:pb-4">
          <TLink href="/work" className="btn btn-ghost" data-reveal="rise">
            All projects ({projects.length}) <span className="btn-arrow">→</span>
          </TLink>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-16 md:mt-20 md:grid-cols-12 md:gap-y-0">
        {featured.map((p, i) => (
          <div key={p.slug} className={`${LAYOUT[i % 4].col} ${LAYOUT[i % 4].offset}`}>
            <WorkCard project={p} index={i} aspect={LAYOUT[i % 4].aspect} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── (03) Capabilities ─────────────────────────────────────── */
function PillarColumn({ data, dark }: { data: (typeof pillars)[number]; dark?: boolean }) {
  return (
    <div className={`cap-col relative px-6 py-10 md:px-8 md:py-12 ${dark ? "cap-dark" : "bg-surface"}`}>
      <p className="eyebrow opacity-70">{data.sub}</p>
      <h3 className="display mt-2 text-[clamp(1.8rem,2.4vw,2.4rem)]">{data.title}</h3>
      <ul className="mt-8">
        {data.items.map((item) => (
          <li key={item.name} className="pillar-row">
            <span className="list-bar mt-[0.35em]" aria-hidden="true" />
            <span>
              <span className="cap-name block text-[clamp(1.02rem,1.2vw,1.15rem)] font-medium">{item.name}</span>
              <span className="mt-1 block text-[15px] opacity-75">{item.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Capabilities() {
  return (
    <section id="services" className="px-page relative scroll-mt-[var(--nav-h)] pb-20 md:pb-28" aria-labelledby="cap-title" data-annot="section · capabilities">
      <SectionLabel index="03" label="Capabilities" />
      <div className="mt-10 grid grid-cols-12 gap-x-6 md:mt-14">
        <h2 id="cap-title" className="display col-span-12 text-[clamp(2.6rem,6vw,6.4rem)] md:col-span-8" data-split="lines">
          What we <em className="text-accent">build.</em>
        </h2>
        <p className="body-lg col-span-12 mt-6 max-w-[40ch] md:col-span-4 md:mt-0 md:self-end" data-split="lines">
          Three areas, one team. Websites, data and AI, scoped to what your business actually needs.
        </p>
      </div>
      {/* One column per area: light, dark, light. */}
      <div className="mt-14 grid grid-cols-1 gap-px border border-rule bg-[var(--rule)] md:mt-20 lg:grid-cols-3" data-reveal="rise">
        {pillars.map((p, i) => (
          <PillarColumn key={p.title} data={p} dark={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

/* ── (04) Approach ─────────────────────────────────────────── */
export function Approach({ index = "04" }: { index?: string }) {
  return (
    <section className="px-page relative pb-20 md:pb-28" aria-labelledby="app-title" data-annot="section · approach">
      <SectionLabel index={index} label="Approach" />
      <ApproachAssemble />
    </section>
  );
}

/* ── (05) Standards + integrations (credibility without invented claims) ── */
export function Standards() {
  return (
    <section className="relative pb-20 md:pb-28" aria-labelledby="std-title" data-annot="section · standards">
      <div className="px-page">
        <SectionLabel index="05" label="What to expect" />
        <div className="mt-10 grid grid-cols-12 gap-x-6 md:mt-14">
          <h2 id="std-title" className="display col-span-12 text-[clamp(2.6rem,5.6vw,6rem)] md:col-span-7" data-split="lines">
            What you can <em className="text-accent">expect.</em>
          </h2>
        </div>

        <StandardsChecklist />
      </div>

      <div className="mt-20 md:mt-28" aria-labelledby="int-title">
        <p id="int-title" className="eyebrow px-page text-muted" data-reveal="scramble">
          What we build with
        </p>
        <ToolMarquee className="mt-6" />
      </div>

      {testimonials.length > 0 && (
        <div className="px-page mt-24 grid gap-10 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure key={t.name} data-reveal="rise">
              <blockquote className="display text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1.1]">“{t.quote}”</blockquote>
              <figcaption className="eyebrow mt-5 text-muted">
                {t.name}, {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Contact CTA ───────────────────────────────────────────── */
export function ContactCTA() {
  return (
    <section className="cta-block relative overflow-hidden" aria-labelledby="cta-title" data-annot="section · contact CTA">
      <div className="px-page py-24 md:py-36">
        <p className="eyebrow flex items-center gap-3 opacity-80" data-reveal="scramble">
          <span className="live-dot" aria-hidden="true" /> {site.availability}
        </p>
        <h2 id="cta-title" className="display mt-8 text-[clamp(2.6rem,8vw,8.8rem)]" data-split="chars">
          Tell us about <em className="text-accent">your business.</em>
        </h2>
        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-16">
          <p className="col-span-12 max-w-[42ch] text-[clamp(1.05rem,1.3vw,1.3rem)] leading-[1.5] opacity-80 md:col-span-5" data-reveal="rise">
            Tell us what you need. {site.responseTime}
          </p>
          <div className="col-span-12 flex flex-col items-start gap-6 md:col-span-6 md:col-start-7" data-reveal="rise" data-delay="120">
            <a href={`mailto:${site.email}`} className="cta-email font-display text-[clamp(1.5rem,3vw,3rem)] font-bold leading-tight tracking-[-0.035em]">
              {site.email}
            </a>
            <div className="flex flex-wrap gap-3">
              <GlowLink href="/contact" tone="invert">Start a project</GlowLink>
              <a {...bookCall} className="btn btn-ghost-invert">
                Book a call
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
