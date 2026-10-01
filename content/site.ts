/**
 * ─────────────────────────────────────────────────────────────
 *  BRAND + CONTACT CONFIG - edit this file first.
 *  Every string marked  // REPLACE  is a placeholder.
 *
 *  Voice: short, direct sentences. Say what we build, who it's for and
 *  what a client can expect. Concrete examples over slogans. No invented
 *  clients, metrics, testimonials or guarantees. Less talk, more work done.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "TableStack",
  // Other ways people write the name. Sent to search engines as alternate names only; the brand is "TableStack".
  altNames: ["Table Stack", "TableStack BD"],
  // Production URL - used for canonical links, sitemap and social cards.
  url: "https://tablestackbd.com",
  email: "tablestackbd@gmail.com",
  // Company phone: shown in the footer and in Google's business data.
  phone: "01716934401",
  phoneIntl: "+8801716934401",
  city: "Dhaka",
  // Booking link used by every "Book a call" button.
  bookingUrl: "https://cal.com/table-stack/intro-call",
  location: "Bangladesh",
  // Shown next to the location in the footer.
  timeZone: "Asia/Dhaka",
  availability: "Taking on new projects",
  responseTime: "We’ll get back to you to talk through scope and next steps.",
  social: [
    // Empty href = hidden. Add the real links when they're ready.       
    { label: "Facebook", href: "https://www.facebook.com/share/14vDpitJUjH/" },
    { label: "WhatsApp", href: "https://wa.me/qr/LB3AYHDJVRUAG1" }, // REPLACE with a wa.me link
  ],
  tagline: "Websites built around the way your business works.",
  // Shown in Google results and link previews (keep under about 160 characters).
  seoTitle: "TableStack | Web Development & AI Solutions in Bangladesh",
  seoDescription:
    "TableStack is a Bangladesh web development team building custom websites, business software, databases, and AI tools. Explore our work and discuss your project.",
  description:
    "A small web team in Bangladesh. We build websites, software and databases for all kinds of businesses and corporations, plus the tools behind them when you need them.",
} as const;

/** Props for every "Book a call" link: the booking page in a new tab, or an email while there's no link. */
export const bookCall = site.bookingUrl
  ? { href: site.bookingUrl, target: "_blank", rel: "noreferrer" }
  : { href: `mailto:${site.email}?subject=${encodeURIComponent("Book a call")}` };

export const nav = [
  { label: "Work", href: "/work" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Extra pages, linked from the footer only. */
export const footerNav = [
  { label: "Why TableStack", href: "/why-tablestack" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
] as const;

/** The four layers of the exploded table in the hero. */
export const anatomy = [
  {
    code: "01",
    title: "The website",
    body: "What your customers see. Built around your business, not a template.",
  },
  {
    code: "02",
    title: "Your data",
    body: "Databases designed, migrated and kept fast, so the numbers are always right.",
  },
  {
    code: "03",
    title: "Software & cloud",
    body: "Business software, mobile apps and APIs, running on the cloud.",
  },
  {
    code: "04",
    title: "AI that does the work",
    body: "Agents and automation that take the manual work off your team. The tech stack in TableStack.",
  },
] as const;

/** Wrap words in *asterisks* for accent italic, **double asterisks** for bold. */
export const positioning =
  "We build websites, databases and AI tools for *businesses of every size.* **Clear scope. A working result.**";

/** What we do: three areas, five services each. `note` is the plain-language line under each service. */
export const pillars = [
  {
    title: "Web & digital",
    sub: "Websites and web apps",
    summary: "Web apps, UI/UX, online shops, PWAs and SEO",
    items: [
      { name: "Custom web applications", note: "Front-end, back-end or the full stack" },
      { name: "Web & mobile UI/UX design", note: "Interfaces that work on every screen" },
      { name: "E-commerce & CMS", note: "Online shops, and content your team can edit" },
      { name: "PWAs & API integration", note: "App-like sites, connected to your tools" },
      { name: "Performance, SEO & accessibility", note: "Fast, found on Google, usable by everyone" },
    ],
  },
  {
    title: "Data & databases",
    sub: "The data underneath",
    summary: "Schema design, migration, ETL and backups",
    items: [
      { name: "Database architecture & schema design", note: "SQL, NoSQL and vector databases" },
      { name: "Legacy database migration", note: "Move old systems to modern ones, safely" },
      { name: "Administration & performance tuning", note: "Indexing and tuning so queries stay fast" },
      { name: "Data warehousing, ETL & real-time sync", note: "Data moved, cleaned and kept in step" },
      { name: "Backups, recovery & high availability", note: "Systems that stay up and bounce back" },
    ],
  },
  {
    title: "Agentic AI",
    sub: "AI that does the work",
    summary: "Agents, automation, RAG and fine-tuning",
    items: [
      { name: "AI agents & multi-agent systems", note: "Agents that plan and act together" },
      { name: "Custom AI tools & workflow automation", note: "Function calling that takes over manual steps" },
      { name: "RAG & vector search", note: "AI answers grounded in your own documents" },
      { name: "LLM fine-tuning & model integration", note: "Models shaped and wired into your product" },
      { name: "Enterprise AI, analytics & governance", note: "Responsible AI across the company" },
    ],
  },
] as const;

export const approach = [
  {
    code: "01",
    term: "Discuss",
    plain: "Define the scope",
    body: "We discuss your business, then agree on pages, features, timeline and a quote.",
  },
  {
    code: "02",
    term: "Design",
    plain: "See it first",
    body: "You see the layouts and key interactions before development.",
  },
  {
    code: "03",
    term: "Build",
    plain: "Working preview",
    body: "We build it and share a working preview.",
  },
  {
    code: "04",
    term: "Launch & support",
    plain: "Go live",
    body: "We test, launch and agree on any continued support.",
  },
] as const;

/** What a client can expect on every project - how we work, not results. */
export const standards = [
  { k: "Scope", v: "Pages, features, timeline and quote agreed first." },
  { k: "Preview", v: "Layouts and a working preview before launch." },
  { k: "Plain language", v: "Clear explanations, no jargon." },
  { k: "Mobile first", v: "Built for phones first." },
  { k: "Editing", v: "Update content yourself where it’s in scope." },
  { k: "Ownership", v: "Your domain, content and accounts." },
] as const;

/** Tools we build with. Text only - no third-party logos. */
export const integrations = [
  "Next.js",
  "React",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "Vercel",
  "Tailwind CSS",
] as const;

/**
 * Testimonials - intentionally empty. The section stays hidden until you add real quotes
 * (with the client's permission). Never add invented ones.
 */
export const testimonials: { quote: string; name: string; role: string }[] = [];

/**
 * The team, shown on the About page. Photos live in /public/team; `focus` is the crop point (object-position).
 * `whatsapp` is the local number as shown; the link uses the international form (880 + number without the 0).
 */
export const team = [
  {
    name: "Dihan Islam Dhrubo",
    role: "Backend Developer",
    facebook: "https://www.facebook.com/dihanislam.dhrubo.5/",
    whatsapp: "01323866906",
    study: "BRAC University, CSE",
    graduation: "Expected graduation May 2027",
    github: "https://github.com/xDhruboVai",
    photo: "/team/dihan.webp",
    focus: "50% 30%",
  },
  {
    name: "Saalim Saadman",
    role: "Frontend Developer",
    facebook: "https://www.facebook.com/saalim.saadman.2025/",
    whatsapp: "01742777666",
    study: "UCSI University Bangladesh Branch Campus, CS",
    graduation: "Expected graduation September 2028",
    github: "https://github.com/Saadmantheretroenjoyer",
    photo: "/team/saalim.jpg",
    focus: "90% 40%",
  },
  {
    name: "Nahin Hasan",
    role: "Management, Client Relations & PR",
    facebook: "https://www.facebook.com/nahin.hasan.5220/",
    whatsapp: "01716934401",
    study: "North South University, BBA (Marketing)",
    graduation: "Expected graduation August 2028",
    photo: "/team/nahin.jpg",
    focus: "50% 38%",
  },
] as const;

/** About page. */
export const about = {
  intro:
    "TableStack is a small web team in Bangladesh. We build websites, software, databases and AI tools for businesses and corporations.",
  principles: [
    {
      code: "A",
      title: "Built around your business",
      body: "We start with how your business actually runs.",
    },
    {
      code: "B",
      title: "Websites first. Tools when needed.",
      body: "Extra systems should serve a specific need.",
    },
    {
      code: "C",
      title: "Clear scope. A working result.",
      body: "We agree on the scope and show a working preview before launch.",
    },
    {
      code: "D",
      title: "Less talk, more work done",
      body: "Short updates and plain explanations.",
    },
  ],
} as const;

/** Contact form options. */
export const inquiry = {
  needs: [
    "Website or web app",
    "Database or data work",
    "Software, mobile or cloud",
    "AI or automation",
    "Something else",
  ],
  // Budget ranges in BDT.
  budgets: ["Under Tk 25,000", "Under Tk 35,000", "Under Tk 50,000", "Tk 50,000+"],
  timelines: ["ASAP", "1–2 months", "3+ months", "Flexible"],
} as const;
