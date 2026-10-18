import { cn } from "@/lib/cn";
import { ButtonLink } from "../button";
import { HalvoMark } from "../logo";
import { Reveal } from "../motion";
import { Accent, SectionHeading } from "../section-heading";

const RINGS = [
  { inset: "28%", duration: 70, reverse: false, items: ["Slack", "Stripe", "NetSuite"] },
  { inset: "14%", duration: 100, reverse: true, items: ["Salesforce", "Zendesk", "Snowflake", "Okta", "HubSpot"] },
  {
    inset: "0%",
    duration: 140,
    reverse: false,
    items: ["QuickBooks", "Workday", "Notion", "Gong", "Greenhouse", "Intercom", "Jira"],
  },
];

// Integrations orbiting the Halvo mark. Each ring spins; each chip spins the
// other way at the same speed so its label stays upright.
export function IntegrationsOrbit() {
  return (
    <section id="integrations" className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="Integrations"
          title={
            <>
              Works with the tools <Accent>you already run.</Accent>
            </>
          }
          body="Two-way connectors for 120+ finance, support, CRM, data and workplace tools. For everything else there's a typed API and SDK."
        />

        <Reveal className="relative mx-auto mt-10 aspect-square w-[min(100%,660px)] sm:mt-14">
          <div
            aria-hidden="true"
            className="absolute inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgb(245_166_91/0.35),transparent)] blur-2xl"
          />
          {RINGS.map((ring, r) => (
            <div
              key={r}
              className="absolute rounded-full border border-white/[0.07]"
              style={{
                inset: ring.inset,
                animation: `orbit ${ring.duration}s linear infinite${ring.reverse ? " reverse" : ""}`,
              }}
            >
              {ring.items.map((name, i) => {
                const angle = (i / ring.items.length) * 2 * Math.PI + r * 0.9;
                return (
                  <div
                    key={name}
                    className={cn("absolute -translate-x-1/2 -translate-y-1/2", r === 2 && "max-sm:hidden")}
                    style={{ left: `${50 + 50 * Math.sin(angle)}%`, top: `${50 - 50 * Math.cos(angle)}%` }}
                  >
                    <div
                      style={{ animation: `orbit ${ring.duration}s linear infinite${ring.reverse ? "" : " reverse"}` }}
                      className="whitespace-nowrap rounded-full border border-white/10 bg-ink-850/95 px-2.5 py-1 text-[11px] text-bone/85 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.8)] backdrop-blur sm:px-3.5 sm:py-1.5 sm:text-[13px]"
                    >
                      {name}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span
              className="absolute inset-0 -m-3 animate-ping rounded-[30px] border border-ember/20 [animation-duration:3s]"
              aria-hidden="true"
            />
            <span className="relative grid size-20 place-items-center rounded-[26px] border border-white/10 bg-ink-800 shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_0_60px_-10px_rgb(245_166_91/0.6)] sm:size-24">
              <HalvoMark id="orbit-mark" className="size-10 sm:size-12" />
            </span>
          </div>
        </Reveal>

        <div className="mt-6 flex justify-center">
          <ButtonLink href="/product#integrations" variant="secondary" arrow>
            Browse all integrations
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
