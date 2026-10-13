import type { Metadata } from "next";
import { site } from "@/content/site";
import Image from "next/image";
import { notFound } from "next/navigation";
import TLink from "@/components/layout/TLink";
import LensMedia from "@/components/work/LensMedia";
import ProjectMock from "@/components/work/ProjectMock";
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
  return {
    title: `${p.title} · ${p.kind}`,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: `${p.title} · ${p.kind}`,
      description: p.summary,
      url: `/work/${p.slug}`,
      images: [p.media?.cover ? { url: p.media.cover, alt: p.media.coverAlt ?? p.title } : { url: "/opengraph-image" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} · ${p.kind}`,
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

  const facts: [string, string][] = [
    ["Business", p.kind],
    ["Location", p.location],
    ["Year", p.year],
  ];

  return (
    <>
      <article>
        {/* Wide screens: name, one plain sentence, the live link and three facts on the left; the site itself on the right. */}
        <header className="px-page pt-[calc(var(--nav-h)+6svh)]" data-annot={`page · /work/${p.slug}`}>
          <TLink href="/work" className="eyebrow link-draw">
            ← All work
          </TLink>

          {p.placeholder && (
            <p className="eyebrow mt-8 inline-flex items-center gap-2 border border-dashed border-accent px-3 py-2 text-accent" data-reveal="fade">
              Placeholder case study: sample structure and copy. Replace in content/projects.ts
            </p>
          )}

          <div className="mt-8 grid grid-cols-12 items-center gap-x-6 gap-y-10 md:mt-10">
            <div className="col-span-12 lg:col-span-5">
              <h1 className="display text-[clamp(2.8rem,4.06vw,4.21rem)]" data-split="chars">
                {p.title}
              </h1>
              <p className="mt-6 max-w-[40ch] text-[clamp(1.15rem,1.5vw,1.45rem)] leading-[1.35] tracking-[-0.015em] text-fg-2" data-split="lines">
                {p.summary}
              </p>
              {p.liveUrl && (
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3" data-reveal="rise">
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Visit the live site <span className="btn-arrow">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <span className="text-[15px] text-muted">{new URL(p.liveUrl).host}</span>
                </div>
              )}
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5" data-reveal="fade">
                {facts.map(([k, v]) => (
                  <div key={k} className="max-w-[22ch]">
                    <dt className="eyebrow text-muted">{k}</dt>
                    <dd className="mt-1 leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="group col-span-12 lg:col-span-7">
              <LensMedia project={p} aspect="aspect-[16/10]" priority hoverScale={false} sizes="(min-width: 1024px) 58vw, 100vw" />
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
          <div className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-9">
            {p.gallery.map((g, i) => (
              <figure key={i} className={g.wide ? "md:col-span-2" : ""}>
                <div
                  className={`relative overflow-hidden bg-surface ${g.wide ? "aspect-[16/10]" : "aspect-square"}`}
                  data-reveal="mask"
                  data-annot={`<Frame kind="${g.frame}" />`}
                >
                  <div data-mask-inner className="absolute inset-0">
                    {g.src ? (
                      <Image src={g.src} alt={g.alt} fill sizes={g.wide ? "(min-width: 1024px) 75vw, 100vw" : "(min-width: 1024px) 37vw, (min-width: 768px) 50vw, 100vw"} className="object-cover" />
                    ) : (
                      <ProjectMock project={p} frame={g.frame} slice title={`${g.alt} (placeholder artwork)`} />
                    )}
                  </div>
                  {!g.src && (
                    <span className="eyebrow absolute bottom-3 left-3 max-w-[calc(100%-24px)] bg-[var(--bg)] px-2 py-1 !text-[13px] text-fg">
                      Replace: {g.spec}
                    </span>
                  )}
                </div>
                <figcaption className="eyebrow mt-3 text-muted">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* What the client needed, and what a visitor can now do on the site. */}
        <section className="px-page grid grid-cols-12 gap-x-6 gap-y-12 py-16 md:py-24" data-annot="section · brief + built">
          <div className="col-span-12 md:col-span-5">
            <h2 className="display text-[clamp(2rem,2.65vw,2.65rem)]" data-split="lines">
              The brief
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
