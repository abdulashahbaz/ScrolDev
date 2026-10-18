export type ChangeTag = "New" | "Improved" | "Fixed";

export type Release = {
  version: string;
  date: string;
  title: string;
  summary: string;
  tags: ChangeTag[];
  items: string[];
  highlight?: boolean;
};

export const releases: Release[] = [
  {
    version: "2.0",
    date: "2026-10-07",
    title: "Halvo Agents 2.0",
    summary:
      "Agents can now hand work to each other, remember context across runs and finish the same work three times faster.",
    tags: ["New", "Improved"],
    highlight: true,
    items: [
      "Multi-agent handoffs: a support agent can pass a billing dispute to the finance agent with the full context.",
      "Run memory: agents recall prior decisions on the same customer, vendor or account.",
      "Median run time is down 3.1x thanks to parallel tool calls and smarter model routing.",
      "A redesigned run view that shows each decision, its evidence and its confidence score.",
    ],
  },
  {
    version: "1.14",
    date: "2026-09-23",
    title: "Approval routing rules",
    summary: "Route approvals by amount, department, vendor or customer tier, with fallbacks when an approver is away.",
    tags: ["New"],
    items: [
      "Rules can chain: anything over $10,000 goes to the controller, then the CFO.",
      "Out-of-office fallbacks pick up calendar status from Google and Microsoft 365.",
      "Approvers can delegate for a date range from Slack.",
    ],
  },
  {
    version: "1.13",
    date: "2026-09-09",
    title: "EU data residency",
    summary: "Enterprise workspaces can now keep all data, logs and model traffic inside the EU.",
    tags: ["New"],
    items: [
      "Hosted in Frankfurt with failover in Dublin.",
      "Model traffic routed only to EU-hosted endpoints.",
      "Existing workspaces can migrate with no downtime.",
    ],
  },
  {
    version: "1.12",
    date: "2026-08-26",
    title: "Evals and run replay",
    summary: "Replay any past run against new instructions before you ship a change to production.",
    tags: ["New", "Improved"],
    items: [
      "Pick a set of past runs and see exactly which decisions would change.",
      "Score agents against golden answers you mark in the run log.",
      "Block a deploy automatically when accuracy drops below your threshold.",
    ],
  },
  {
    version: "1.11",
    date: "2026-08-12",
    title: "NetSuite and Sage Intacct connectors",
    summary: "Native two-way connectors for the two ERPs our finance customers asked for most.",
    tags: ["New"],
    items: [
      "Read and write journal entries, bills, vendors and custom records.",
      "Respects your existing NetSuite roles and approval workflows.",
      "Sync runs incrementally, every five minutes.",
    ],
  },
  {
    version: "1.10",
    date: "2026-07-29",
    title: "Spend guardrails",
    summary: "Set hard limits on what each agent can spend, refund or approve, per action and per day.",
    tags: ["New"],
    items: [
      "Limits apply before an action is taken, never after.",
      "Breaches pause the agent and alert its owner in Slack.",
      "Fixed: daily limits now reset in the workspace's time zone, not UTC.",
    ],
  },
  {
    version: "1.9",
    date: "2026-07-15",
    title: "Approvals in Slack, with full context",
    summary: "Approve, reject or edit an agent's proposed action without leaving Slack.",
    tags: ["Improved", "Fixed"],
    items: [
      "Approval messages now include the evidence, a diff of the change and the agent's confidence.",
      "Edit the proposed amount or reply before approving.",
      "Fixed an issue where approvals in shared channels showed the wrong approver.",
    ],
  },
  {
    version: "1.8",
    date: "2026-06-30",
    title: "SCIM provisioning",
    summary: "Provision and deprovision Halvo users automatically from Okta, Entra ID and OneLogin.",
    tags: ["New"],
    items: [
      "Groups map to Halvo roles, so access follows your identity provider.",
      "Deprovisioned users lose access immediately, including open approval links.",
    ],
  },
];
