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
  // Structured data for search engines: the business (ProfessionalService / LocalBusiness) and the site (WebSite), linked by stable ids.
  const sameAs = site.social.map((l) => l.href).filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "Organization"],
        "@id": `${site.url}/#organization`,
        name: site.name,
        alternateName: site.altNames,
        url: site.url,
        logo: { "@type": "ImageObject", url: `${site.url}/logo.png`, width: 512, height: 512 },
        image: `${site.url}/opengraph-image`,
        description: site.seoDescription,
        email: site.email,
        telephone: site.phoneIntl,
        priceRange: "৳৳",
        currenciesAccepted: "BDT, USD",
        paymentAccepted: "Bank Transfer, bKash, Nagad, Cash",
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: "Dhaka Division",
          addressCountry: "BD",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "23.8103",
          longitude: "90.4125",
        },
        areaServed: [
          { "@type": "City", name: "Dhaka" },
          { "@type": "Country", name: "Bangladesh" },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
            opens: "10:00",
            closes: "20:00",
          },
        ],
        sameAs,
        knowsAbout: [
          "Website design",
          "Web development",
          "Next.js development",
          "Bilingual websites",
          "Online menus",
          "Booking flows",
          "E-commerce websites",
          "HR and payroll software",
          "Custom software development",
          "Database architecture",
          "Agentic AI tools",
        ],
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
