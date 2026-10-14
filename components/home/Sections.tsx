import ToolList from "@/components/ui/ToolList";
import TLink from "@/components/layout/TLink";
import GlowLink from "@/components/ui/GlowLink";
import ProjectCover from "@/components/work/ProjectCover";
import { BrowserBar, siteHost } from "@/components/work/Shot";
import { CapAdmin, CapForm, CapPhone } from "./CapScreens";
import SiteShowcase from "./SiteShowcase";
import ApproachAssemble from "./ApproachAssemble";
import type { Project } from "@/content/projects";
import { bookCall, site, testimonials } from "@/content/site";

/* ── (02) Selected work ────────────────────────────────────── */
export function SelectedWork({ projects }: { projects: Project[] }) {
  // Each site as a big browser window and as a small thumbnail, drawn here so the switching part stays small.
  const items = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    concept: !!p.concept,
    liveUrl: p.liveUrl,
    window: (
      <div className="shot-win">
        <BrowserBar host={siteHost(p)} />
        <div className="shot-view cover-host aspect-[16/10]">
          <ProjectCover project={p} decorative sizes="(min-width: 1024px) 62vw, 100vw" />
        </div>
      </div>
    ),
    thumb: (
      <span className="cover-host relative block aspect-[16/10] overflow-hidden">
        <ProjectCover project={p} decorative sizes="(min-width: 1024px) 10vw, 30vw" />
      </span>
    ),
  }));
  return (
    <section className="px-page relative pb-20 md:pb-24" aria-labelledby="work-title" data-annot="section · selected work">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 id="work-title" className="display text-[clamp(2.2rem,3.1vw,3.6rem)]" data-split="chars">
          {projects.length === 2 ? "Two sites you can" : "Sites you can"} <em className="text-accent">open and use.</em>
        </h2>
        <TLink href="/work" className="btn btn-ghost md:mb-4" data-reveal="rise">
          All projects ({projects.length}) <span className="btn-arrow">→</span>
        </TLink>
      </div>
      {/* One site big, the rest as thumbnails to switch between. */}
      <SiteShowcase items={items} />
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

const screens = { web: CapPhone, flow: CapForm, tools: CapAdmin } as const;

export function Capabilities() {
  return (
    <section id="services" className="px-page relative scroll-mt-[var(--nav-h)] pb-20 md:pb-24" aria-labelledby="cap-title" data-annot="section · capabilities">
      <div className="grid grid-cols-12 gap-x-6">
        <h2 id="cap-title" className="display col-span-12 text-[clamp(2.2rem,3.1vw,3.6rem)] md:col-span-8" data-split="lines">
          Start with the <em className="text-accent">actual need.</em>
        </h2>
        <p className="body-lg col-span-12 mt-6 max-w-[40ch] md:col-span-4 md:mt-0 md:self-end" data-split="lines">
          Websites first, with the right tools behind them.
        </p>
      </div>
      {/* Black, red and yellow cards, each with its screen breaking out of the top edge. */}
      <div className="cap-grid" data-reveal="rise">
        {services.map((service) => {
          const Screen = screens[service.type];
          return (
            <article className={`cap-card cap-card-${service.type}`} key={service.title}>
              <Screen />
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          );
        })}
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
    <section className="relative pb-20 md:pb-24" aria-labelledby="int-title" data-annot="section · standards">
      <div>
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
        <h2 id="cta-title" className="display mt-8 text-[clamp(2.4rem,4.4vw,4.75rem)]" data-split="chars">
          Tell us about <em className="text-accent">your business.</em>
        </h2>
        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-16">
          <p className="col-span-12 max-w-[42ch] text-[clamp(1.05rem,1.3vw,1.3rem)] leading-[1.5] opacity-80 md:col-span-5" data-reveal="rise">
            Tell us what you need. {site.responseTime}
          </p>
          <div className="col-span-12 flex flex-col items-start gap-6 md:col-span-6 md:col-start-7" data-reveal="rise" data-delay="120">
            <a href={`mailto:${site.email}`} className="cta-email font-display text-[clamp(1.35rem,1.8vw,1.9rem)] font-bold leading-tight tracking-[-0.035em]">
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
