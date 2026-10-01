import HeroAnatomy from "@/components/home/HeroAnatomy";
import { Approach, Capabilities, ContactCTA, Positioning, SelectedWork, Standards } from "@/components/home/Sections";
import { site } from "@/content/site";

export default function Home() {
  // Structured data for search engines: the business (Organization) and the site (WebSite), linked by stable ids.
  // Only facts the owner has confirmed: no street address, ratings, clients or founding date.
  const sameAs = site.social.map((l) => l.href).filter((h) => h.includes("facebook.com"));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        alternateName: site.altNames,
        url: site.url,
        logo: { "@type": "ImageObject", url: `${site.url}/logo.png`, width: 512, height: 512 },
        image: `${site.url}/opengraph-image`,
        description: site.seoDescription,
        email: site.email,
        telephone: site.phoneIntl,
        address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "BD" },
        areaServed: { "@type": "Country", name: "Bangladesh" },
        sameAs,
        knowsAbout: ["Web development", "Web application development", "UI/UX design", "E-commerce websites", "Business software", "Database design", "AI tools", "Workflow automation"],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        alternateName: site.altNames,
        url: `${site.url}/`,
        inLanguage: "en",
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
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
