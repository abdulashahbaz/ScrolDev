import type { Metadata } from "next";
import { CoverArt } from "@/components/cover-art";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Accent } from "@/components/section-heading";
import { releases, type ChangeTag } from "@/content/changelog";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Changelog",
  description: "New features, improvements and fixes in Halvo, shipped every two weeks.",
};

const TAG_STYLES: Record<ChangeTag, string> = {
  New: "border-ember/30 bg-ember/10 text-ember",
  Improved: "border-sky/25 bg-sky/10 text-sky",
  Fixed: "border-mint/25 bg-mint/10 text-mint",
};

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title={
          <>
            New in Halvo, <Accent>every two weeks.</Accent>
          </>
        }
        body="Everything we've shipped, newest first. Subscribe to field notes in the footer to get it in your inbox."
      />

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <ol className="relative">
            {releases.map((r, i) => (
              <li
                key={r.version}
                className="grid gap-6 border-t border-white/[0.07] py-14 md:grid-cols-[220px_1fr] md:gap-12"
              >
                <div className="md:sticky md:top-28 md:self-start">
                  <time dateTime={r.date} className="text-[15px] text-bone">
                    {formatDate(r.date)}
                  </time>
                  <p className="mt-1 font-mono text-[12px] text-dim">v{r.version}</p>
                </div>
                <Reveal className="max-w-2xl">
                  {r.highlight && (
                    <div className="relative mb-8 aspect-[16/7] overflow-hidden rounded-[24px] border border-white/[0.08]">
                      <CoverArt hue={28} seed={i + 7} className="absolute inset-0" />
                      <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                        <p className="font-serif text-[clamp(2rem,4vw,3rem)] italic leading-none text-bone">
                          Agents 2.0
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-medium", TAG_STYLES[t])}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-4 text-[clamp(1.5rem,2.6vw,2rem)] font-medium tracking-[-0.03em] text-bone">
                    {r.title}
                  </h2>
                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-mute">{r.summary}</p>
                  <ul className="mt-6 grid gap-3">
                    {r.items.map((item) => (
                      <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-bone/85">
                        <span className="mt-2.5 size-1 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
