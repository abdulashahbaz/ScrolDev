export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "What does a Halvo agent actually do?",
    a: "An agent finishes a piece of operational work end to end: it reads from your systems, makes the decision your policy describes, takes the action and logs why. Reconciling an invoice, issuing a refund or routing a lead are each one task.",
  },
  {
    q: "Can agents act without a human approving?",
    a: "Only where you allow it. Every action has a rule: run automatically, run within a limit, or wait for a named approver. Most teams start with approvals on everything and loosen them as the evals prove the agent out.",
  },
  {
    q: "Which models do you use? Can we bring our own?",
    a: "Halvo routes each step to the model that fits it best, from frontier models for judgment to small models for extraction. Enterprise customers can bring their own keys or point Halvo at a model running in their cloud.",
  },
  {
    q: "Is our data used to train models?",
    a: "No. Your data is never used to train Halvo's or any provider's models. We hold zero-retention agreements with every model provider we use, and you can see exactly which provider handled each step in the run log.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams connect their tools and run a first agent in an afternoon. Production rollouts, with approvals tuned and evals in place, typically take two to four weeks.",
  },
  {
    q: "What happens when an agent isn't sure?",
    a: "It stops and asks. Agents score their own confidence on every decision, and anything below your threshold goes to a person with the evidence and a recommended next step.",
  },
];

export const pricingFaqs: Faq[] = [
  {
    q: "What counts as a task?",
    a: "A task is one unit of finished work, such as one invoice reconciled, one ticket resolved or one lead routed. Reading data, retries and runs that end in a hand-off to a person are not billed.",
  },
  {
    q: "What happens if we go over our included tasks?",
    a: "Growth includes 2,500 tasks a month, then $0.40 per task, with volume discounts above 20,000. Agents never stop mid-month. You can set a hard monthly cap if you'd rather pause than pay overage.",
  },
  {
    q: "Is there a free trial of Growth?",
    a: "Yes. Growth is free for 14 days with no card required, and includes everything except the SOC 2 report, which we share under NDA once you're a customer.",
  },
  {
    q: "Do you offer discounts for startups or non-profits?",
    a: "Companies under 50 people that have raised less than $10M get 50% off Growth for the first year. Registered non-profits get 30% off any plan.",
  },
];
