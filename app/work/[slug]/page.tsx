import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import TLink from "@/components/layout/TLink";
import LensMedia from "@/components/work/LensMedia";
import ProjectMock from "@/components/work/ProjectMock";
import NextProject from "@/components/work/NextProject";
import { getNextProject, getProject, projects } from "@/content/projects";
import { ContactCTA } from "@/components/home/Sections";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} · ${p.kind}`,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title: `${p.title} · ${p.kind}`,
      description: p.summary,
      url: `/work/${p.slug}`,
      ...(p.media?.cover ? { images: [{ url: p.media.cover, alt: p.media.coverAlt ?? p.title }] } : {}),
    },
  };
}

function Chapter({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 border-t border-rule py-12 md:py-20" data-annot={`section · ${label.toLowerCase()}`}>
      <div className="col-span-12 mb-6 md:col-span-4 md:mb-0">
        <div className="md:sticky md:top-[calc(var(--nav-h)+32px)]">
          <p className="eyebrow text-accent" data-reveal="scramble">
            {n}
          </p>
          <h2 className="display mt-3 text-[clamp(2rem,3vw,3rem)] italic" data-split="lines">
            {label}
          </h2>
        </div>
      </div>
      <div className="col-span-12 md:col-span-7 md:col-start-6">{children}</div>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = getNextProject(p.slug);
  const n = projects.indexOf(p) + 1;

  const meta: [string, React.ReactNode][] = [
    ["Client", p.client],
    ["Type", p.kind],
    ["Services", p.services.join(", ")],
    ["Stack", p.stack.join(" · ")],
    ["Year", p.year],
    [
      "Live site",
      p.liveUrl ? (
        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="link-draw">
          Visit ↗
        </a>
      ) : (
        "Link added at launch"
      ),
    ],
  ];

  return (
    <>
      <article>
        <header className="px-page pt-[calc(var(--nav-h)+7svh)]" data-annot={`page · /work/${p.slug}`}>
          <div className="flex items-center justify-between gap-4">
            <TLink href="/work" className="eyebrow link-draw">
              ← All work
            </TLink>
            <span className="eyebrow text-muted" data-reveal="scramble">
              {String(n).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          {p.placeholder && (
            <p className="eyebrow mt-8 inline-flex items-center gap-2 border border-dashed border-accent px-3 py-2 text-accent" data-reveal="fade">
              Placeholder case study: sample structure and copy. Replace in content/projects.ts
            </p>
          )}

          <p className="eyebrow mt-10 text-muted" data-reveal="scramble">
            {p.kind} · {p.location}
          </p>
          <h1 className="display mt-4 text-[clamp(3.4rem,12vw,12rem)]" data-split="chars">
            {p.title}
          </h1>
          <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-10">
            <p className="col-span-12 text-[clamp(1.4rem,2.3vw,2.2rem)] font-medium leading-[1.15] tracking-[-0.025em] md:col-span-7" data-split="lines">
              {p.summary}
            </p>
            <dl className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-5 md:col-span-4 md:col-start-9" data-reveal="stagger">
              {meta.map(([k, v]) => (
                <div key={k} className="border-t border-rule pt-3">
                  <dt className="eyebrow text-muted">{k}</dt>
                  <dd className="mt-1 text-[15px] leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <div className="px-page mt-16 md:mt-24">
          <div className="media-fit group">
            <LensMedia project={p} aspect="aspect-[16/10]" priority hoverScale={false} sizes="(min-width: 1280px) 80vw, 100vw" />
            <p className="eyebrow mt-3 text-muted">Move over the image to see how it’s built.</p>
          </div>
        </div>

        <div className="px-page mt-20 md:mt-32">
          <Chapter n="01" label="Challenge">
            <p className="body-lg !text-[clamp(1.2rem,1.7vw,1.6rem)] !leading-[1.45]" data-split="lines">
              {p.challenge}
            </p>
          </Chapter>
          <Chapter n="02" label="Approach">
            <p className="body-lg !text-[clamp(1.2rem,1.7vw,1.6rem)] !leading-[1.45]" data-split="lines">
              {p.approach}
            </p>
          </Chapter>
          <Chapter n="03" label="Execution">
            <ul data-reveal="stagger">
              {p.execution.map((e, i) => (
                <li key={e} className="flex items-baseline gap-5 border-b border-rule py-5 text-[clamp(1.05rem,1.4vw,1.3rem)]">
                  <span className="eyebrow w-6 shrink-0 text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {e}
                </li>
              ))}
            </ul>
          </Chapter>
          <Chapter n="04" label="Outcome">
            <p className="body-lg !text-[clamp(1.2rem,1.7vw,1.6rem)] !leading-[1.45]" data-split="lines">
              {p.outcome}
            </p>
          </Chapter>
        </div>

        <section className="px-page pb-10 pt-16 md:pt-24" aria-labelledby="gallery-h">
          <div className="flex items-end justify-between gap-6 border-t border-rule pt-10">
            <h2 id="gallery-h" className="display text-[clamp(2.2rem,4vw,4rem)]" data-split="lines">
              Gallery
            </h2>
            <p className="eyebrow text-muted" data-reveal="fade">
              {p.gallery.length} frames
            </p>
          </div>
          <div className="media-fit mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {p.gallery.map((g, i) => (
              <figure key={i} className={g.wide ? "md:col-span-2" : ""}>
                <div
                  className={`relative overflow-hidden bg-surface ${g.wide ? "aspect-[16/10]" : "aspect-square"}`}
                  data-reveal="mask"
                  data-annot={`<Frame kind="${g.frame}" />`}
                >
                  <div data-mask-inner className="absolute inset-0">
                    {g.src ? (
                      <Image src={g.src} alt={g.alt} fill sizes={g.wide ? "(min-width: 1280px) 80vw, 100vw" : "(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"} className="object-cover" />
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
                <figcaption className="eyebrow mt-3 flex justify-between gap-4 text-muted">
                  <span>{g.caption}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </article>

      <NextProject project={next} />
      <ContactCTA />
    </>
  );
}
