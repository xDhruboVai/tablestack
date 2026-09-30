import HeroAnatomy from "@/components/home/HeroAnatomy";
import { Approach, Capabilities, ContactCTA, Positioning, SelectedWork, Standards } from "@/components/home/Sections";
import { site } from "@/content/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    areaServed: "Bangladesh",
    knowsAbout: ["Web application development", "UI/UX design", "E-commerce", "Progressive web apps", "SEO", "Web accessibility", "Database engineering", "Data pipelines", "Enterprise software", "Mobile app development", "Cloud and DevOps", "API development", "AI agents", "Retrieval-augmented generation", "LLM integration"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroAnatomy />
      <Positioning />
      <SelectedWork />
      <Capabilities />
      <Approach />
      <Standards />
      <ContactCTA />
    </>
  );
}
