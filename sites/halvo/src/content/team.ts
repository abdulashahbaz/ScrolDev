export type Person = { name: string; role: string; bio: string; hue: number };

export const team: Person[] = [
  {
    name: "Elena Vasquez",
    role: "Co-founder & CEO",
    bio: "Ran finance operations at two payments companies before deciding the work should run itself.",
    hue: 24,
  },
  {
    name: "Jonah Park",
    role: "Co-founder & CTO",
    bio: "Built the workflow engine behind a large logistics platform. Writes the hardest code at Halvo.",
    hue: 210,
  },
  {
    name: "Amara Osei",
    role: "Head of Design",
    bio: "Designs the moments where people and agents share the work, so trust is earned, not assumed.",
    hue: 330,
  },
  {
    name: "Felix Brandt",
    role: "Head of Engineering, Agents",
    bio: "Leads the team that makes agents fast, cheap and right more often than people expect.",
    hue: 150,
  },
  {
    name: "Noor Haddad",
    role: "Head of Security",
    bio: "Previously led security for a healthcare data platform. Reads every DPA we sign.",
    hue: 265,
  },
  {
    name: "Liam O'Connell",
    role: "Head of Customer Success",
    bio: "Has helped more than 200 operations teams ship their first agent.",
    hue: 45,
  },
  {
    name: "Sofia Marin",
    role: "Applied AI Research",
    bio: "Works on evals and confidence scoring, the reason agents know when to ask.",
    hue: 185,
  },
  {
    name: "Kenji Watanabe",
    role: "Product",
    bio: "Spends half his week inside customers' ops teams, and it shows in the roadmap.",
    hue: 5,
  },
];

export const values = [
  {
    title: "Earn the autonomy",
    body: "Agents start supervised and get more freedom only as the evidence says they've earned it. The same goes for us.",
  },
  {
    title: "Show the work",
    body: "Every decision an agent makes comes with its reasons. If we can't explain it, we don't ship it.",
  },
  {
    title: "Give people their week back",
    body: "We measure ourselves in hours returned to the teams that use Halvo, not in seats or tokens.",
  },
  {
    title: "Boring where it counts",
    body: "Security, uptime and billing should be predictable. We save the ambition for the product.",
  },
];

export const milestones = [
  {
    year: "2023",
    title: "Started in a finance team",
    body: "Elena and Jonah spend a month-end close shadowing an AP team and count 1,100 copy-and-paste actions.",
  },
  {
    year: "2024",
    title: "First agent in production",
    body: "A reconciliation agent goes live at Northpeak. It runs every night and hasn't missed one since.",
  },
  { year: "2025", title: "Series A and SOC 2", body: "We raise $28M, pass SOC 2 Type II and open our London office." },
  {
    year: "2026",
    title: "Agents 2.0",
    body: "Agents start handing work to each other. Customers now run 38 million tasks a month on Halvo.",
  },
];

export const investors = ["Saltmarsh Ventures", "Cinder Capital", "Long Field Partners", "Kiteline", "Harbor & Pine"];

export const roles = [
  { title: "Senior Software Engineer, Agent Runtime", team: "Engineering", location: "San Francisco or Remote (US)" },
  { title: "Staff Engineer, Integrations", team: "Engineering", location: "London or Remote (EU)" },
  { title: "Product Designer, Approvals", team: "Design", location: "San Francisco" },
  { title: "Research Engineer, Evals", team: "Applied AI", location: "Remote" },
  { title: "Solutions Engineer, Finance", team: "Customer Success", location: "New York" },
  { title: "Security Engineer", team: "Security", location: "London" },
];
