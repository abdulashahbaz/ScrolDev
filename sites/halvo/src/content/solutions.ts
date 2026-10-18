export type Solution = {
  slug: "finance" | "support" | "revenue" | "people";
  name: string;
  headline: string;
  accent: string;
  summary: string;
  tasks: { title: string; body: string }[];
  flow: { trigger: string; steps: string[]; approval: string; outcome: string };
  metrics: { value: string; label: string }[];
  integrations: string[];
  caseStudy?: string;
};

export const solutions: Solution[] = [
  {
    slug: "finance",
    name: "Finance",
    headline: "Close the books in days,",
    accent: "not weeks.",
    summary:
      "Agents reconcile invoices, chase missing receipts and draft journal entries overnight. Your controller reviews the exceptions and signs off in the morning.",
    tasks: [
      {
        title: "Invoice reconciliation",
        body: "Match invoices to payments and payouts line by line, and explain every mismatch.",
      },
      { title: "Accounts payable", body: "Code bills, check them against POs and route them for approval by amount." },
      { title: "Expense review", body: "Chase missing receipts, flag out-of-policy spend and summarise for managers." },
      { title: "Month-end close", body: "Run accruals, prepare reconciliations and keep the close checklist moving." },
    ],
    flow: {
      trigger: "214 new invoices in NetSuite",
      steps: ["Match against Stripe payouts", "Flag 5 mismatches over $500", "Draft adjusting entries"],
      approval: "Controller approves in Slack",
      outcome: "5 journal entries posted",
    },
    metrics: [
      { value: "67%", label: "Faster month-end close" },
      { value: "82%", label: "Invoices matched automatically" },
      { value: "$1.8M", label: "Errors recovered (Northpeak)" },
    ],
    integrations: ["NetSuite", "QuickBooks", "Sage Intacct", "Xero", "Stripe", "Ramp", "Brex", "Bill.com"],
    caseStudy: "northpeak",
  },
  {
    slug: "support",
    name: "Support",
    headline: "Resolve the ticket,",
    accent: "not just reply to it.",
    summary:
      "Agents issue refunds, change plans and fix accounts inside your policy, then hand the hard cases to people with the research already done.",
    tasks: [
      { title: "Refunds and credits", body: "Apply your refund policy exactly, with per-ticket and daily limits." },
      { title: "Account changes", body: "Upgrade, downgrade, pause or transfer accounts across billing and product." },
      { title: "Triage and routing", body: "Tag, prioritise and route tickets to the right queue with a summary." },
      { title: "Escalation prep", body: "Hand over hard cases with evidence, history and a recommended action." },
    ],
    flow: {
      trigger: "Refund request in Zendesk",
      steps: ["Check order history in Stripe", "Apply 30-day refund policy", "Draft reply to the customer"],
      approval: "Auto-approved under $150",
      outcome: "Refund issued, ticket solved",
    },
    metrics: [
      { value: "71%", label: "Tickets resolved by agents" },
      { value: "40s", label: "Median first response" },
      { value: "4.8", label: "CSAT on agent-resolved tickets" },
    ],
    integrations: ["Zendesk", "Intercom", "Front", "Salesforce Service", "Stripe", "Shopify", "Postgres", "Slack"],
    caseStudy: "lumio",
  },
  {
    slug: "revenue",
    name: "Revenue",
    headline: "Every lead routed",
    accent: "in under two minutes.",
    summary:
      "Agents enrich, score and route inbound leads, keep your CRM clean and prepare reps for every call, with the reasoning shown on every record.",
    tasks: [
      {
        title: "Lead enrichment",
        body: "Research each company and fill firmographics, tech stack and buying signals.",
      },
      {
        title: "Scoring and routing",
        body: "Score fit against your ICP and assign by territory rules written in plain English.",
      },
      { title: "CRM hygiene", body: "Merge duplicates, close stale opportunities and fix missing fields every night." },
      { title: "Call prep", body: "Brief reps before every meeting with account history and open questions." },
    ],
    flow: {
      trigger: "Demo request from the website",
      steps: ["Enrich company and contact", "Score against ICP: 87/100", "Match territory: EMEA mid-market"],
      approval: "No approval needed",
      outcome: "Assigned to Lena, meeting booked",
    },
    metrics: [
      { value: "2 min", label: "Speed to lead" },
      { value: "+23%", label: "Qualified pipeline" },
      { value: "94%", label: "Fewer duplicate records" },
    ],
    integrations: ["Salesforce", "HubSpot", "Clearbit", "Apollo", "Gong", "Outreach", "LinkedIn Sales Nav", "Slack"],
    caseStudy: "copperline",
  },
  {
    slug: "people",
    name: "People",
    headline: "Day-one ready,",
    accent: "every time.",
    summary:
      "Agents provision accounts, answer policy questions and keep onboarding on schedule, so your people team spends its time on people.",
    tasks: [
      {
        title: "Onboarding",
        body: "Create accounts, order equipment and schedule first-week sessions from one hire event.",
      },
      { title: "Access requests", body: "Grant and revoke app access by role, with manager approval and a full log." },
      {
        title: "Policy questions",
        body: "Answer leave, benefits and expense questions from your handbook, with citations.",
      },
      { title: "Offboarding", body: "Revoke access everywhere within the hour and collect equipment on schedule." },
    ],
    flow: {
      trigger: "Offer signed in Greenhouse",
      steps: ["Create Google and Slack accounts", "Order laptop through the IT portal", "Schedule first-week sessions"],
      approval: "Manager confirms start date",
      outcome: "New hire ready for day one",
    },
    metrics: [
      { value: "4 hrs", label: "Saved per new hire" },
      { value: "100%", label: "Access revoked within an hour" },
      { value: "9 in 10", label: "Policy questions answered instantly" },
    ],
    integrations: [
      "Workday",
      "Rippling",
      "BambooHR",
      "Greenhouse",
      "Okta",
      "Google Workspace",
      "Jira Service",
      "Slack",
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
