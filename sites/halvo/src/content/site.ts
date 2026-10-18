// Halvo is a fictional company: a ScrolDev concept site. Everything on it
// (customers, people, numbers) is invented to show what the site can do.

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: "Halvo",
  legalName: "Halvo Labs, Inc.",
  tagline: "AI agents for operations teams",
  description:
    "Halvo deploys AI agents across finance, support and revenue operations, with the approvals, audit trails and guardrails your team needs to trust them.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000"),
  email: "hello@halvo.example",
};

// The studio that designed and built this concept. The badge and footer
// credit link here, so set `url` to the ScrolDev hub once it is live.
export const studio = {
  name: "ScrolDev",
  url: "",
};

export type NavLink = { title: string; href: string; description?: string };

export const productLinks: NavLink[] = [
  { title: "Agents", href: "/product#agents", description: "Specialists that finish the work end to end" },
  { title: "Workflows", href: "/product#workflows", description: "Describe a process in plain English" },
  { title: "Controls", href: "/product#controls", description: "Approvals, guardrails and spend limits" },
  { title: "Insights", href: "/product#insights", description: "Every run, cost and outcome in one place" },
  { title: "Integrations", href: "/product#integrations", description: "120+ connectors to the tools you run" },
  { title: "Security", href: "/security", description: "SOC 2 Type II, SSO, data residency" },
];

export const solutionLinks: NavLink[] = [
  { title: "Finance", href: "/solutions/finance", description: "Reconciliation, AP and month-end close" },
  { title: "Support", href: "/solutions/support", description: "Refunds, triage and account changes" },
  { title: "Revenue", href: "/solutions/revenue", description: "Lead routing, enrichment and CRM hygiene" },
  { title: "People", href: "/solutions/people", description: "Onboarding, access and HR requests" },
];

export const resourceLinks: NavLink[] = [
  { title: "Blog", href: "/blog", description: "Field notes on running ops with agents" },
  { title: "Changelog", href: "/changelog", description: "What we shipped, every two weeks" },
  { title: "Company", href: "/company", description: "Our story, team and open roles" },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { title: "Overview", href: "/product" },
      { title: "Pricing", href: "/pricing" },
      { title: "Integrations", href: "/product#integrations" },
      { title: "Security", href: "/security" },
      { title: "Changelog", href: "/changelog" },
    ],
  },
  { title: "Solutions", links: solutionLinks.map(({ title, href }) => ({ title, href })) },
  {
    title: "Company",
    links: [
      { title: "About", href: "/company" },
      { title: "Customers", href: "/customers" },
      { title: "Careers", href: "/company#careers" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "Blog", href: "/blog" },
      { title: "Book a demo", href: "/contact" },
      { title: "Log in", href: "/login" },
      { title: "Legal", href: "/legal" },
    ],
  },
];
