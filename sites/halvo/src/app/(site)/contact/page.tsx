import type { Metadata } from "next";
import { CalendarDays, Clock, Sparkles } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { ContactForm } from "@/components/contact-form";
import { FakeLogo } from "@/components/fake-logo";
import { Accent } from "@/components/section-heading";
import { caseStudies, logos } from "@/content/customers";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "See Halvo run on your own workflows in a 30-minute demo with a solutions engineer.",
};

const POINTS = [
  {
    icon: Clock,
    title: "30 minutes, no slides",
    body: "A solutions engineer builds an agent on one of your real workflows, live.",
  },
  {
    icon: Sparkles,
    title: "A tailored ROI model",
    body: "We'll size the hours and cost you'd save, using your volumes.",
  },
  {
    icon: CalendarDays,
    title: "A rollout plan",
    body: "Leave with the steps, owners and timeline to your first agent in production.",
  },
];

export default function ContactPage() {
  const quote = caseStudies[1].quote;
  return (
    <section className="relative overflow-hidden pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[520px] w-[900px] bg-[radial-gradient(50%_50%_at_50%_0%,rgb(245_166_91/0.16),transparent)]" />
      </div>
      <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="animate-fade-up">
          <p className="eyebrow flex items-center gap-2 text-ember">
            <span className="h-px w-5 bg-current opacity-60" aria-hidden="true" />
            Book a demo
          </p>
          <h1 className="display mt-6 text-[clamp(2.75rem,5.6vw,4.75rem)] text-bone">
            See Halvo run on <Accent>your workflows.</Accent>
          </h1>
          <ul className="mt-12 grid gap-7">
            {POINTS.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-ink-800 text-ember">
                  <p.icon className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[1.0625rem] font-medium text-bone">{p.title}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-mute">{p.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <figure className="mt-14 border-l-2 border-ember/40 pl-6">
            <blockquote className="font-serif text-[1.5rem] leading-[1.3] text-bone">“{quote.quote}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <Avatar name={quote.name} hue={160} className="size-9 text-xs" />
              <span className="text-sm">
                <span className="block font-medium text-bone">{quote.name}</span>
                <span className="block text-mute">
                  {quote.role}, {quote.company}
                </span>
              </span>
            </figcaption>
          </figure>
          <ul className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5 text-bone/55" aria-label="Customers">
            {logos.slice(0, 5).map((name) => (
              <li key={name}>
                <FakeLogo name={name} className="text-[0.9rem]" />
              </li>
            ))}
          </ul>
        </div>
        <div className="animate-fade-up [animation-delay:120ms]">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
