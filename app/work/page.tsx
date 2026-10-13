import { pageMeta } from "@/lib/seo";
import { site } from "@/content/site";
import ProjectTile from "@/components/work/ProjectTile";
import ProjectMontage from "@/components/work/ProjectMontage";
import { notFound } from "next/navigation";
import { getVisibleProjects } from "@/lib/visibility";
import { ContactCTA } from "@/components/home/Sections";

export const metadata = pageMeta({
  title: "Work",
  description: `Websites ${site.name} is building for businesses in Bangladesh, each with a short write-up and a link to open the site.`,
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getVisibleProjects();
  // No projects switched on: the Work page doesn't exist.
  if (projects.length === 0) notFound();
  return (
    <>
      <section className="px-page pb-24 pt-[calc(var(--nav-h)+8svh)] md:pb-28" aria-labelledby="work-h" data-annot="page · /work">
        <div className={`work-page-intro ${projects.length < 2 ? "work-page-intro-single" : ""}`}>
          <div>
            <h1 id="work-h" className="display text-[clamp(4rem,8.58vw,8.58rem)]" data-split="chars">
              Work<em className="work-title-dot text-accent">.</em>
            </h1>
            <p className="body-lg mt-8 max-w-[39ch]" data-split="lines">
              Our ongoing works so far. Open each project to see the pages and features for yourself.
            </p>
          </div>
          <ProjectMontage projects={projects} />
        </div>
        <div className={`project-tile-grid mt-16 md:mt-20 ${projects.length === 1 ? "project-tile-grid-single" : ""}`} data-reveal="rise">
          {projects.map((project) => <ProjectTile project={project} headingLevel={2} key={project.slug} />)}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
