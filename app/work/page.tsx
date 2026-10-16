import { pageMeta } from "@/lib/seo";
import { site } from "@/content/site";
import ProjectTile from "@/components/work/ProjectTile";
import WorkWall from "@/components/work/WorkWall";
import { notFound } from "next/navigation";
import { getVisibleProjects } from "@/lib/visibility";
import { ContactCTA } from "@/components/home/Sections";

export const metadata = pageMeta({
  title: "Work",
  description: `Websites ${site.name} has designed and built in Dhaka, for clients and as concepts, each with a short write-up and a link to open the site.`,
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getVisibleProjects();
  // No projects switched on: the Work page doesn't exist.
  if (projects.length === 0) notFound();
  return (
    <>
      <section className="px-page pb-24 pt-[calc(var(--nav-h)+clamp(20px,4svh,44px))] md:pb-28" aria-labelledby="work-h" data-annot="page · /work">
        <WorkWall projects={projects}>
          <h1 id="work-h" className="display work-wall-title" data-split="chars">
            Work<em className="work-title-dot text-accent">.</em>
          </h1>
          <p className="body-lg work-wall-intro" data-split="lines">
            {projects.every((p) => p.concept)
              ? "Concept sites we designed and built on our own initiative for restaurants in Dhaka. Open each one to see the pages and features for yourself."
              : "Our work so far, including concept sites we designed on our own initiative. Open each one to see the pages and features for yourself."}
          </p>
        </WorkWall>
        {/* An odd number of projects: the first one runs the full width, so the last row is never half empty. */}
        <div
          className={`project-tile-grid mt-12 md:mt-14 ${projects.length === 1 ? "project-tile-grid-single" : projects.length % 2 ? "project-tile-grid-lead" : ""}`}
          data-reveal="rise"
        >
          {projects.map((project, i) => <ProjectTile project={project} headingLevel={2} eager={i < 2} key={project.slug} />)}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
