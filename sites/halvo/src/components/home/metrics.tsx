import { CountUp, Reveal } from "../motion";

const METRICS = [
  { value: "38M+", label: "Tasks run by Halvo agents every month" },
  { value: "94%", label: "Finished without a person stepping in" },
  { value: "6.5 hrs", label: "Returned to each teammate, every week" },
  { value: "99.98%", label: "Platform uptime over the last 12 months" },
];

export function Metrics() {
  return (
    <section aria-label="Halvo by the numbers" className="relative overflow-hidden border-y border-white/[0.06]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(50%_120%_at_50%_120%,rgb(245_166_91/0.12),transparent)]"
      />
      <div className="container-x relative grid grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m, i) => (
          <Reveal
            key={m.label}
            delay={i * 0.08}
            className="border-white/[0.06] px-1 py-12 sm:px-6 sm:py-16 [&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-r max-lg:[&:nth-child(-n+2)]:border-b"
          >
            <p className="text-[clamp(2.5rem,5vw,4.25rem)] font-medium leading-none tracking-[-0.05em] text-bone">
              <CountUp value={m.value} />
            </p>
            <p className="mt-4 max-w-[22ch] text-sm leading-relaxed text-mute">{m.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
