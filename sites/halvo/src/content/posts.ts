export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Product" | "Field notes" | "Engineering";
  date: string;
  readingTime: string;
  author: { name: string; role: string; hue: number };
  hue: number;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "agents-need-a-signature",
    title: "Autonomous agents still need a signature",
    excerpt:
      "The fastest way to get AI agents into production isn't more autonomy. It's a better approval layer, and here's how we designed ours.",
    category: "Product",
    date: "2026-10-09",
    readingTime: "6 min read",
    author: { name: "Amara Osei", role: "Head of Design", hue: 330 },
    hue: 28,
    body: [
      {
        type: "p",
        text: "Every operations leader we talk to wants the same two things from AI agents, and they pull in opposite directions. They want the work to happen without them. And they want to know, at any moment, exactly what happened and why.",
      },
      {
        type: "p",
        text: "Most agent products resolve that tension by picking a side. Either the agent asks permission for everything, and nobody saves any time, or it acts on its own, and nobody trusts it with anything that matters. We think both are wrong, and the fix is a better approval layer rather than a smarter agent.",
      },
      { type: "h2", text: "Approvals are a product, not a modal" },
      {
        type: "p",
        text: "An approval request is the moment a person and an agent share responsibility. If it arrives without context, the approver either rubber-stamps it or re-does the work to check it. Both defeat the point.",
      },
      {
        type: "p",
        text: "So every Halvo approval carries three things: the evidence the agent used, a diff of exactly what will change, and the agent's own confidence score. An approver should be able to say yes or no in under ten seconds, and they should be right.",
      },
      {
        type: "quote",
        text: "If the approver has to open another tab, the approval has failed.",
        cite: "Our internal design principle",
      },
      { type: "h2", text: "Autonomy is earned, one rule at a time" },
      {
        type: "p",
        text: "Teams start with approvals on everything. As evals show an agent getting a class of decision right, they loosen the rule for that class only: refunds under $150, say, or invoice matches within a cent. The agent's freedom grows exactly as fast as the evidence does.",
      },
      {
        type: "list",
        items: [
          "Run automatically: low-risk, high-confidence actions.",
          "Run within a limit: anything with a dollar amount or a daily cap.",
          "Wait for a named approver: everything else, routed by amount, team or customer tier.",
        ],
      },
      { type: "h2", text: "What we learned shipping it" },
      {
        type: "p",
        text: "The surprise was how much approvers liked the queue. Managers at Fernhill now start their day in it, because it's the clearest view they've ever had of what their operation is doing. The approval layer turned out to be the dashboard.",
      },
    ],
  },
  {
    slug: "guardrails-auditors-love",
    title: "Designing guardrails your auditors will love",
    excerpt:
      "Auditors don't hate AI. They hate evidence they can't sample. A field guide to controls that pass review the first time.",
    category: "Field notes",
    date: "2026-09-18",
    readingTime: "8 min read",
    author: { name: "Noor Haddad", role: "Head of Security", hue: 265 },
    hue: 265,
    body: [
      {
        type: "p",
        text: "The first question an auditor asks about an AI agent is rarely about the model. It's the same question they ask about any control: show me how you know it worked.",
      },
      {
        type: "p",
        text: "Over the last year we've sat in on more than forty audit and security reviews with customers. The teams that passed quickly all had the same four things in place before the auditor arrived.",
      },
      { type: "h2", text: "1. Limits that apply before the action" },
      {
        type: "p",
        text: "A guardrail that alerts you after an agent overspends is a report, not a control. Halvo checks every limit before an action is taken, and an action that would breach one never runs.",
      },
      { type: "h2", text: "2. A log that someone outside the team can read" },
      {
        type: "p",
        text: "Every run in Halvo produces a log of inputs, decisions, actions and approvals, written in plain English with links to the source records. Auditors can sample it directly, and several of our customers' auditors now ask for it by name.",
      },
      { type: "h2", text: "3. Separation of duties, enforced by the system" },
      {
        type: "p",
        text: "The person who writes an agent's instructions can't approve its actions, and the agent can't approve its own. These aren't conventions; they're rules the platform enforces.",
      },
      { type: "h2", text: "4. Change control for instructions" },
      {
        type: "list",
        items: [
          "Every change to an agent's instructions is versioned and attributed.",
          "Changes are replayed against past runs before they ship.",
          "Deploys are blocked when accuracy drops below the threshold you set.",
        ],
      },
      {
        type: "quote",
        text: "They had never seen an AI vendor answer the question before they asked it.",
        cite: "Tomás Alvarez, COO, Brightwater",
      },
      {
        type: "p",
        text: "None of this is exotic. It's the same discipline finance teams already apply to people. The difference is that with agents, the system can enforce it every single time.",
      },
    ],
  },
  {
    slug: "inside-agents-2",
    title: "Inside Agents 2.0: handoffs, memory and a 3x faster runtime",
    excerpt:
      "How we rebuilt the agent runtime so agents can pass work to each other, remember what they've done and finish it faster.",
    category: "Engineering",
    date: "2026-10-07",
    readingTime: "10 min read",
    author: { name: "Felix Brandt", role: "Head of Engineering, Agents", hue: 150 },
    hue: 150,
    body: [
      {
        type: "p",
        text: "Agents 2.0 is the biggest change to Halvo's runtime since we launched. Three things changed: agents can now hand work to each other, they remember context across runs, and the same work finishes in a third of the time.",
      },
      { type: "h2", text: "Handoffs" },
      {
        type: "p",
        text: "Real operational work crosses team lines. A refund request turns out to be a billing dispute; a new hire needs a laptop and a payroll record. In 1.x, an agent that hit the edge of its job had to stop and wait for a person.",
      },
      {
        type: "p",
        text: "Now it can hand the work to the agent that owns the next step, along with everything it learned. Each handoff is a logged event with its own approvals, so the chain of responsibility stays intact.",
      },
      { type: "h2", text: "Memory" },
      {
        type: "p",
        text: "Agents now recall prior decisions about the same customer, vendor or account. Memory is scoped, versioned and visible: you can see exactly what an agent remembered and why it used it, and delete any entry.",
      },
      { type: "h2", text: "A faster runtime" },
      {
        type: "list",
        items: [
          "Independent tool calls now run in parallel instead of in sequence.",
          "Each step is routed to the smallest model that passes its evals.",
          "Reads from connected systems are cached for the length of a run.",
        ],
      },
      {
        type: "p",
        text: "Together these cut median run time by 3.1x and cost per task by 40%, with no change in accuracy on our eval suite. Every existing agent was upgraded automatically, with run replay confirming identical decisions before the switch.",
      },
      {
        type: "quote",
        text: "The fastest agent is the one that doesn't wait for a person when it doesn't need to, and always does when it should.",
        cite: "Felix Brandt",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
