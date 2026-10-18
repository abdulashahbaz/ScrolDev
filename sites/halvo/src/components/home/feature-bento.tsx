import { Check, Cpu, Lock, ShieldAlert, Sparkles } from "lucide-react";
import { HalvoMark } from "../logo";
import { Reveal } from "../motion";
import { Accent, SectionHeading } from "../section-heading";
import { SpotlightCard } from "../spotlight-card";
import { cn } from "@/lib/cn";

export function FeatureBento() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Platform"
          title={
            <>
              Autonomy you can <Accent>audit.</Accent>
            </>
          }
          body="Every agent ships with the controls a careful operations leader would insist on. They're built into the platform, not bolted on afterwards."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card
            className="md:col-span-2"
            title="Approvals where you already work"
            body="Agents ask before they act on anything that matters, in Slack or email, with the evidence, the exact change and their confidence attached."
            visual={<ApprovalsVisual />}
            delay={0}
          />
          <Card
            title="An audit trail for every action"
            body="Inputs, decisions, approvals and writes, logged in plain English and exportable for your auditors."
            visual={<AuditVisual />}
            delay={0.08}
          />
          <Card
            title="Guardrails before every action"
            body="Hard limits per agent, per action and per day. A breach never runs; it pauses and pings the owner."
            visual={<GuardrailVisual />}
            delay={0}
          />
          <Card
            title="Evals on every change"
            body="Replay past runs against new instructions and block a deploy when accuracy drops."
            visual={<EvalsVisual />}
            delay={0.08}
          />
          <Card
            title="The right model for each step"
            body="Small models for extraction, frontier models for judgment, or your own keys in your own cloud."
            visual={<RoutingVisual />}
            delay={0.16}
          />
          <Card
            title="120+ integrations"
            body="Two-way connectors to finance, support, CRM, data and workplace tools, with scopes you control."
            visual={<IntegrationsVisual />}
            delay={0}
          />
          <Card
            className="lg:col-span-2"
            title="Security your CISO will sign off on"
            body="SOC 2 Type II and ISO 27001 certified. Data stays in the US or EU, and is never used to train any model."
            visual={<SecurityVisual />}
            delay={0.08}
          />
        </div>
      </div>
    </section>
  );
}

function Card({
  title,
  body,
  visual,
  className,
  delay,
}: {
  title: string;
  body: string;
  visual: React.ReactNode;
  className?: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <SpotlightCard className="group surface flex h-full flex-col overflow-hidden rounded-[24px]">
        <div className="relative h-[240px] overflow-hidden border-b border-white/[0.06]">{visual}</div>
        <div className="p-7">
          <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-bone">{title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-mute">{body}</p>
        </div>
      </SpotlightCard>
    </Reveal>
  );
}

function ApprovalsVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(70%_80%_at_50%_100%,rgb(245_166_91/0.1),transparent)] px-6">
      <div className="relative w-full max-w-[440px]">
        {/* Two cards stacked behind the main message. */}
        <div className="absolute inset-x-6 -top-3 h-full rounded-2xl border border-white/[0.06] bg-ink-800/60 transition-transform duration-700 ease-out-expo group-hover:-translate-y-2" />
        <div className="absolute inset-x-3 -top-1.5 h-full rounded-2xl border border-white/[0.07] bg-ink-800/80 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1" />
        <div className="relative rounded-2xl border border-white/10 bg-ink-800 p-4 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)] transition-transform duration-700 ease-out-expo group-hover:translate-y-1">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-ink-950">
              <HalvoMark id="bento-approvals" className="size-5" />
            </span>
            <p className="text-[13px] font-semibold text-bone">
              Halvo <span className="ml-1 rounded bg-white/10 px-1 py-px text-[9px] font-medium text-mute">APP</span>
            </p>
            <span className="text-[11px] text-dim">9:41 AM</span>
            <span className="ml-auto hidden rounded-full bg-ember/15 px-2 py-0.5 text-[10px] font-medium text-ember sm:inline">
              #support-approvals
            </span>
          </div>
          <p className="mt-3 text-[13px] text-bone">
            Refund of <span className="font-mono text-ember-2">$1,240</span> to Acme Health needs your approval.
          </p>
          <div className="mt-2 border-l-2 border-ember/40 pl-3 text-[12px] leading-relaxed text-mute">
            Order #88213 · Policy: 30-day refund window, exceeded by 4 days. Customer has 3 years of tenure and no prior
            refunds. Confidence 0.91.
          </div>
          <div className="mt-3.5 flex gap-2">
            <span className="rounded-md bg-mint px-3 py-1 text-[12px] font-semibold text-ink-950">Approve</span>
            <span className="rounded-md border border-white/10 px-3 py-1 text-[12px] text-bone">Edit amount</span>
            <span className="rounded-md border border-white/10 px-3 py-1 text-[12px] text-mute">Reject</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const AUDIT = [
  ["07:41:26", "maya.chen", "approved", "run_4812"],
  ["07:41:27", "agent.recon", "posted", "JE-30417"],
  ["07:43:02", "agent.support", "refunded", "$84.00"],
  ["07:43:09", "agent.support", "replied", "T-55120"],
  ["07:44:51", "agent.revops", "assigned", "lead_9921"],
  ["07:45:13", "dan.okafor", "edited", "policy v8"],
  ["07:46:40", "agent.people", "granted", "okta:sales"],
  ["07:47:05", "agent.recon", "flagged", "INV-21004"],
];

function AuditVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden px-5 [mask-image:linear-gradient(180deg,transparent,#000_25%,#000_75%,transparent)]">
      <div className="animate-marquee-y [--marquee-duration:22s] group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="grid gap-2 pb-2 font-mono text-[11px]">
            {AUDIT.map(([time, who, verb, obj]) => (
              <li
                key={time + copy}
                className="grid grid-cols-[56px_1fr_auto] items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2"
              >
                <span className="text-dim">{time}</span>
                <span className="truncate text-mute">
                  <span className={who.startsWith("agent") ? "text-sky" : "text-ember-2"}>{who}</span> {verb}
                </span>
                <span className="text-bone/80">{obj}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function GuardrailVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-4 px-6">
      <div>
        <div className="flex items-baseline justify-between text-[12px]">
          <span className="text-mute">Per-ticket refund limit</span>
          <span className="font-mono text-bone">$2,000</span>
        </div>
        <div className="relative mt-3 flex h-7 gap-[3px]">
          {Array.from({ length: 24 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 rounded-[3px] transition-colors duration-500",
                i < 15 ? "bg-ember/70" : i < 20 ? "bg-white/10 group-hover:bg-ember/40" : "bg-white/[0.05]",
              )}
              style={{ transitionDelay: `${(i - 15) * 40}ms` }}
            />
          ))}
          <span className="absolute -top-1 bottom-[-4px] left-[83%] w-px bg-rose" aria-hidden="true" />
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-rose/20 bg-rose/[0.06] px-3.5 py-2.5">
        <ShieldAlert className="size-4 shrink-0 text-rose" aria-hidden="true" />
        <p className="text-[12px] leading-snug text-bone">
          Blocked: refund of <span className="font-mono">$2,600</span>
          <span className="block text-mute">Exceeds limit. Paused and sent to Dan Okafor.</span>
        </p>
      </div>
    </div>
  );
}

function EvalsVisual() {
  const bars = [54, 61, 58, 66, 70, 68, 75, 79, 77, 84, 88, 93];
  return (
    <div className="absolute inset-0 flex flex-col justify-end px-6 pb-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[11px] text-dim">ACCURACY · RECON v14</p>
          <p className="mt-1 text-[2.5rem] font-medium leading-none tracking-[-0.04em] text-bone">98.6%</p>
        </div>
        <span className="rounded-full bg-mint/10 px-2 py-0.5 font-mono text-[11px] text-mint">+2.1 vs v13</span>
      </div>
      <div className="mt-5 flex h-20 items-end gap-1.5" aria-hidden="true">
        {bars.map((h, i) => (
          <span
            key={i}
            className={cn(
              "flex-1 origin-bottom rounded-t-[4px] transition-transform duration-700 ease-out-expo group-hover:scale-y-105",
              i === bars.length - 1 ? "bg-gradient-to-t from-mint/40 to-mint" : "bg-white/[0.09]",
            )}
            style={{ height: `${h}%`, transitionDelay: `${i * 25}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function RoutingVisual() {
  const rows = [
    { step: "Extract fields", model: "Small model", meta: "120ms", icon: Cpu },
    { step: "Judge a dispute", model: "Frontier model", meta: "2.1s", icon: Sparkles },
    { step: "Redact PII", model: "Your VPC", meta: "on-prem", icon: Lock },
  ];
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2.5 px-6">
      {rows.map((r, i) => (
        <div key={r.step} className="flex items-center gap-2 text-[12px]">
          <span className="w-[118px] shrink-0 whitespace-nowrap rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2 text-mute">
            {r.step}
          </span>
          <span className="relative h-px flex-1 bg-white/10">
            <span
              className="absolute -top-[2px] size-[5px] rounded-full bg-ember shadow-[0_0_10px_2px_rgb(245_166_91/0.6)] [animation:route_2.4s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          </span>
          <span className="flex w-[132px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/10 bg-ink-800 px-2.5 py-2 text-bone">
            <r.icon className="size-3.5 text-ember" aria-hidden="true" />
            {r.model}
          </span>
        </div>
      ))}
      <style>{`@keyframes route{0%{left:0;opacity:0}15%{opacity:1}85%{opacity:1}100%{left:calc(100% - 5px);opacity:0}}`}</style>
    </div>
  );
}

const TILES = ["NS", "St", "Zd", "Sf", "Sl", "", "Hs", "Sn", "Ic", "Wd", "Jr", "Ok"];

function IntegrationsVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="grid grid-cols-4 gap-2.5">
        {TILES.map((t, i) =>
          t ? (
            <span
              key={i}
              className="grid size-12 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.025] font-mono text-[12px] text-mute transition-all duration-500 ease-out-expo group-hover:border-white/15 group-hover:text-bone"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {t}
            </span>
          ) : (
            <span
              key={i}
              className="grid size-12 place-items-center rounded-xl border border-ember/30 bg-ink-800 shadow-[0_0_30px_-4px_rgb(245_166_91/0.45)]"
            >
              <HalvoMark id="bento-integrations" className="size-6" />
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function SecurityVisual() {
  const seals = ["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"];
  const checks = [
    "Zero retention with model providers",
    "US or EU data residency",
    "SAML SSO and SCIM",
    "Annual third-party pentest",
  ];
  return (
    <div className="absolute inset-0 flex items-center gap-8 px-8">
      <div className="hidden grid-cols-2 gap-3 sm:grid md:hidden lg:grid">
        {seals.map((s, i) => (
          <span
            key={s}
            className="grid size-[88px] place-items-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.06),transparent_60%)] p-2 text-center text-[11px] font-medium leading-tight text-bone/85 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <span>
              <Lock className="mx-auto mb-1 size-3.5 text-ember" aria-hidden="true" />
              {s}
            </span>
          </span>
        ))}
      </div>
      <ul className="grid flex-1 gap-2.5">
        {checks.map((c) => (
          <li
            key={c}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[13px] text-bone"
          >
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mint/15 text-mint">
              <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            </span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
