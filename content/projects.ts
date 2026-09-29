/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS
 *
 *  `realProjects` is live client work and is what the site shows.
 *  `placeholderProjects` are fictional samples kept only as a template
 *  for the case-study structure. They're hidden while SHOW_PLACEHOLDERS
 *  is false, and are labeled "Placeholder" if you ever turn them on.
 *
 *  Images live in /public/work/<slug>/. A project without `media.cover`
 *  falls back to code-drawn artwork from `art`.
 * ─────────────────────────────────────────────────────────────
 */

const SHOW_PLACEHOLDERS = false;

export type Motif = "flame" | "loaf" | "enso" | "leaf" | "book";

export type ProjectArt = {
  /** Colors of the (fictional) client brand used in the preview. */
  palette: { bg: string; fg: string; accent: string; soft: string };
  /** Display type style for the preview's wordmark. */
  type: "serif" | "condensed" | "sans" | "mono";
  motif: Motif;
  layout: "poster" | "split" | "center" | "grid";
  tagline: string;
  dishes: [string, string][];
};

export type GalleryItem = {
  /** Path under /public, e.g. "/work/brasa/home.jpg". Leave empty to show the placeholder frame. */
  src?: string;
  alt: string;
  caption: string;
  /** Which placeholder frame to draw when there's no src. */
  frame: "desktop" | "mobile" | "menu" | "detail" | "boh";
  /** What asset to supply for this slot. */
  spec: string;
  wide?: boolean;
};

export type Project = {
  slug: string;
  placeholder: boolean;
  title: string;
  client: string;
  kind: string;
  category: "Restaurants" | "Beyond restaurants";
  year: string;
  location: string;
  services: string[];
  stack: string[];
  summary: string;
  liveUrl?: string;
  challenge: string;
  approach: string;
  execution: string[];
  outcome: string;
  /** Brand colors (used while images load, and for code-drawn fallbacks). */
  art: ProjectArt;
  media?: {
    cover?: string;
    coverAlt?: string;
    /** Edge-detected "blueprint" of the cover, shown under the back-of-house lens. */
    coverBoh?: string;
    /** Horizontal crop focus (0 = left, 50 = center, 100 = right) when the cover is cropped. */
    focusX?: number;
    /** Back-of-house lens labels over the cover, in % of the image. */
    annotations?: { x: number; y: number; w: number; h: number; label: string }[];
  };
  gallery: GalleryItem[];
};

const gallery = (name: string): GalleryItem[] => [
  {
    frame: "desktop",
    alt: `${name} homepage on desktop`,
    caption: "Homepage, desktop",
    spec: "Desktop screenshot, 2400×1500 (16:10) JPG/WebP",
    wide: true,
  },
  {
    frame: "mobile",
    alt: `${name} menu and booking screens on mobile`,
    caption: "Menu + booking, mobile",
    spec: "Square composite of two mobile screens, 1600×1600",
  },
  {
    frame: "menu",
    alt: `${name} menu page layout`,
    caption: "Editable menu",
    spec: "Menu page or CMS screen, 1600×1600",
  },
  {
    frame: "detail",
    alt: `${name} typography and color details`,
    caption: "Type + color system",
    spec: "Detail crop or brand sheet, 1600×1600",
  },
  {
    frame: "boh",
    alt: `${name} site architecture diagram`,
    caption: "Back of house: how it’s wired",
    spec: "Optional: architecture diagram or CMS screen, 1600×1600",
  },
];

const placeholderProjects: Project[] = [
  {
    slug: "brasa",
    placeholder: true,
    title: "Brasa",
    client: "Client name (placeholder)",
    kind: "Live-fire grill",
    category: "Restaurants",
    year: "2026",
    location: "City, Country",
    services: ["Website design", "Full-stack build", "Reservations", "Menu CMS"],
    stack: ["Next.js", "Sanity", "Resy", "Vercel"],
    summary:
      "A dark, smoky site for a wood-fired grill, with a nightly menu the chef edits from the pass.",
    challenge:
      "Sample copy (replace). The menu changed every night and lived in a PDF nobody updated. Bookings came through a widget that broke on mobile, so regulars phoned instead, during service.",
    approach:
      "Sample copy (replace). We designed around the fire: near-black pages, warm type, photography lit by the grill. The menu became structured content so the chef could publish tonight’s dishes in a minute.",
    execution: [
      "Custom design system built around the restaurant’s own photography",
      "Structured, staff-editable menu with daily specials and allergen tags",
      "Resy booking flow embedded natively and tested on low-end phones",
      "Local SEO, opening-hours schema and Google Business Profile sync",
    ],
    outcome:
      "Replace with the real outcome. Describe what changed for the client in their words: a quote, what the team now handles themselves, the launch date. Only include numbers you can verify.",
    art: {
      palette: { bg: "#1B1512", fg: "#F4E9DC", accent: "#E8672A", soft: "#3A2A22" },
      type: "serif",
      motif: "flame",
      layout: "poster",
      tagline: "Cooked over live fire.",
      dishes: [
        ["Charred leeks, hazelnut", "14"],
        ["Oak-grilled bream", "32"],
        ["Ember potatoes", "9"],
      ],
    },
    gallery: gallery("Brasa"),
  },
  {
    slug: "forno",
    placeholder: true,
    title: "Forno",
    client: "Client name (placeholder)",
    kind: "Neighborhood bakery",
    category: "Restaurants",
    year: "2026",
    location: "City, Country",
    services: ["Website design", "Online pre-orders", "Brand refresh"],
    stack: ["Next.js", "Square", "Vercel"],
    summary:
      "A bright, bold site for a bakery that sells out daily, with pre-orders that close themselves at 2pm.",
    challenge:
      "Sample copy (replace). Customers kept arriving after the bread was gone. Pre-orders were handled over Instagram messages and a notebook behind the counter.",
    approach:
      "Sample copy (replace). A loud, happy identity on the web, and a pre-order flow tied to the bakery’s real daily capacity so nothing gets oversold.",
    execution: [
      "Bold typographic system extended from the shop sign",
      "Square-powered pre-orders with daily cut-off and pickup slots",
      "Today’s bake list, editable by staff from a phone",
      "Wholesale inquiry page with a short, structured form",
    ],
    outcome:
      "Replace with the real outcome. Describe what changed (for example, how pre-orders are handled now) using the client’s words. Only include numbers you can verify.",
    art: {
      palette: { bg: "#F3E6CF", fg: "#23285A", accent: "#D9542B", soft: "#E8D3AE" },
      type: "condensed",
      motif: "loaf",
      layout: "split",
      tagline: "Baked this morning.",
      dishes: [
        ["Country loaf", "8"],
        ["Cardamom bun", "4.5"],
        ["Focaccia, sea salt", "6"],
      ],
    },
    gallery: gallery("Forno"),
  },
  {
    slug: "sumi",
    placeholder: true,
    title: "Sumi",
    client: "Client name (placeholder)",
    kind: "Omakase counter",
    category: "Restaurants",
    year: "2025",
    location: "City, Country",
    services: ["Website design", "Ticketed booking", "Art direction"],
    stack: ["Next.js", "Tock", "Vercel"],
    summary:
      "A quiet, exact site for a twelve-seat counter: one page, one booking button, nothing extra.",
    challenge:
      "Sample copy (replace). Seats released monthly and sold out in minutes. The old site buried the release date and the booking link three clicks deep.",
    approach:
      "Sample copy (replace). Restraint. A single scrolling page with the next release date front and center, and a prepaid booking flow that holds up under a rush.",
    execution: [
      "Minimal, type-led design with a single accent color",
      "Prepaid Tock booking with release countdown",
      "Photography direction for the counter and the chef’s hands",
      "Bilingual content structure ready for a second language",
    ],
    outcome:
      "Replace with the real outcome. Describe how release day works now, in the client’s words. Only include numbers you can verify.",
    art: {
      palette: { bg: "#0E0E0E", fg: "#EDEAE3", accent: "#C4452F", soft: "#232220" },
      type: "serif",
      motif: "enso",
      layout: "center",
      tagline: "Twelve seats. One counter.",
      dishes: [
        ["Omakase", "Seasonal"],
        ["Sake pairing", "Optional"],
        ["Next release", "01.11"],
      ],
    },
    gallery: gallery("Sumi"),
  },
  {
    slug: "verde",
    placeholder: true,
    title: "Verde",
    client: "Client name (placeholder)",
    kind: "Café group, three locations",
    category: "Restaurants",
    year: "2025",
    location: "City, Country",
    services: ["Multi-location website", "Menu CMS", "Online ordering", "Local SEO"],
    stack: ["Next.js", "Sanity", "Toast", "Vercel"],
    summary:
      "One site, three cafés, each with its own hours, menu and ordering, managed from one place.",
    challenge:
      "Sample copy (replace). Three locations, three outdated pages, and hours that were wrong on Google more often than not.",
    approach:
      "Sample copy (replace). A shared brand with location-specific pages generated from one source of truth, so a holiday closure is changed once and shows up everywhere.",
    execution: [
      "Location pages generated from a single CMS",
      "Per-location menus with shared and local items",
      "Toast online ordering routed to the right kitchen",
      "Structured data per location for maps and search",
    ],
    outcome:
      "Replace with the real outcome. Describe how the team manages three locations now. Only include numbers you can verify.",
    art: {
      palette: { bg: "#E6EBDD", fg: "#1F3A2B", accent: "#E9A93A", soft: "#CBD6BE" },
      type: "sans",
      motif: "leaf",
      layout: "grid",
      tagline: "Three neighborhoods. One kitchen.",
      dishes: [
        ["Green shakshuka", "15"],
        ["Seasonal grain bowl", "14"],
        ["Oat flat white", "5"],
      ],
    },
    gallery: gallery("Verde"),
  },
  {
    slug: "marginalia",
    placeholder: true,
    title: "Marginalia",
    client: "Client name (placeholder)",
    kind: "Bookshop & event space",
    category: "Beyond restaurants",
    year: "2025",
    location: "City, Country",
    services: ["Website design", "Events calendar", "E-commerce"],
    stack: ["Next.js", "Shopify", "Vercel"],
    summary:
      "Proof we cook outside the kitchen too: a bookshop site with events, a café menu and a small online store.",
    challenge:
      "Sample copy (replace). Events were announced on social only, and the online store was a separate site with a different look.",
    approach:
      "Sample copy (replace). One editorial site that treats events like a programme, with the store and café menu living under the same roof.",
    execution: [
      "Editorial layout with an events programme and RSVPs",
      "Headless Shopify store sharing the same design system",
      "Café menu using the same editable menu module we build for restaurants",
      "Newsletter sign-up tied to the events calendar",
    ],
    outcome:
      "Replace with the real outcome, in the client’s words. Only include numbers you can verify.",
    art: {
      palette: { bg: "#F4F1EA", fg: "#1D1D1B", accent: "#3D55F0", soft: "#E3DDD0" },
      type: "mono",
      motif: "book",
      layout: "grid",
      tagline: "Books, readings, good coffee.",
      dishes: [
        ["Thursday reading", "7pm"],
        ["Poetry night", "Fri"],
        ["Filter coffee", "4"],
      ],
    },
    gallery: gallery("Marginalia"),
  },
];

/* ── Live client work ──────────────────────────────────────── */
const realProjects: Project[] = [
  {
    slug: "smashed-burgers",
    placeholder: false,
    title: "Smashed Burgers",
    client: "Smashed Burgers Dhaka",
    kind: "Smash burger chain, six branches",
    category: "Restaurants",
    year: "2026",
    location: "Dhaka, Bangladesh",
    services: ["Website design", "Full-stack build", "Table reservations", "English + Bangla"],
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
    summary:
      "A loud, saucy site for a six-branch smash burger chain, in English and Bangla, with the full menu and table requests for every branch.",
    liveUrl: "https://smashed-burgers-six.vercel.app/en",
    challenge:
      "Six branches, one menu across 13 categories, and a brand that runs on attitude. The site had to sell the food on sight, make a big menu easy to browse on a phone, and let guests request a table at any branch.",
    approach:
      "We leaned all the way into the brand: near-black pages, tall condensed type in mustard yellow, and food cut out and lit like a poster. A scroll-driven sauce sequence (Drop, Pour, Flow, Drown) puts on a show, while the menu and booking stay one tap away.",
    execution: [
      "Every page in English and Bangla, switchable from the header",
      "Menu organised into 13 categories with prices in BDT, the same at every branch",
      "Reservation requests by branch, date, time and party size, confirmed by a call from the branch team",
      "Locations page with addresses, hours and directions for each branch",
      "Mobile tab bar for Home, Menu, Reserve and Locations",
      "Guest reviews sourced from Google Maps",
    ],
    outcome:
      "Launched in English and Bangla, with every branch, the full menu and table requests on one fast, mobile-first site.",
    art: {
      palette: { bg: "#0B0A09", fg: "#FBF4E6", accent: "#F6B81A", soft: "#1A1713" },
      type: "condensed",
      motif: "flame",
      layout: "poster",
      tagline: "Taste the smash revolution.",
      dishes: [
        ["Classic Beef Cheese Burger", "399"],
        ["Jalapeño Blazed Beef Burger", "439"],
        ["Honeyfire Chicken", "359"],
      ],
    },
    media: {
      cover: "/work/smashed-burgers/cover.jpg",
      coverBoh: "/work/smashed-burgers/cover-boh.jpg",
      coverAlt: "Smashed Burgers homepage: a dripping double smash burger next to the headline Ready to get messy?",
      annotations: [
        { x: 7, y: 1, w: 86, h: 8, label: "Nav · EN / বাংলা switch" },
        { x: 7.5, y: 18, w: 34, h: 48, label: "h1 · condensed display" },
        { x: 51, y: 27, w: 45, h: 51, label: "Hero dish · cut-out photo" },
        { x: 7.5, y: 80, w: 31, h: 9, label: "Menu + Reserve CTAs" },
      ],
    },
    gallery: [
      {
        src: "/work/smashed-burgers/home.jpg",
        frame: "desktop",
        alt: "Fan Favourites section: burger and fries cards with category, name and price",
        caption: "Fan favourites, desktop",
        spec: "",
        wide: true,
      },
      {
        src: "/work/smashed-burgers/mobile.jpg",
        frame: "mobile",
        alt: "Two phones showing the Smashed Burgers homepage and the reservation form",
        caption: "Home + reservations, mobile",
        spec: "",
      },
      {
        src: "/work/smashed-burgers/menu.jpg",
        frame: "menu",
        alt: "Menu page with burger category cards showing item counts and starting prices",
        caption: "Menu, 13 categories",
        spec: "",
      },
      {
        src: "/work/smashed-burgers/detail.jpg",
        frame: "detail",
        alt: "Scroll sequence: a crispy chicken tender with sauce dripping, headline Drop",
        caption: "Scroll-driven sauce sequence",
        spec: "",
      },
      {
        src: "/work/smashed-burgers/booking.jpg",
        frame: "boh",
        alt: "Reserve a Table form with branch, date, time, guests and name fields",
        caption: "Reservation requests, by branch",
        spec: "",
      },
    ],
  },
  {
    slug: "pinewood",
    placeholder: false,
    title: "Pinewood",
    client: "Pinewood Cafe + Kitchen",
    kind: "Café and restaurant, three branches",
    category: "Restaurants",
    year: "2026",
    location: "Dhaka, Bangladesh",
    services: ["Website design", "Full-stack build", "Reservations + pre-orders", "Menu system", "English + Bangla"],
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
    summary:
      "A warm, café-first site for a Dhaka favourite since 2016: a filterable menu, branch-by-branch pricing, and a booking flow that holds your table and lets you order ahead.",
    liveUrl: "https://pinewood-theta.vercel.app/",
    challenge:
      "Three branches with the same hours but not always the same prices, a long menu of halal, vegetarian and chef’s specials, and bookings the team confirms by phone. All of it had to be clear, without turning a cosy café into a spreadsheet.",
    approach:
      "The design takes its cues from the rooms: deep pine green, warm cream, handwritten script for the personal touches and a clean sans for the details. The menu is built as data rather than a PDF, so dishes can be filtered and priced per branch.",
    execution: [
      "Menu filters for halal, vegetarian and chef’s specials, with prices per branch where they differ",
      "Seven-step booking: branch, inside or outside (smoking zone), party size, date and time, then a summary before sending",
      "Tables are held while the team calls to confirm; confirmed guests get an emailed link to pre-order, closing 60 minutes before the booking",
      "Visit page with today’s hours highlighted, directions and phone numbers for every branch",
      "English and Bangla throughout, plus a staff login for the team",
    ],
    outcome:
      "Launched with all three branches, the full menu, online booking and pre-orders, in English and Bangla.",
    art: {
      palette: { bg: "#224A4F", fg: "#F3ECE1", accent: "#E6C24A", soft: "#1B3B3F" },
      type: "serif",
      motif: "leaf",
      layout: "split",
      tagline: "From our kitchen.",
      dishes: [
        ["Pine 3", "999"],
        ["Seafood Platter", "999"],
        ["Cappuccino", "229"],
      ],
    },
    media: {
      cover: "/work/pinewood/cover.jpg",
      coverBoh: "/work/pinewood/cover-boh.jpg",
      focusX: 0,
      coverAlt: "Pinewood homepage: the Pine 3 set menu plated on a wooden table, with its price and a Reserve a table button",
      annotations: [
        { x: 2.5, y: 1, w: 95, h: 7.5, label: "Nav · EN / বাংলা · Reserve" },
        { x: 3, y: 26, w: 29, h: 42, label: "Featured dish · live from menu" },
        { x: 3, y: 83, w: 40, h: 6, label: "Set menus · café & restaurant" },
        { x: 74, y: 79, w: 22, h: 12, label: "Opening hours" },
      ],
    },
    gallery: [
      {
        src: "/work/pinewood/home.jpg",
        frame: "desktop",
        alt: "From the menu section: dish list with prices beside a large food photo carousel",
        caption: "From the menu, desktop",
        spec: "",
        wide: true,
      },
      {
        src: "/work/pinewood/mobile.jpg",
        frame: "mobile",
        alt: "Two phones showing the Pinewood homepage and the menu with dietary filters",
        caption: "Home + menu, mobile",
        spec: "",
      },
      {
        src: "/work/pinewood/menu.jpg",
        frame: "menu",
        alt: "Menu page with category tabs, halal and vegetarian filters, and per-branch prices",
        caption: "Filterable menu, prices per branch",
        spec: "",
      },
      {
        src: "/work/pinewood/detail.jpg",
        frame: "detail",
        alt: "About page: the Pinewood dining room with a coffee counter and cake display",
        caption: "About: the rooms",
        spec: "",
      },
      {
        src: "/work/pinewood/booking.jpg",
        frame: "boh",
        alt: "Booking steps: inside or outside seating, number of people, date and time",
        caption: "Seven-step booking flow",
        spec: "",
      },
    ],
  },
];

export const projects: Project[] =
  SHOW_PLACEHOLDERS || realProjects.length === 0 ? [...realProjects, ...placeholderProjects] : realProjects;

export const featuredSlugs = projects.slice(0, 4).map((p) => p.slug);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
