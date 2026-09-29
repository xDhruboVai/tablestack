import TLink from "@/components/layout/TLink";

export default function NotFound() {
  return (
    <section className="px-page flex min-h-[100svh] flex-col justify-center pb-20 pt-[calc(var(--nav-h)+6svh)]" aria-labelledby="nf-h">
      <p className="eyebrow text-accent">404 · Not on tonight’s menu</p>
      <h1 id="nf-h" className="display mt-6 text-[clamp(2.6rem,8vw,8rem)]">
        This page has been <em className="text-accent">86’d.</em>
      </h1>
      <p className="body-lg mt-8 max-w-[40ch]">
        It’s either moved or it never existed. The good stuff is still in the kitchen.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <TLink href="/" className="btn btn-primary">
          Back to the front <span className="btn-arrow">→</span>
        </TLink>
        <TLink href="/work" className="btn btn-ghost">
          See the work
        </TLink>
      </div>
    </section>
  );
}
