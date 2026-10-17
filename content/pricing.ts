/**
 * International pricing, in USD, shown on /pricing.
 *
 * These are starting prices. Every project is scoped first and gets its own quote.
 * There are no Tk prices on the site: local clients get those directly.
 * Internal quoting ranges for custom work are deliberately NOT kept here (this repository is public).
 */

/** The four main packages. `id` is passed to the contact form so we know which one a visitor asked about. */
export type Plan = {
  id: string;
  name: string;
  /** Who it suits, as one short line. */
  for: string;
  /** "From $199", or null when the work is quoted. */
  price: string | null;
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
    price: "$199",
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
    price: "$449",
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
    price: "$749",
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
    name: "Basic",
    price: "$749",
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
    name: "Standard",
    price: "$1,249",
    lead: "Everything in Basic, plus",
    items: [
      "Monthly payroll worksheets",
      "Configurable allowances and deductions",
      "Leave balance tracking",
      "PDF payslip generation",
    ],
  },
  {
    name: "Enterprise",
    price: "$2,499+",
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
export const addOns = [
  { name: "SEO optimization", price: "$49.50 to $99.50" },
  { name: "Security hardening and basic testing", price: "$74.50 to $149.50" },
  { name: "Order automation", price: "$149.50 to $299.50" },
  { name: "Website maintenance", price: "$24.50 to $49.50 a month" },
  { name: "E-commerce maintenance", price: "$49.50 to $99.50 a month" },
  { name: "HR system support", price: "$74.50 to $149.50 a month" },
  { name: "Additional feature development", price: "$15 to $22.50 an hour" },
] as const;

/** The small print, shown under the packages. */
export const pricingNotes = [
  "Prices are starting estimates in USD.",
  "The final price depends on the scope and what you need.",
  "Hosting, domains, third-party subscriptions and payment processing fees are extra unless your proposal includes them.",
  "Bug warranties cover defects in what we agreed to build, not new features.",
  "Custom solutions start with a consultation.",
] as const;

/** The line the contact form starts with when a visitor comes from a package's button. */
export function planMessage(id: string | null): string {
  const plan = plans.find((p) => p.id === id);
  if (!plan) return "";
  return plan.price
    ? `I’m interested in the ${plan.name} package (from ${plan.price}). `
    : `I’d like a quote for a custom solution. `;
}
