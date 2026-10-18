export type Plan = {
  id: "starter" | "growth" | "enterprise";
  name: string;
  blurb: string;
  monthly: number | null;
  annual: number | null;
  included: string;
  cta: { label: string; href: string };
  features: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    blurb: "For a team proving out its first agent.",
    monthly: 0,
    annual: 0,
    included: "100 tasks / month",
    cta: { label: "Start free", href: "/login?mode=signup" },
    features: [
      "2 agents",
      "Slack and email approvals",
      "30+ core integrations",
      "7-day run history",
      "Community support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    blurb: "For operations teams running agents every day.",
    monthly: 1500,
    annual: 1200,
    included: "2,500 tasks / month, then $0.40 each",
    cta: { label: "Start 14-day trial", href: "/login?mode=signup" },
    featured: true,
    features: [
      "Unlimited agents and workflows",
      "Approval routing rules",
      "Evals and run replay",
      "Spend guardrails per agent",
      "1-year audit log",
      "Google and Microsoft SSO",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    blurb: "For companies with security and scale requirements.",
    monthly: null,
    annual: null,
    included: "Volume pricing",
    cta: { label: "Talk to sales", href: "/contact" },
    features: [
      "SAML SSO and SCIM",
      "US and EU data residency",
      "Private cloud or VPC deployment",
      "Bring your own model keys",
      "Custom retention and DPA",
      "99.95% uptime SLA",
      "Dedicated success manager",
    ],
  },
];

export const OVERAGE_PER_TASK = 0.4;
export const GROWTH_INCLUDED = 2_500;

export type Row = { label: string; values: [string | boolean, string | boolean, string | boolean] };

export const comparison: { group: string; rows: Row[] }[] = [
  {
    group: "Agents and workflows",
    rows: [
      { label: "Tasks included each month", values: ["100", "2,500", "Custom"] },
      { label: "Agents", values: ["2", "Unlimited", "Unlimited"] },
      { label: "Plain-English workflow builder", values: [true, true, true] },
      { label: "Multi-agent handoffs", values: [false, true, true] },
      { label: "Evals and run replay", values: [false, true, true] },
      { label: "Bring your own model keys", values: [false, false, true] },
    ],
  },
  {
    group: "Controls",
    rows: [
      { label: "Slack and email approvals", values: [true, true, true] },
      { label: "Approval routing by amount or team", values: [false, true, true] },
      { label: "Spend guardrails", values: ["Workspace", "Per agent", "Per agent and action"] },
      { label: "Audit log retention", values: ["7 days", "1 year", "Custom"] },
    ],
  },
  {
    group: "Security and admin",
    rows: [
      { label: "SOC 2 Type II report", values: [false, true, true] },
      { label: "Google and Microsoft SSO", values: [false, true, true] },
      { label: "SAML SSO and SCIM", values: [false, false, true] },
      { label: "Data residency (US / EU)", values: ["US", "US", "US or EU"] },
      { label: "Private cloud or VPC", values: [false, false, true] },
    ],
  },
  {
    group: "Support",
    rows: [
      { label: "Support", values: ["Community", "Priority email", "Dedicated manager"] },
      { label: "Uptime SLA", values: [false, "99.9%", "99.95%"] },
      { label: "Onboarding", values: ["Self-serve", "Guided", "White-glove"] },
    ],
  },
];
