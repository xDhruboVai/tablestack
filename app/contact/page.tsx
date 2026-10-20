import { jsonLdText, pageMeta } from "@/lib/seo";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/content/site";

export const metadata = pageMeta({
  title: "Contact",
  description: `Tell ${site.name} what you are building. Send a short brief or email ${site.email}.`,
  path: "/contact",
});

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${site.url}/contact#webpage`,
        url: `${site.url}/contact`,
        name: `Contact | ${site.name}`,
        description: `Tell ${site.name} what you are building. Send a short brief or email ${site.email}.`,
        isPartOf: { "@id": `${site.url}/#website` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "Contact", item: `${site.url}/contact` },
          ],
        },
        mainEntity: { "@id": `${site.url}/#organization` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(jsonLd) }} />
      <section className="px-page contact-page" aria-labelledby="contact-h" data-annot="page · /contact">
        {/* Wide screens: heading and contact details on the left, the form on the right. Phones: heading, form, details. */}
        <div className="contact-page-grid">
          <div className="contact-page-heading">
            <h1 id="contact-h" className="display" data-split="lines">
              Tell us what you’re <em className="text-accent">building.</em>
            </h1>
            <p className="body-lg mt-8 max-w-[39ch]">
              A few sentences are enough to start. We’ll reply to discuss the scope and next steps.
            </p>
          </div>

          <div className="contact-brief-card">
            <p className="eyebrow text-accent">Short brief</p>
            <h2 className="display mt-3">What do you need?</h2>
            <ContactForm />
          </div>

          <aside className="contact-page-aside">
            <div>
              <p className="eyebrow">Prefer email?</p>
              <a className="contact-page-email" href={`mailto:${site.email}`}>{site.email}</a>
              <p className="mt-5 text-fg-2">Based in Dhaka, Bangladesh.</p>
            </div>
            <div className="contact-aside-next">
              <p className="eyebrow">After you get in touch</p>
              <p className="mt-4 text-fg-2">We discuss what you need, agree on the work, and share the next step.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
