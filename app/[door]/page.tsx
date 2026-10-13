import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import WorkToggles from "@/components/admin/WorkToggles";
import { projects } from "@/content/projects";
import { ADMIN_COOKIE, ADMIN_PATH, adminLoginReady, cookieIsValid, getHiddenSlugs, storageReady } from "@/lib/visibility";

/**
 * The team page for switching projects on and off. Its address is not fixed in the code: it is whatever
 * WORK_ADMIN_PATH is set to (see .env.example). Any other one-word address lands here too and gets the
 * ordinary "page not found", so nothing shows that an admin page exists.
 */
type Params = Promise<{ door: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if ((await params).door !== ADMIN_PATH) return { title: "Page not found", robots: { index: false, follow: true } };
  return { title: "Work switches", robots: { index: false, follow: false, nocache: true } };
}

export default async function WorkAdminPage({ params }: { params: Params }) {
  if ((await params).door !== ADMIN_PATH) notFound();
  const unlocked = cookieIsValid((await cookies()).get(ADMIN_COOKIE)?.value);
  const hidden = unlocked ? await getHiddenSlugs(true) : new Set<string>();

  return (
    <section className="admin-page" aria-labelledby="wa-h">
      <h1 id="wa-h" className="sr-only">
        Work switches
      </h1>
      {/* Only the card: the sign-in box, or the list of switches once signed in. */}
      <div className={`contact-brief-card admin-card ${unlocked ? "admin-card-open" : ""}`}>
        <WorkToggles
          key={unlocked ? "open" : "locked"}
          unlocked={unlocked}
          loginReady={adminLoginReady}
          storageReady={storageReady}
          items={unlocked ? projects.map((p) => ({ slug: p.slug, title: p.title, kind: p.kind, concept: Boolean(p.concept), visible: !hidden.has(p.slug) })) : []}
        />
      </div>
    </section>
  );
}
