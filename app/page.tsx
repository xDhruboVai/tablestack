import type { Metadata } from "next";
import HeroAnatomy from "@/components/home/HeroAnatomy";
import { Approach, Capabilities, ContactCTA, SelectedWork, Standards } from "@/components/home/Sections";
import { site } from "@/content/site";
import { jsonLdText } from "@/lib/seo";
import { getVisibleProjects } from "@/lib/visibility";

// The home page is the canonical address for "/". Other pages set their own; the admin and not-found pages set none.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const visible = await getVisibleProjects();
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
        knowsAbout: ["Website design", "Web development", "Bilingual websites", "Online menus", "Booking flows", "Database-backed websites"],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(jsonLd) }} />
      <HeroAnatomy showWork={visible.length > 0} />
      {visible.length > 0 && <SelectedWork projects={visible} />}
      <Capabilities />
      <Approach />
      <Standards />
      <ContactCTA />
    </>
  );
}
