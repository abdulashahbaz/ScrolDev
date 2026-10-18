import { faqs } from "@/content/faqs";
import { CtaSection } from "@/components/cta-section";
import { Faq } from "@/components/faq";
import { FeatureBento } from "@/components/home/feature-bento";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { IntegrationsOrbit } from "@/components/home/integrations-orbit";
import { LogoCloud } from "@/components/home/logo-cloud";
import { Metrics } from "@/components/home/metrics";
import { Statement } from "@/components/home/statement";
import { Testimonials } from "@/components/home/testimonials";
import { UseCases } from "@/components/home/use-cases";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <Statement />
      <HowItWorks />
      <FeatureBento />
      <UseCases />
      <Metrics />
      <div className="py-12 sm:py-16">
        <Testimonials />
      </div>
      <IntegrationsOrbit />
      <Faq items={faqs} />
      <CtaSection />
    </>
  );
}
