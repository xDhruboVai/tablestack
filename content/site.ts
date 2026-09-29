/**
 * ─────────────────────────────────────────────────────────────
 *  BRAND + CONTACT CONFIG - edit this file first.
 *  Every string marked  // REPLACE  is a placeholder.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "TableStacks",
  // Production URL - used for canonical links, sitemap and social cards.
  url: "https://tablestacks.com", // REPLACE with your real domain
  email: "tablestackbd@gmail.com",
  // Calendly / Cal.com link. Leave empty and "Book a call" falls back to an email with a subject line.
  bookingUrl: "https://cal.com/table-stack/intro-call",
  location: "Your City", // REPLACE - shown in footer + About
  availability: "Now booking projects for Q4 2026", // REPLACE / keep current
  responseTime: "We reply within two business days.", // REPLACE with a promise you can keep
  social: [
    // REPLACE or remove. Empty href = hidden.
    { label: "Instagram", href: "" },
    { label: "LinkedIn", href: "" },
  ],
  tagline: "Websites for restaurants. Front of house to back.",
  description:
    "TableStacks designs and builds websites for restaurants: the part guests see and the systems that keep service running. Editable menus, reservations, ordering, speed.",
} as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** The four layers of the exploded table in the hero. */
export const anatomy = [
  {
    code: "01",
    title: "Front of house",
    body: "The site your guests see. Designed around your room, your plates, your voice.",
  },
  {
    code: "02",
    title: "The menu",
    body: "Real text, not a PDF. Update a dish or a price from your phone in under a minute.",
  },
  {
    code: "03",
    title: "Reservations & ordering",
    body: "OpenTable, Resy, Tock, Toast, Square. Wired in so bookings land where they should.",
  },
  {
    code: "04",
    title: "Back of house",
    body: "Hosting, speed, search, uptime. The kitchen nobody sees, running clean every service.",
  },
] as const;

/** Wrap words in *asterisks* to set them in accent italic. */
export const positioning =
  "We design and build websites for restaurants. The part your *guests see,* and the systems behind it that *keep service running.* Menus you can edit in a minute. Bookings that land where they should. Pages that load on one bar of signal outside your door.";

export const capabilities = {
  frontOfHouse: {
    label: "Front of house",
    sub: "Design",
    items: [
      { name: "Website design", note: "Custom, never templated" },
      { name: "Menu design", note: "Readable on a phone at the table" },
      { name: "Art direction", note: "Photography + video briefs" },
      { name: "Motion & interaction", note: "Only where it helps" },
      { name: "Brand refresh", note: "Type, color, voice online" },
    ],
  },
  backOfHouse: {
    label: "Back of house",
    sub: "Engineering",
    items: [
      { name: "Full-stack builds", note: "Next.js, fast by default" },
      { name: "Editable menus & hours", note: "A CMS your staff can use" },
      { name: "Bookings & ordering", note: "OpenTable · Resy · Toast · Square" },
      { name: "Local search", note: "Google Business, schema, maps" },
      { name: "Hosting & care", note: "Updates, backups, monitoring" },
    ],
  },
} as const;

export const approach = [
  {
    code: "01",
    term: "Mise en place",
    plain: "Discovery",
    body: "We learn how your room works: covers, turns, who updates the menu, where bookings come from. Then we plan the site around service, not around a template.",
  },
  {
    code: "02",
    term: "The pass",
    plain: "Design",
    body: "Every page is designed for your guests’ real moments: finding the menu on the street, booking for Friday, checking if you’re open. You review real layouts, not mood boards.",
  },
  {
    code: "03",
    term: "Service",
    plain: "Build & launch",
    body: "We hand-build the site, connect your booking and ordering tools, and set up a menu editor your team will actually use. Launch is scheduled around your quiet days.",
  },
  {
    code: "04",
    term: "Family meal",
    plain: "Aftercare",
    body: "Training for your staff, then ongoing care: updates, seasonal menus, speed checks. You always have a person to message.",
  },
] as const;

/** What every site ships with - commitments, not results. */
export const standards = [
  { k: "Menus", v: "Real, searchable text. Never a PDF." },
  { k: "Speed", v: "Built to load fast on mobile data." },
  { k: "Access", v: "Designed to WCAG 2.2 AA." },
  { k: "Editing", v: "Menus, hours and specials, all staff-editable." },
  { k: "Search", v: "Local SEO + structured data on launch." },
  { k: "Ownership", v: "Your domain, your content, your accounts." },
] as const;

/** Tools we connect. Text only - no third-party logos. */
export const integrations = [
  "OpenTable",
  "Resy",
  "Tock",
  "SevenRooms",
  "Toast",
  "Square",
  "Google Business Profile",
  "Shopify",
  "Sanity",
  "Vercel",
] as const;

/**
 * Testimonials - intentionally empty. The section stays hidden until you add real quotes
 * (with the client's permission). Never add invented ones.
 */
export const testimonials: { quote: string; name: string; role: string }[] = [];

/** About page. */
export const about = {
  intro:
    "TableStacks is a small studio that designs and builds websites for restaurants. We work on both sides of the pass: the design your guests fall for, and the engineering your team relies on every night.",
  principles: [
    {
      code: "A",
      title: "We know the room",
      body: "Menus change daily. Bookings come from four places. Someone has to update the hours at 11pm. We build for that reality.",
    },
    {
      code: "B",
      title: "Hand-built, and fast",
      body: "No templates, no page builders. Custom code that loads quickly on a phone standing outside your door.",
    },
    {
      code: "C",
      title: "Yours to run",
      body: "Your staff can change a dish, a price or the hours without calling us. You own the domain, the content and the accounts.",
    },
    {
      code: "D",
      title: "Food first",
      body: "Design that makes the plate and the room feel like they do in person, then gets out of the way so guests can book.",
    },
  ],
  // REPLACE with real people. Set `placeholder: false` once filled in.
  team: [
    {
      name: "Founder name",
      role: "Design & front of house",
      bio: "Replace with two sentences on background and what they lead.",
      placeholder: true,
    },
    {
      name: "Founder name",
      role: "Engineering & back of house",
      bio: "Replace with two sentences on background and what they lead.",
      placeholder: true,
    },
  ],
} as const;

/** Contact form options. */
export const inquiry = {
  needs: ["New website", "Redesign", "Menu & CMS", "Reservations / ordering", "Something else"],
  budgets: ["Under $3k", "$3k–$8k", "$8k–$15k", "$15k+", "Not sure yet"],
  timelines: ["ASAP", "1–2 months", "3+ months", "Flexible"],
} as const;
