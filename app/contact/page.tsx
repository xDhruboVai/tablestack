import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import CopyEmail from "@/components/contact/CopyEmail";
import { bookCall, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with ${site.name}. Email ${site.email} or send a short brief.`,
  alternates: { canonical: "/contact" },
};

const next = [
  ["01", "We talk", "About your business, your customers and what the site or system needs to do."],
  ["02", "We agree the scope", "Pages, features, timeline and a quote, all before any work starts."],
  ["03", "We get to work", "You see the layouts first, then a working preview before launch."],
];

export default function ContactPage() {
  return (
    <section className="px-page pb-28 pt-[calc(var(--nav-h)+10svh)] md:pb-40" aria-labelledby="contact-h" data-annot="page · /contact">
      <p className="eyebrow flex items-center gap-3 text-fg-2" data-reveal="scramble">
        <span className="live-dot" aria-hidden="true" /> {site.availability}
      </p>
      <h1 id="contact-h" className="display mt-6 text-[clamp(2.8rem,9vw,9.5rem)]" data-split="chars">
        Start a <em className="text-accent">project.</em>
      </h1>

      <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-16 md:mt-20">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+32px)]">
            <p className="eyebrow text-muted">Rather just email?</p>
            <a href={`mailto:${site.email}`} className="cta-email mt-3 inline-block font-display text-[clamp(1.5rem,2.6vw,2.6rem)] font-bold leading-tight tracking-[-0.035em]" data-reveal="rise">
              {site.email}
            </a>
            <div className="mt-5 flex flex-wrap gap-3" data-reveal="rise" data-delay="100">
              <CopyEmail email={site.email} />
              <a {...bookCall} className="btn btn-ghost">
                Book a call
              </a>
            </div>

            <div className="mt-14">
              <p className="eyebrow text-muted">What happens next</p>
              <ol className="mt-4" data-reveal="stagger">
                {next.map(([n, t, b]) => (
                  <li key={n} className="grid grid-cols-[40px_1fr] gap-x-3 border-t border-rule py-5">
                    <span className="eyebrow pt-1 text-accent">{n}</span>
                    <div>
                      <p className="font-medium">{t}</p>
                      <p className="mt-1 text-fg-2">{b}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7" data-reveal="rise" data-annot="<ContactForm />">
          <h2 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium tracking-[-0.03em]">Send a short brief</h2>
          <div className="mt-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
