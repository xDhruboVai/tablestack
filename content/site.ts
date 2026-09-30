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
  // Production URL - used for canonical links, sitemap and social cards.
  url: "https://www.tablestackbd.com", // REPLACE with your real domain
  email: "tablestackbd@gmail.com",
  // Booking link used by every "Book a call" button.
  bookingUrl: "https://cal.com/table-stack/intro-call",
  location: "Bangladesh",
  // Shown next to the location in the footer.
  timeZone: "Asia/Dhaka",
  availability: "Taking on new projects",
  responseTime: "We’ll get back to you to talk through scope and next steps.",
  social: [
    // Empty href = hidden. Add the real links when they're ready.
    { label: "Facebook", href: "" }, // REPLACE with the Facebook Page URL
    { label: "WhatsApp", href: "https://wa.me/qr/LB3AYHDJVRUAG1" }, // REPLACE with a wa.me link
  ],
  tagline: "Websites built around the way your business works.",
  description:
    "A small web team in Bangladesh. We build websites, softwares and databases for all kinds of businesses and corporations, plus the tools behind them when you need them.",
} as const;

/** Props for every "Book a call" link: the booking page in a new tab, or an email while there's no link. */
export const bookCall = site.bookingUrl
  ? { href: site.bookingUrl, target: "_blank", rel: "noreferrer" }
  : { href: `mailto:${site.email}?subject=${encodeURIComponent("Book a call")}` };

export const nav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
    title: "Your content",
    body: "Menus, products, services and hours, laid out so people find them fast.",
  },
  {
    code: "03",
    title: "Bookings & orders",
    body: "Reservations, ordering or enquiries, built in or connected when you need them.",
  },
  {
    code: "04",
    title: "The systems behind it",
    body: "Admin tools, dashboards, backend and hosting. The tech stack in TableStack.",
  },
] as const;

/** Wrap words in *asterisks* to set them in accent italic. */
export const positioning =
  "We build websites for *all kinds of businesses and corporations.* Company and service sites, online shops, restaurants, portfolios, landing pages and whatnot. When a business needs more than pages, we add *practical tools:* reservations, ordering, HR, management dashboards. Clear scope. A working result.";

export const capabilities = {
  frontOfHouse: {
    label: "Websites",
    sub: "Front of house",
    items: [
      { name: "Company & service sites", note: "A clear offer, an easy enquiry" },
      { name: "Online shops", note: "Products, cart, orders" },
      { name: "Restaurant & café sites", note: "Menus, branches, hours, bookings" },
      { name: "Portfolios & landing pages", note: "Focused and quick to launch" },
      { name: "Branding with your site", note: "When it’s part of the scope" },
    ],
  },
  backOfHouse: {
    label: "Systems",
    sub: "Back of house",
    items: [
      { name: "Reservations & booking", note: "Built in or connected" },
      { name: "Online ordering", note: "From menu to checkout" },
      { name: "HR & management tools", note: "Replace the manual process" },
      { name: "Dashboards & admin", note: "Next.js, Supabase, auth" },
      { name: "Launch & support", note: "Vercel, SEO setup, maintenance" },
    ],
  },
} as const;

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

/** About page. */
export const about = {
  intro:
    "TableStack is a small web team in Bangladesh. We build websites, softwares and databases for businesses and corporations.",
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
    "New website",
    "Redesign",
    "Online shop",
    "Reservations / ordering",
    "Dashboard or admin tool",
    "Something else",
  ],
  // REPLACE with ranges that match your real pricing (in BDT).
  budgets: ["Under ৳50k", "৳50k–৳150k", "৳150k–৳400k", "৳400k+", "Not sure yet"],
  timelines: ["ASAP", "1–2 months", "3+ months", "Flexible"],
} as const;
