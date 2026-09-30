import SectionLabel from "@/components/ui/SectionLabel";
import TLink from "@/components/layout/TLink";
import WorkCard from "@/components/work/WorkCard";
import ScrollWords from "./ScrollWords";
import ApproachRail from "./ApproachRail";
import { projects, featuredSlugs } from "@/content/projects";
import { bookCall, capabilities, integrations, positioning, site, standards, testimonials } from "@/content/site";

/* ── (01) Positioning ──────────────────────────────────────── */
export function Positioning() {
  return (
    <section className="px-page relative pb-28 pt-24 md:pb-40 md:pt-36" aria-labelledby="pos-label" data-annot="section · positioning">
      <h2 id="pos-label" className="sr-only">
        What we do
      </h2>
      <SectionLabel index="01" label="The studio" />
      <div className="mt-10 grid grid-cols-12 gap-x-6 md:mt-16">
        <p className="eyebrow col-span-12 mb-6 text-muted md:col-span-3 md:mb-0" data-reveal="fade">
          Websites first.
          <br />
          Tools when needed.
        </p>
        <ScrollWords
          text={positioning}
          className="col-span-12 text-[clamp(1.7rem,3.6vw,3.8rem)] font-semibold leading-[1.08] tracking-[-0.04em] md:col-span-9"
        />
      </div>
    </section>
  );
}

/* ── (02) Selected work ────────────────────────────────────── */
const LAYOUT = [
  // Every frame is 16:10, the shape of a desktop screenshot, so nothing gets cropped away.
  // The stagger comes from column widths and vertical offsets instead.
  { col: "md:col-span-7", aspect: "aspect-[16/10]", offset: "" },
  { col: "md:col-span-5 md:col-start-8", aspect: "aspect-[16/10]", offset: "md:mt-[16vw]" },
  { col: "md:col-span-5 md:col-start-2", aspect: "aspect-[16/10]", offset: "md:mt-[4vw]" },
  { col: "md:col-span-6 md:col-start-7", aspect: "aspect-[16/10]", offset: "md:mt-[12vw]" },
];

export function SelectedWork() {
  const featured = featuredSlugs.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  const anyPlaceholder = featured.some((p) => p.placeholder);
  return (
    <section className="px-page relative pb-28 md:pb-40" aria-labelledby="work-title" data-annot="section · selected work">
      <SectionLabel index="02" label="Selected work" />
      <div className="mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-end md:justify-between">
        <h2 id="work-title" className="display text-[clamp(2.8rem,7vw,7.5rem)]" data-split="chars">
          The work
        </h2>
        <div className="flex flex-col items-start gap-4 md:items-end md:pb-4">
          {anyPlaceholder && (
            <p className="eyebrow max-w-[36ch] text-muted md:text-right" data-reveal="fade">
              Sample projects shown. Real case studies replace these before launch.
            </p>
          )}
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
function MenuColumn({
  data,
  dark,
}: {
  data: (typeof capabilities)["frontOfHouse"] | (typeof capabilities)["backOfHouse"];
  dark?: boolean;
}) {
  return (
    <div className={`cap-col relative px-6 py-10 md:px-10 md:py-14 ${dark ? "cap-dark" : "bg-surface"}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="display text-[clamp(2rem,3vw,3rem)]">
          {data.label}
        </h3>
        <span className="eyebrow opacity-70">{data.sub}</span>
      </div>
      <ul className="mt-10">
        {data.items.map((item, i) => (
          <li key={item.name} className="cap-row">
            <span className="eyebrow w-7 shrink-0 text-accent">{String(i + 1).padStart(2, "0")}</span>
            <span className="cap-name text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium">{item.name}</span>
            <span className="leader hidden sm:block" aria-hidden="true" />
            <span className="cap-note text-[15px] opacity-75 sm:text-right">{item.note}</span>
            <span className="row-arrow hidden sm:inline-block" aria-hidden="true">→</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Capabilities() {
  return (
    <section className="px-page relative pb-28 md:pb-40" aria-labelledby="cap-title" data-annot="section · capabilities">
      <SectionLabel index="03" label="Capabilities" />
      <div className="mt-10 grid grid-cols-12 gap-x-6 md:mt-14">
        <h2 id="cap-title" className="display col-span-12 text-[clamp(2.6rem,6vw,6.4rem)] md:col-span-8" data-split="lines">
          What we <em className="text-accent">build.</em>
        </h2>
        <p className="body-lg col-span-12 mt-6 max-w-[40ch] md:col-span-4 md:mt-0 md:self-end" data-split="lines">
          The website your customers see, and the systems your team uses behind it. Each project is scoped to what
          your business actually needs.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-1 border border-rule md:mt-20 lg:grid-cols-2" data-reveal="rise">
        <MenuColumn data={capabilities.frontOfHouse} />
        <MenuColumn data={capabilities.backOfHouse} dark />
      </div>
    </section>
  );
}

/* ── (04) Approach ─────────────────────────────────────────── */
export function Approach({ index = "04" }: { index?: string }) {
  return (
    <section className="px-page relative pb-28 md:pb-40" aria-labelledby="app-title" data-annot="section · approach">
      <SectionLabel index={index} label="Approach" />
      <ApproachRail />
    </section>
  );
}

/* ── (05) Standards + integrations (credibility without invented claims) ── */
export function Standards() {
  const doubled = [...integrations, ...integrations];
  return (
    <section className="relative pb-28 md:pb-40" aria-labelledby="std-title" data-annot="section · standards">
      <div className="px-page">
        <SectionLabel index="05" label="What to expect" />
        <div className="mt-10 grid grid-cols-12 gap-x-6 md:mt-14">
          <h2 id="std-title" className="display col-span-12 text-[clamp(2.6rem,5.6vw,6rem)] md:col-span-7" data-split="lines">
            What you can <em className="text-accent">expect.</em>
          </h2>
          <p className="body-lg col-span-12 mt-6 max-w-[38ch] md:col-span-4 md:col-start-9 md:mt-0 md:self-end" data-split="lines">
            How every project runs. Clear scope, honest updates, and no promises about results we don’t control.
          </p>
        </div>

        <dl className="mt-14 grid grid-cols-1 border-t border-rule sm:grid-cols-2 md:mt-20 lg:grid-cols-3" data-reveal="stagger">
          {standards.map((s, i) => (
            <div key={s.k} className="std-cell border-b border-rule py-8 sm:pr-8">
              <dt className="flex items-center gap-3">
                <span className="eyebrow text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="eyebrow">{s.k}</span>
              </dt>
              <dd className="mt-4 text-[clamp(1.4rem,2vw,1.9rem)] font-medium leading-[1.15] tracking-[-0.025em]">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-20 md:mt-28" aria-labelledby="int-title">
        <p id="int-title" className="eyebrow px-page text-muted" data-reveal="scramble">
          What we build with
        </p>
        <div className="marquee mt-6" aria-hidden="true">
          <div className="marquee-track">
            {doubled.map((name, i) => (
              <span key={i} className="flex items-center whitespace-nowrap font-display text-[clamp(2rem,4vw,3.6rem)] font-bold italic leading-none tracking-[-0.04em]">
                <span className="px-6 md:px-10">{name}</span>
                <span className="text-[0.4em] not-italic text-accent">✳</span>
              </span>
            ))}
          </div>
        </div>
        <ul className="sr-only">
          {integrations.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
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
            A new website, an online shop, a booking or ordering system, or a tool to replace a manual process. Tell us
            what you need. {site.responseTime}
          </p>
          <div className="col-span-12 flex flex-col items-start gap-6 md:col-span-6 md:col-start-7" data-reveal="rise" data-delay="120">
            <a href={`mailto:${site.email}`} className="cta-email font-display text-[clamp(1.5rem,3vw,3rem)] font-bold leading-tight tracking-[-0.035em]">
              {site.email}
            </a>
            <div className="flex flex-wrap gap-3">
              <TLink href="/contact" className="btn btn-invert">
                Start a project <span className="btn-arrow">→</span>
              </TLink>
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
