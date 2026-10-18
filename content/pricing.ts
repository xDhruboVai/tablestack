/**
 * Pricing shown on /pricing: taka for visitors in Bangladesh, USD for everyone else.
 *
 * These are starting prices. Every project is scoped first and gets its own quote.
 * Internal quoting ranges for custom work are deliberately NOT kept here (this repository is public).
 */

export type Region = "us" | "bd";

/** The visitor's region from their two-letter country code (the hosting platform's IP lookup). */
export const regionOf = (country: string | null | undefined): Region => (country?.toUpperCase() === "BD" ? "bd" : "us");

/** The four main packages. `id` is passed to the contact form so we know which one a visitor asked about. */
export type Plan = {
  id: string;
  name: string;
  /** Who it suits, as one short line. */
  for: string;
  /** The starting price per region, or null when the work is quoted. */
  price: Record<Region, string> | null;
  included: string[];
  /** Small print under the list. */
  note?: string;
  cta: string;
  tone: "paper" | "ink" | "amber" | "butter";
};

export const plans: Plan[] = [
  {
    id: "landing",
    name: "Landing page / Portfolio",
    for: "Bakeries, restaurants, cafés, personal portfolios, small businesses and creative professionals",
    price: { us: "$199", bd: "৳11,000" },
    included: [
      "Custom responsive landing page",
      "Up to 5 thoughtfully designed sections",
      "Mobile and desktop optimization",
      "Contact form",
      "Basic on-page SEO",
      "Social media integration",
      "Deployment assistance",
      "30-day post-launch bug warranty",
    ],
    cta: "Discuss this package",
    tone: "paper",
  },
  {
    id: "business",
    name: "E-commerce / Business website",
    for: "Fashion brands, online stores, product-based businesses and growing companies",
    price: { us: "$449", bd: "৳14,000" },
    included: [
      "Custom responsive website",
      "Product or service catalog",
      "Product detail pages where applicable",
      "Basic admin dashboard",
      "Shopping cart or inquiry flow, depending on scope",
      "Basic on-page SEO",
      "Deployment assistance",
      "60-day post-launch bug warranty",
    ],
    note: "Payment gateways, advanced shipping, complex inventory and extra automation are quoted separately unless agreed.",
    cta: "Discuss this package",
    tone: "ink",
  },
  {
    id: "hr",
    name: "HR management system",
    for: "Companies that want staff, attendance, leave and payroll in one place",
    price: { us: "$749", bd: "৳15,000" },
    included: [
      "Employee directory and permissions",
      "Attendance and leave requests",
      "Payroll worksheets and PDF payslips from Standard",
      "Shifts, department workflows and audit logs in Enterprise",
    ],
    cta: "Discuss HR requirements",
    tone: "amber",
  },
  {
    id: "custom",
    name: "Custom solutions",
    for: "Businesses with needs that don’t fit a package",
    price: null,
    included: [
      "Custom admin dashboards",
      "Booking and reservation systems",
      "CRM systems",
      "Inventory management",
      "API and third-party integrations",
      "AI and workflow automation",
      "Custom web applications",
      "Mobile applications",
    ],
    note: "Every custom project starts with a consultation and a written quote.",
    cta: "Request a quote",
    tone: "butter",
  },
];

/** The HR system's three levels. Each one includes everything in the level before it. */
export const hrTiers = [
  {
    id: "basic",
    name: "Basic",
    price: { us: "$749", bd: "৳15,000" },
    lead: "Keep track of your team",
    items: [
      "Employee directory",
      "Role-based permissions",
      "Manual attendance check-in and check-out",
      "Basic leave requests",
      "Admin dashboard",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: { us: "$1,249", bd: "৳20,000" },
    lead: "Everything in Basic, plus",
    items: [
      "Monthly payroll worksheets",
      "Configurable allowances and deductions",
      "Leave balance tracking",
      "PDF payslip generation",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { us: "$2,499+", bd: "৳25,000+" },
    lead: "Everything in Standard, plus",
    items: [
      "Shift scheduling",
      "Department workflows",
      "Audit logs",
      "Biometric device integration, after a check that your devices are compatible",
    ],
  },
] as const;

/** Optional extras and monthly upkeep. Indicative ranges; the final quote depends on scope. */
export const addOns: Record<Region, { name: string; price: string }[]> = {
  us: [
    { name: "SEO optimization", price: "$49.50 to $99.50" },
    { name: "Security hardening and basic testing", price: "$74.50 to $149.50" },
    { name: "Order automation", price: "$149.50 to $299.50" },
    { name: "Website maintenance", price: "$24.50 to $49.50 a month" },
    { name: "E-commerce maintenance", price: "$49.50 to $99.50 a month" },
    { name: "HR system support", price: "$74.50 to $149.50 a month" },
    { name: "Additional feature development", price: "$15 to $22.50 an hour" },
  ],
  bd: [
    { name: "Landing page with a custom admin panel", price: "৳11,000" },
    { name: "SEO optimization (on-page and technical)", price: "৳2,000" },
    { name: "Security testing and database hardening", price: "৳2,000" },
    { name: "Post-launch bug warranty", price: "Included (90 days)" },
    { name: "Order automation suite", price: "৳3,000" },
    { name: "HR module (Basic, Standard or Enterprise)", price: "৳15,000 to ৳25,000+" },
    { name: "Monthly database maintenance (not for landing pages)", price: "৳500 a month" },
    { name: "Custom feature or change request, after 90 days", price: "৳800" },
  ],
};

/** The first line of the small print, per region. */
export const currencyNote: Record<Region, string> = {
  us: "Prices are starting estimates in USD.",
  bd: "Prices are starting estimates in Bangladeshi taka.",
};

/** The rest of the small print, shown under the packages. */
export const pricingNotes = [
  "The final price depends on the scope and what you need.",
  "Hosting, domains, third-party subscriptions and payment processing fees are extra unless your proposal includes them.",
  "Bug warranties cover defects in what we agreed to build, not new features.",
  "Custom solutions start with a consultation.",
] as const;

/**
 * What a visitor picked on the contact form, as one line for the inbox, the sheet and the database:
 * "HR management system, Standard (৳20,000)". Empty when nothing valid was picked.
 */
export function packageLabel(planId: string, tierId: string, region: Region): string {
  const plan = plans.find((p) => p.id === planId);
  if (!plan) return "";
  const tier = plan.id === "hr" ? hrTiers.find((t) => t.id === tierId) : undefined;
  const price = tier ? tier.price[region] : plan.price?.[region];
  return (tier ? `${plan.name}, ${tier.name}` : plan.name) + (price ? ` (${price})` : "");
}
