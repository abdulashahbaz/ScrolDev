import type { Metadata } from "next";
import { Brain, Bug, Database, Globe, KeyRound, Lock, ServerCog, ShieldCheck, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Accent, SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";

export const metadata: Metadata = {
  title: "Security",
  description: "SOC 2 Type II, ISO 27001, US and EU data residency, and AI safeguards built into every Halvo agent.",
};

const CERTS = [
  { name: "SOC 2 Type II", note: "Audited annually" },
  { name: "ISO 27001", note: "Certified since 2025" },
  { name: "GDPR", note: "DPA available" },
  { name: "HIPAA", note: "BAA on Enterprise" },
];

const AREAS: { icon: LucideIcon; title: string; items: string[] }[] = [
  {
    icon: Brain,
    title: "AI safeguards",
    items: [
      "Your data never trains any model, ours or a provider's",
      "Zero-retention agreements with every model provider",
      "Tool calls run in sandboxes with scoped credentials",
      "Prompt-injection screening on all untrusted inputs",
    ],
  },
  {
    icon: Lock,
    title: "Data protection",
    items: [
      "AES-256 encryption at rest, TLS 1.3 in transit",
      "Per-tenant encryption keys",
      "Customer-managed keys on Enterprise",
      "Configurable retention, down to zero",
    ],
  },
  {
    icon: KeyRound,
    title: "Access control",
    items: [
      "SAML SSO and SCIM provisioning",
      "Role-based access with least privilege",
      "Separation of duties enforced by the platform",
      "Session and approval-link expiry",
    ],
  },
  {
    icon: ServerCog,
    title: "Infrastructure",
    items: [
      "Isolated tenants on AWS",
      "Private cloud and VPC deployment",
      "Continuous vulnerability scanning",
      "Encrypted, tested backups every hour",
    ],
  },
  {
    icon: Globe,
    title: "Data residency",
    items: [
      "US region in Virginia and Oregon",
      "EU region in Frankfurt and Dublin",
      "Model traffic pinned to your region",
      "No data leaves the region you choose",
    ],
  },
  {
    icon: Database,
    title: "Auditability",
    items: [
      "Immutable log of every action and approval",
      "Export to your SIEM in real time",
      "Versioned agent instructions",
      "Evidence attached to every decision",
    ],
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title={
          <>
            Trust is <Accent>the product.</Accent>
          </>
        }
        body="An agent is only useful if you can trust what it touches. Security, privacy and auditability are designed into Halvo from the first line of code."
        actions={
          <>
            <ButtonLink href="/contact" size="lg" arrow>
              Request the SOC 2 report
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Talk to our security team
            </ButtonLink>
          </>
        }
      />

      <section aria-label="Certifications" className="pb-20">
        <div className="container-x grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CERTS.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.06}>
              <div className="surface flex items-center gap-4 rounded-[22px] p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-ember/25 bg-ember/[0.07] text-ember">
                  <ShieldCheck className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[15px] font-medium text-bone">{c.name}</span>
                  <span className="block text-[13px] text-mute">{c.note}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="How we protect you"
            title={
              <>
                Defense in depth, <Accent>by default.</Accent>
              </>
            }
          />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.06}>
                <SpotlightCard className="surface h-full rounded-[24px] p-7">
                  <a.icon className="size-6 text-ember" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-6 text-lg font-medium tracking-[-0.015em] text-bone">{a.title}</h3>
                  <ul className="mt-4 grid gap-2.5">
                    {a.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[14px] leading-relaxed text-mute">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-ember/70" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-20">
        <div className="container-x">
          <div className="flex flex-col gap-6 rounded-[28px] border border-white/[0.08] bg-ink-900 p-8 sm:flex-row sm:items-center sm:p-10">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-ink-800 text-ember">
              <Bug className="size-5" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h2 className="text-xl font-medium tracking-[-0.02em] text-bone">Responsible disclosure</h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-mute">
                Found a vulnerability? Write to security@halvo.example. We respond within one business day, never pursue
                good-faith research, and pay bounties for valid reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        title="Security review"
        accent="in one meeting."
        body="Bring your security team to a demo. We'll walk through architecture, controls and our latest audit report."
      />
    </>
  );
}
