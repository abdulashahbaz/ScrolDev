export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export type CaseStudy = {
  slug: string;
  company: string;
  industry: string;
  size: string;
  team: "Finance" | "Support" | "Revenue" | "People";
  headline: string;
  summary: string;
  metrics: { value: string; label: string }[];
  quote: Testimonial;
  challenge: string[];
  solution: { title: string; body: string }[];
  results: string[];
  stack: string[];
  hue: number;
};

// Fictional companies, used as "customers" across the concept site.
export const logos = [
  "Northpeak",
  "Lumio",
  "Copperline",
  "Brightwater",
  "Fernhill",
  "Quantra",
  "Ridgeway",
  "Oakline",
  "Marlowe",
  "Sable & Co",
] as const;

export type LogoName = (typeof logos)[number];

export const caseStudies: CaseStudy[] = [
  {
    slug: "northpeak",
    company: "Northpeak",
    industry: "Freight marketplace",
    size: "1,400 employees",
    team: "Finance",
    headline: "Northpeak closes the books in three days, not nine.",
    summary:
      "Northpeak's finance team was reconciling 30,000 carrier invoices a month by hand. Halvo agents now match, flag and draft adjustments overnight, and the controller signs off in the morning.",
    metrics: [
      { value: "3 days", label: "Month-end close, down from 9" },
      { value: "$1.8M", label: "Billing errors recovered in year one" },
      { value: "82%", label: "Invoices matched with no human touch" },
    ],
    quote: {
      quote:
        "Close used to eat the first two weeks of every month. Now the agents reconcile overnight and nothing posts without my sign-off. My team finally does analysis instead of data entry.",
      name: "Maya Chen",
      role: "Corporate Controller",
      company: "Northpeak",
    },
    challenge: [
      "Northpeak moves freight for 9,000 shippers across 40,000 independent carriers. Every load generates an invoice, a payout and, too often, a dispute.",
      "Eleven people spent most of the month copying numbers between NetSuite, Stripe and a shared spreadsheet that nobody trusted. Close took nine working days, and auditors flagged the manual process two years running.",
    ],
    solution: [
      {
        title: "A reconciliation agent that runs every night",
        body: "The agent pulls invoices from NetSuite and payouts from Stripe, matches them line by line, and explains every mismatch in plain English with links to the source records.",
      },
      {
        title: "Approvals routed by amount",
        body: "Adjustments under $500 post automatically within policy. Anything larger lands in the controller's Slack with the full context and a one-click approve.",
      },
      {
        title: "An audit trail the auditors asked to keep",
        body: "Every action, input and approval is logged and exportable. Northpeak's auditors now sample from the Halvo log instead of asking for screenshots.",
      },
    ],
    results: [
      "Close dropped from nine working days to three within two quarters.",
      "The team recovered $1.8M in duplicate and mis-rated invoices in the first year.",
      "Three analysts moved from data entry to carrier pricing work.",
    ],
    stack: ["NetSuite", "Stripe", "Slack", "Snowflake"],
    hue: 28,
  },
  {
    slug: "lumio",
    company: "Lumio",
    industry: "Consumer health",
    size: "600 employees",
    team: "Support",
    headline: "Lumio resolves 71% of support tickets before a human opens them.",
    summary:
      "Lumio's subscription app serves 2.3 million members. Halvo agents handle refunds, plan changes and account fixes inside policy, and hand the hard cases to people with the work already done.",
    metrics: [
      { value: "71%", label: "Tickets resolved end to end by agents" },
      { value: "40 sec", label: "Median first response, from 4 hours" },
      { value: "4.8 / 5", label: "CSAT on agent-resolved tickets" },
    ],
    quote: {
      quote:
        "We expected a chatbot. We got a teammate that issues refunds within policy, escalates the strange ones and writes a better internal note than most of us do.",
      name: "Daniel Okafor",
      role: "VP, Member Experience",
      company: "Lumio",
    },
    challenge: [
      "January is Lumio's busiest month: new-year sign-ups triple ticket volume overnight. The team was hiring seasonal contractors who needed weeks of training to handle billing safely.",
      "Most tickets were simple, but each one touched three systems. Agents were spending more time switching tabs than talking to members.",
    ],
    solution: [
      {
        title: "Refunds and plan changes, within policy",
        body: "The support agent reads the ticket, checks the member's history in Stripe and the app database, and applies Lumio's refund policy exactly as written.",
      },
      {
        title: "Escalations that arrive solved",
        body: "When a case needs judgment, the agent hands it over with a summary, the evidence and a recommended action, so a person can resolve it in one click.",
      },
      {
        title: "Guardrails on every dollar",
        body: "Per-ticket and daily refund limits mean the agent can never exceed what a senior support lead could approve.",
      },
    ],
    results: [
      "71% of tickets are now resolved without a person opening them.",
      "Median first response fell from four hours to forty seconds.",
      "Lumio handled its January peak with no seasonal hires.",
    ],
    stack: ["Zendesk", "Stripe", "Postgres", "Slack"],
    hue: 160,
  },
  {
    slug: "copperline",
    company: "Copperline",
    industry: "B2B payments",
    size: "350 employees",
    team: "Revenue",
    headline: "Copperline routes every inbound lead in under two minutes.",
    summary:
      "Copperline's sales team was losing deals to slow follow-up. A Halvo revenue agent now enriches, scores and routes every lead, and keeps Salesforce clean while it does.",
    metrics: [
      { value: "2 min", label: "Speed to lead, from 3 hours" },
      { value: "+23%", label: "Qualified pipeline in two quarters" },
      { value: "0", label: "Territory disputes since launch" },
    ],
    quote: {
      quote:
        "Every lead is enriched, scored and routed before a rep has refreshed the page. Our reps stopped arguing about territories because the agent shows its work.",
      name: "Priya Raman",
      role: "Head of Revenue Operations",
      company: "Copperline",
    },
    challenge: [
      "Inbound leads sat in a queue while one RevOps manager enriched and assigned them by hand. Hot leads went cold, and duplicates crept into Salesforce every week.",
      "Routing rules lived in a 40-tab spreadsheet. When territories changed, nobody could say which leads had been assigned under the old rules.",
    ],
    solution: [
      {
        title: "Enrichment and scoring on arrival",
        body: "The agent researches each company, fills the missing fields and scores fit against Copperline's ideal customer profile.",
      },
      {
        title: "Routing rules in plain English",
        body: "Territories are described in a sentence each. The agent applies them, explains every assignment and flags edge cases for review.",
      },
      {
        title: "A CRM that stays clean",
        body: "Duplicates are merged, stale records closed out and every change logged, so pipeline reports are finally trusted.",
      },
    ],
    results: [
      "Median speed to lead dropped from three hours to two minutes.",
      "Qualified pipeline grew 23% in two quarters with the same team.",
      "Duplicate records in Salesforce fell by 94%.",
    ],
    stack: ["Salesforce", "HubSpot", "Clearbit", "Slack"],
    hue: 215,
  },
];

export const testimonials: Testimonial[] = [
  caseStudies[0].quote,
  caseStudies[1].quote,
  caseStudies[2].quote,
  {
    quote:
      "The audit trail sold our security team in one meeting. They had never seen an AI vendor answer the question before they asked it.",
    name: "Tomás Alvarez",
    role: "Chief Operating Officer",
    company: "Brightwater",
  },
  {
    quote:
      "We shipped our first agent in an afternoon. By the end of the quarter we had nine, and the approvals queue is how our managers start the day.",
    name: "Hannah Lindqvist",
    role: "Finance Operations Lead",
    company: "Fernhill",
  },
  {
    quote:
      "The SDK is the best-designed API we integrated this year. Typed, versioned and honest about what it will and won't do.",
    name: "Sam Whitaker",
    role: "CTO",
    company: "Quantra",
  },
];
