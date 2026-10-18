import type { Metadata } from "next";
import {
  Bell,
  Bot,
  Brain,
  Braces,
  ChartLine,
  Coins,
  FlaskConical,
  GitBranch,
  KeyRound,
  Layers,
  Network,
  ScrollText,
  ShieldCheck,
  Terminal,
  UserCheck,
  Webhook,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink } from "@/components/button";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { CodeSample } from "@/components/product/code-sample";
import { IntegrationDirectory } from "@/components/product/integration-directory";
import { SectionNav } from "@/components/product/section-nav";
import { Accent, SectionHeading } from "@/components/section-heading";
import { InViewVisual } from "@/components/visuals/in-view-visual";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Product",
  description: "Agents, workflows, controls and insights: one platform for every agent your operations run.",
};

const NAV = [
  { id: "agents", label: "Agents" },
  { id: "workflows", label: "Workflows" },
  { id: "controls", label: "Controls" },
  { id: "insights", label: "Insights" },
  { id: "developers", label: "Developers" },
  { id: "integrations", label: "Integrations" },
];

type Feature = { icon: LucideIcon; title: string; body: string };

const PILLARS: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  features: Feature[];
  visual: "agents" | "describe" | "supervise" | "insights";
}[] = [
  {
    id: "agents",
    eyebrow: "Agents",
    title: (
      <>
        Specialists that <Accent>finish</Accent> the work.
      </>
    ),
    body: "Each Halvo agent owns a job end to end: it reads from your systems, makes the call your policy describes, takes the action and writes down why.",
    features: [
      {
        icon: Bot,
        title: "Purpose-built roles",
        body: "Start from templates for reconciliation, refunds, routing and onboarding.",
      },
      {
        icon: Network,
        title: "Handoffs between agents",
        body: "Pass work across teams with the full context attached.",
      },
      { icon: Brain, title: "Scoped memory", body: "Agents recall prior decisions about the same account, visibly." },
      {
        icon: Layers,
        title: "Parallel by default",
        body: "Thousands of tasks at once, without queueing behind each other.",
      },
    ],
    visual: "agents",
  },
  {
    id: "workflows",
    eyebrow: "Workflows",
    title: (
      <>
        Write it like a memo. <Accent>Run it like code.</Accent>
      </>
    ),
    body: "Describe a process in plain English and Halvo compiles it into a workflow you can read, diff and version. No flowchart builder, no brittle rules engine.",
    features: [
      {
        icon: WandSparkles,
        title: "Plain-English instructions",
        body: "The way you'd brief a new hire, with your policies attached.",
      },
      {
        icon: GitBranch,
        title: "Versioned and diffable",
        body: "Every change is reviewed, attributed and reversible.",
      },
      {
        icon: FlaskConical,
        title: "Replay before release",
        body: "Test a change against last month's runs before it ships.",
      },
      { icon: Bell, title: "Any trigger", body: "Schedules, webhooks, new records, emails or a Slack message." },
    ],
    visual: "describe",
  },
  {
    id: "controls",
    eyebrow: "Controls",
    title: (
      <>
        Autonomy, <Accent>on your terms.</Accent>
      </>
    ),
    body: "Decide exactly what an agent may do alone, what it may do within a limit and what waits for a person. Loosen the rules one decision type at a time as the evidence comes in.",
    features: [
      {
        icon: UserCheck,
        title: "Approvals in Slack and email",
        body: "With evidence, a diff of the change and a confidence score.",
      },
      {
        icon: ShieldCheck,
        title: "Limits before every action",
        body: "Per action, per agent and per day. Breaches never run.",
      },
      {
        icon: ScrollText,
        title: "Complete audit trail",
        body: "Every input, decision and write, exportable for auditors.",
      },
      {
        icon: KeyRound,
        title: "Separation of duties",
        body: "Authors can't approve; agents can't approve themselves.",
      },
    ],
    visual: "supervise",
  },
  {
    id: "insights",
    eyebrow: "Insights",
    title: (
      <>
        Know what every agent <Accent>is worth.</Accent>
      </>
    ),
    body: "See volume, accuracy, cost and hours saved for every agent and every team, and the decisions behind any number with one click.",
    features: [
      {
        icon: ChartLine,
        title: "Outcome dashboards",
        body: "Hours saved and cost per task, by agent, team and workflow.",
      },
      {
        icon: FlaskConical,
        title: "Accuracy over time",
        body: "Evals scored on every run, with alerts on regressions.",
      },
      { icon: Coins, title: "Spend you can predict", body: "Cost per task, forecasts and hard monthly caps." },
      { icon: ScrollText, title: "Drill into any run", body: "From a chart to the exact decision and its evidence." },
    ],
    visual: "insights",
  },
];

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title={
          <>
            One platform for <Accent>every agent</Accent> your operations run.
          </>
        }
        body="Agents that do the work, workflows written in plain English, controls your auditors will like and the numbers to prove it's working."
        actions={
          <>
            <ButtonLink href="/contact" size="lg" arrow>
              Book a demo
            </ButtonLink>
            <ButtonLink href="/pricing" size="lg" variant="secondary">
              See pricing
            </ButtonLink>
          </>
        }
      />

      <SectionNav items={NAV} />

      {PILLARS.map((p, i) => (
        <section key={p.id} id={p.id} className="scroll-mt-32 border-b border-white/[0.06] py-24 sm:py-32">
          <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className={cn(i % 2 === 1 && "lg:order-2")}>
              <SectionHeading eyebrow={p.eyebrow} title={p.title} body={p.body} />
              <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {p.features.map((f, j) => (
                  <Reveal as="li" key={f.title} delay={j * 0.06}>
                    <f.icon className="size-5 text-ember" strokeWidth={1.6} aria-hidden="true" />
                    <h3 className="mt-3 text-[15px] font-medium text-bone">{f.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-mute">{f.body}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
            <Reveal className={cn("relative", i % 2 === 1 && "lg:order-1")}>
              <div className="relative grid min-h-[480px] place-items-center overflow-hidden rounded-[28px] border border-white/[0.08] bg-ink-900 p-5 sm:p-10">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(245_166_91/0.12),transparent),radial-gradient(rgb(243_238_228/0.06)_1px,transparent_1px)] bg-[size:auto,22px_22px]"
                />
                <InViewVisual name={p.visual} className="relative flex w-full justify-center" />
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <section id="developers" className="scroll-mt-32 border-b border-white/[0.06] py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Developers"
              title={
                <>
                  Everything in the app is <Accent>in the API.</Accent>
                </>
              }
              body="Build agents in code when you'd rather, wire Halvo into your own product, or extend it with custom tools. Typed, versioned and documented."
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {[
                { icon: Braces, title: "Typed SDKs", body: "TypeScript and Python, generated from one schema." },
                { icon: Webhook, title: "Webhooks", body: "Signed events for every run, approval and change." },
                { icon: Terminal, title: "CLI", body: "Deploy agents from CI with replay gates built in." },
                { icon: GitBranch, title: "Versioned API", body: "Dated versions. Nothing breaks without notice." },
              ].map((f) => (
                <li key={f.title} className="flex gap-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-ink-800 text-ember">
                    <f.icon className="size-4" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium text-bone">{f.title}</span>
                    <span className="mt-0.5 block text-[14px] leading-relaxed text-mute">{f.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Reveal>
            <CodeSample />
          </Reveal>
        </div>
      </section>

      <section id="integrations" className="scroll-mt-32 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Integrations"
            title={
              <>
                120+ connectors, <Accent>two-way.</Accent>
              </>
            }
            body="Read and write to the systems your teams already run, with scopes you choose per connector. A selection is below."
          />
          <div className="mt-12">
            <IntegrationDirectory />
          </div>
        </div>
      </section>

      <CtaSection title="See it run on" accent="your workflows." />
    </>
  );
}
