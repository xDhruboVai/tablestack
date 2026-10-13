import type { Metadata } from "next";
import { cookies } from "next/headers";
import WorkToggles from "@/components/admin/WorkToggles";
import { projects } from "@/content/projects";
import { ADMIN_COOKIE, adminLoginReady, cookieIsValid, getHiddenSlugs, storageReady } from "@/lib/visibility";

export const metadata: Metadata = {
  title: "Work switches",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

export default async function WorkAdminPage() {
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
