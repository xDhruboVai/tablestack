import ToolList from "@/components/ui/ToolList";
import TLink from "@/components/layout/TLink";
import GlowLink from "@/components/ui/GlowLink";
import ProjectCover from "@/components/work/ProjectCover";
import { BrowserBar, siteHost } from "@/components/work/Shot";
import ExpectList from "./ExpectList";
import SiteFan from "./SiteFan";
import ApproachAssemble from "./ApproachAssemble";
import type { Project } from "@/content/projects";
import { bookCall, site, testimonials } from "@/content/site";

/* ── (02) Selected work ────────────────────────────────────── */
export function SelectedWork({ projects }: { projects: Project[] }) {
  // Each site as a browser window, drawn here so the turning row itself stays small.
  const fan = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    kind: p.kind,
    concept: !!p.concept,
    window: (
      <div className="shot-win">
        <BrowserBar host={siteHost(p)} />
        <div className="shot-view cover-host aspect-[16/10]">
          <ProjectCover project={p} decorative eager sizes="(min-width: 768px) 32vw, 66vw" />
        </div>
      </div>
    ),
  }));
  return (
    <section className="px-page relative pb-20 md:pb-24" aria-labelledby="work-title" data-annot="section · selected work">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 id="work-title" className="display text-[clamp(2.8rem,5.46vw,5.85rem)]" data-split="chars">
          {projects.length === 2 ? "Two sites you can" : "Sites you can"} <em className="text-accent">open and use.</em>
        </h2>
        <TLink href="/work" className="btn btn-ghost md:mb-4" data-reveal="rise">
          All projects ({projects.length}) <span className="btn-arrow">→</span>
        </TLink>
      </div>
      {/* Every site in a turning row. The big "Work." word that sat above it is set aside for now: WorkStage.tsx draws both together. */}
      <SiteFan items={fan} />
    </section>
  );
}

/* ── (03) Capabilities ─────────────────────────────────────── */
const services = [
  {
    type: "web",
    title: "Websites",
    body: "Clear pages built for phones, with content and language options that fit your business.",
  },
  {
    type: "flow",
    title: "Menus, forms & bookings",
    body: "Enquiries, booking requests and pre-orders designed around what customers and staff actually do.",
  },
  {
    type: "tools",
    title: "Tools behind the site",
    body: "Editable content, admin screens, databases or automation when the project needs them.",
  },
] as const;

function ServiceVisual({ type }: { type: (typeof services)[number]["type"] }) {
  return (
    <div className={`service-visual service-visual-${type}`} aria-hidden="true">
      {type === "web" && <><span className="visual-browser-bar" /><span className="visual-web-title" /><span className="visual-web-copy" /><span className="visual-web-button" /></>}
      {type === "flow" && <><span className="visual-flow-step"><i /></span><span className="visual-flow-connector" /><span className="visual-flow-step"><i /><i /></span><span className="visual-flow-connector" /><span className="visual-flow-step">✓</span></>}
      {type === "tools" && <><span className="visual-tool-card visual-tool-card-back" /><span className="visual-tool-card visual-tool-card-front"><i /><i /><i /></span><span className="visual-tool-dot" /></>}
    </div>
  );
}

export function Capabilities() {
  return (
    <section id="services" className="px-page relative scroll-mt-[var(--nav-h)] pb-20 md:pb-24" aria-labelledby="cap-title" data-annot="section · capabilities">
      <div className="grid grid-cols-12 gap-x-6">
        <h2 id="cap-title" className="display col-span-12 text-[clamp(2.6rem,4.68vw,4.99rem)] md:col-span-8" data-split="lines">
          Start with the <em className="text-accent">actual need.</em>
        </h2>
        <p className="body-lg col-span-12 mt-6 max-w-[40ch] md:col-span-4 md:mt-0 md:self-end" data-split="lines">
          Websites first, with the right tools behind them.
        </p>
      </div>
      <div className="service-panel-grid mt-14 md:mt-16" data-reveal="rise">
        {services.map((service) => (
          <article className={`service-panel service-panel-${service.type}`} key={service.title}>
            <ServiceVisual type={service.type} />
            <div className="service-panel-copy">
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── (04) Approach ─────────────────────────────────────────── */
export function Approach() {
  return (
    <section className="px-page relative pb-20 md:pb-24" aria-labelledby="app-title" data-annot="section · approach">
      <ApproachAssemble />
    </section>
  );
}

/* ── (05) Standards + integrations (credibility without invented claims) ── */
export function Standards() {
  return (
    <section className="relative pb-20 md:pb-24" aria-labelledby="std-title" data-annot="section · standards">
      <div className="px-page">
        <ExpectList>
          <h2 id="std-title" className="expect-title display" data-split="lines">
            What you can <em className="text-accent">expect.</em>
          </h2>
        </ExpectList>
      </div>

      <div className="mt-20 md:mt-24" aria-labelledby="int-title">
        <h2 id="int-title" className="px-page text-center font-display text-[clamp(1.5rem,1.56vw,1.56rem)] font-semibold" data-reveal="fade">
          What we build with
        </h2>
        <ToolList className="mt-8 md:mt-10" />
      </div>

      {testimonials.length > 0 && (
        <div className="px-page mt-24 grid gap-10 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure key={t.name} data-reveal="rise">
              <blockquote className="display text-[clamp(1.6rem,1.87vw,1.87rem)] leading-[1.1]">“{t.quote}”</blockquote>
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
      <div className="px-page py-24 md:py-32">
        <p className="eyebrow flex items-center gap-3 opacity-80" data-reveal="scramble">
          <span className="live-dot" aria-hidden="true" /> {site.availability}
        </p>
        <h2 id="cta-title" className="display mt-8 text-[clamp(2.6rem,6.24vw,6.86rem)]" data-split="chars">
          Tell us about <em className="text-accent">your business.</em>
        </h2>
        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-16">
          <p className="col-span-12 max-w-[42ch] text-[clamp(1.05rem,1.3vw,1.3rem)] leading-[1.5] opacity-80 md:col-span-5" data-reveal="rise">
            Tell us what you need. {site.responseTime}
          </p>
          <div className="col-span-12 flex flex-col items-start gap-6 md:col-span-6 md:col-start-7" data-reveal="rise" data-delay="120">
            <a href={`mailto:${site.email}`} className="cta-email font-display text-[clamp(1.5rem,2.34vw,2.34rem)] font-bold leading-tight tracking-[-0.035em]">
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
