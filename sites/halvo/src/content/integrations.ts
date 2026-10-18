export type Integration = { name: string; category: Category; initials: string; hue: number };

export const categories = ["All", "Finance", "Support", "CRM", "Data", "Workplace", "People", "Engineering"] as const;
type Category = Exclude<(typeof categories)[number], "All">;

const list: [string, Category, number][] = [
  ["NetSuite", "Finance", 210],
  ["QuickBooks", "Finance", 140],
  ["Xero", "Finance", 195],
  ["Sage Intacct", "Finance", 120],
  ["Stripe", "Finance", 250],
  ["Ramp", "Finance", 60],
  ["Brex", "Finance", 20],
  ["Bill.com", "Finance", 30],
  ["Zendesk", "Support", 160],
  ["Intercom", "Support", 220],
  ["Front", "Support", 0],
  ["Gorgias", "Support", 280],
  ["Salesforce", "CRM", 200],
  ["HubSpot", "CRM", 15],
  ["Attio", "CRM", 240],
  ["Gong", "CRM", 270],
  ["Snowflake", "Data", 195],
  ["BigQuery", "Data", 215],
  ["Postgres", "Data", 225],
  ["Databricks", "Data", 10],
  ["Slack", "Workplace", 300],
  ["Google Workspace", "Workplace", 130],
  ["Microsoft 365", "Workplace", 20],
  ["Notion", "Workplace", 0],
  ["Workday", "People", 35],
  ["Rippling", "People", 45],
  ["Greenhouse", "People", 150],
  ["Okta", "People", 225],
  ["Jira", "Engineering", 220],
  ["Linear", "Engineering", 245],
  ["GitHub", "Engineering", 260],
  ["PagerDuty", "Engineering", 145],
];

export const integrations: Integration[] = list.map(([name, category, hue]) => ({
  name,
  category,
  hue,
  initials: name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
}));
