import type { Metadata } from "next";
import { cookies } from "next/headers";
import WorkToggles from "@/components/admin/WorkToggles";
import { projects } from "@/content/projects";
import { ADMIN_COOKIE, cookieIsValid, getHiddenSlugs, pinReady, storageReady } from "@/lib/visibility";

// Hidden page: not linked anywhere, not in the sitemap, and kept out of search engines.
export const metadata: Metadata = {
  title: "Work switches",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

export default async function WorkAdminPage() {
  const unlocked = cookieIsValid((await cookies()).get(ADMIN_COOKIE)?.value);
  const hidden = unlocked ? await getHiddenSlugs(true) : new Set<string>();

  return (
    <section className="px-page pb-24 pt-[calc(var(--nav-h)+8svh)]" aria-labelledby="wa-h">
      <p className="eyebrow text-muted">Team only</p>
      <h1 id="wa-h" className="display mt-4 text-[clamp(2.4rem,6vw,5.5rem)]">
        Work <em className="text-accent">switches.</em>
      </h1>
      <p className="body-lg mt-6 max-w-[52ch]">
        Turn a project off and it disappears from the site, including its own page. Turn every project off and the Work page and its links
        disappear too.
      </p>
      {/* The key remounts the switches after unlocking, so they start from the saved state. */}
      <WorkToggles
        key={unlocked ? "open" : "locked"}
        unlocked={unlocked}
        pinReady={pinReady}
        storageReady={storageReady}
        items={unlocked ? projects.map((p) => ({ slug: p.slug, title: p.title, kind: p.kind, visible: !hidden.has(p.slug) })) : []}
      />
    </section>
  );
}
