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
    knowsAbout: ["Business websites", "E-commerce", "Restaurant websites", "Web development", "Online reservations", "Online ordering", "Management dashboards"],
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
