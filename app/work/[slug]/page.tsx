import type { Metadata } from "next";
import { site } from "@/content/site";
import { notFound } from "next/navigation";
import TLink from "@/components/layout/TLink";
import LensMedia from "@/components/work/LensMedia";
import ProjectMock from "@/components/work/ProjectMock";
import Shot, { BrowserBar, darkSite, lookFor, siteHost } from "@/components/work/Shot";
import NextProject from "@/components/work/NextProject";
import { getProject, projects } from "@/content/projects";
import { getVisibleProjects } from "@/lib/visibility";
import { ContactCTA } from "@/components/home/Sections";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || !(await getVisibleProjects()).some((v) => v.slug === slug)) return {};
  const title = p.concept ? `${p.title} (concept) · ${p.kind}` : `${p.title} · ${p.kind}`;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      siteName: site.name,
      title,
      description: p.summary,
      url: `/work/${p.slug}`,
      images: [p.media?.cover ? { url: p.media.cover, alt: p.media.coverAlt ?? p.title } : { url: "/opengraph-image" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: p.summary,
      images: [p.media?.cover ?? "/opengraph-image"],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  const visible = await getVisibleProjects();
  // A project that is switched off has no page.
  if (!p || !visible.some((v) => v.slug === slug)) notFound();
  // "Next project" cycles through the visible ones, and is left out when this is the only one.
  const next = visible.length > 1 ? visible[(visible.findIndex((v) => v.slug === slug) + 1) % visible.length] : null;

  return (
    <>
      <article>
        {/* Wide screens: name, one plain sentence and the live link on the left; the site itself on the right. */}
        <header className="px-page pt-[calc(var(--nav-h)+6svh)]" data-annot={`page · /work/${p.slug}`}>
          <TLink href="/work" className="eyebrow link-draw tap-pad">
            ← All work
          </TLink>

          {p.placeholder && (
            <p className="eyebrow mt-8 inline-flex items-center gap-2 border border-dashed border-accent px-3 py-2 text-accent" data-reveal="fade">
              Placeholder case study: sample structure and copy. Replace in content/projects.ts
            </p>
          )}

          <div className="mt-8 grid grid-cols-12 items-center gap-x-6 gap-y-10 md:mt-10">
            <div className="col-span-12 lg:col-span-5">
              {p.concept && <p className="concept-tag mb-5">Concept</p>}
              <h1 className="display text-[clamp(2.8rem,4.06vw,4.21rem)]" data-split="chars">
                {p.title}
              </h1>
              <p className="mt-6 max-w-[40ch] text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.35] tracking-[-0.015em] text-fg-2" data-split="lines">
                {p.summary}
              </p>
              {p.liveUrl && (
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3" data-reveal="rise">
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                    {p.concept ? "Open the concept site" : "Visit the live site"} <span className="btn-arrow">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <span className="text-[15px] text-muted">{new URL(p.liveUrl).host}</span>
                </div>
              )}
              {p.concept && (
                <p className="concept-note mt-8" data-reveal="fade">
                  We designed and built this on our own initiative, to show what we would make for {p.title}. The restaurant did not commission it, and
                  it is not their official website.
                </p>
              )}
            </div>

            <div className="group col-span-12 lg:col-span-7">
              <div className="shot-hero" data-reveal="fade">
                <BrowserBar host={siteHost(p)} light={!darkSite(p)} />
                <LensMedia project={p} aspect="aspect-[16/10]" priority hoverScale={false} sizes="(min-width: 1024px) 58vw, 100vw" />
              </div>
              <p className="hint-pointer eyebrow mt-3 text-muted">Move your cursor over the image.</p>
            </div>
          </div>
        </header>

        {/* The heading sits in a left rail on wide screens, so the screenshots stay a comfortable size. */}
        <section className="px-page grid grid-cols-12 gap-x-6 gap-y-8 pt-16 md:pt-20" aria-labelledby="gallery-h">
          <div className="col-span-12 lg:col-span-3">
            <h2 id="gallery-h" className="display text-[clamp(2rem,2.65vw,2.65rem)] lg:sticky lg:top-[calc(var(--nav-h)+32px)]" data-split="lines">
              A closer look
            </h2>
          </div>
          <div className="col-span-12 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:col-span-9">
            {p.gallery.map((g, i) => (
              <figure key={i} className={g.wide ? "md:col-span-2" : ""}>
                {g.src ? (
                  <Shot
                    project={p}
                    src={g.src}
                    alt={g.alt}
                    wide={g.wide}
                    // One look for the whole page. Phone pictures always stand on their own.
                    look={g.frame === "mobile" ? "plain" : lookFor(p)}
                    behind={p.gallery.find((o) => o.frame === "menu")?.src ?? p.media?.cover}
                  />
                ) : (
                  <div
                    className={`relative overflow-hidden bg-surface ${g.wide ? "aspect-[16/10]" : "aspect-square"}`}
                    data-reveal="mask"
                    data-annot={`<Frame kind="${g.frame}" />`}
                  >
                    <div data-mask-inner className="absolute inset-0">
                      <ProjectMock project={p} frame={g.frame} slice title={`${g.alt} (placeholder artwork)`} />
                    </div>
                    <span className="eyebrow absolute bottom-3 left-3 max-w-[calc(100%-24px)] bg-[var(--bg)] px-2 py-1 !text-[13px] text-fg">
                      Replace: {g.spec}
                    </span>
                  </div>
                )}
                <figcaption className="eyebrow mt-3 text-muted">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* What the client needed, and what a visitor can now do on the site. */}
        <section className="px-page grid grid-cols-12 gap-x-6 gap-y-12 py-16 md:py-24" data-annot="section · brief + built">
          <div className="col-span-12 md:col-span-5">
            <h2 className="display text-[clamp(2rem,2.65vw,2.65rem)]" data-split="lines">
              {p.concept ? "The idea" : "The brief"}
            </h2>
            <p className="mt-6 max-w-[44ch] text-[clamp(1.1rem,1.4vw,1.35rem)] leading-[1.5] text-fg-2" data-split="lines">
              {p.challenge}
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <h2 className="display text-[clamp(2rem,2.65vw,2.65rem)]" data-split="lines">
              What we built
            </h2>
            <ul className="mt-6 border-t border-rule" data-reveal="stagger">
              {p.execution.map((e) => (
                <li key={e} className="flex items-baseline gap-4 border-b border-rule py-4 text-[clamp(1.05rem,1.3vw,1.25rem)]">
                  <span className="list-bar" aria-hidden="true" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>

      {next && <NextProject project={next} />}
      <ContactCTA />
    </>
  );
}
