import type { Metadata } from "next";
import { ButtonLink } from "@/components/button";
import { CtaSection } from "@/components/cta-section";
import { Faq } from "@/components/faq";
import { PageHero } from "@/components/page-hero";
import { ComparisonTable } from "@/components/pricing/comparison-table";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { RoiCalculator } from "@/components/pricing/roi-calculator";
import { Reveal } from "@/components/motion";
import { Accent, SectionHeading } from "@/components/section-heading";
import { pricingFaqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Start free, pay for the work agents finish, and scale with volume pricing on Enterprise.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        align="center"
        eyebrow="Pricing"
        title={
          <>
            Pay for the work, <Accent>not the seats.</Accent>
          </>
        }
        body="Every plan includes unlimited users. You pay for tasks agents finish, never for retries, reads or hand-offs to people."
        className="pb-10 sm:pb-14"
      />

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <PricingPlans />
          <p className="mt-8 text-center text-[13px] text-dim">
            Prices in USD. Startups under $10M raised get 50% off Growth for a year.
          </p>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <Reveal>
            <RoiCalculator />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Compare plans"
            title={
              <>
                Everything, <Accent>side by side.</Accent>
              </>
            }
          />
          <Reveal className="mt-14">
            <ComparisonTable />
          </Reveal>
          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[28px] border border-white/[0.08] bg-ink-900 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h3 className="text-xl font-medium tracking-[-0.02em] text-bone">
                Running more than 50,000 tasks a month?
              </h3>
              <p className="mt-2 max-w-xl text-[15px] text-mute">
                Enterprise brings volume pricing, private deployment and a dedicated team. Most contracts are signed
                within three weeks.
              </p>
            </div>
            <ButtonLink href="/contact" arrow>
              Talk to sales
            </ButtonLink>
          </div>
        </div>
      </section>

      <Faq
        items={pricingFaqs}
        title={
          <>
            Pricing <Accent>questions.</Accent>
          </>
        }
      />
      <CtaSection />
    </>
  );
}
