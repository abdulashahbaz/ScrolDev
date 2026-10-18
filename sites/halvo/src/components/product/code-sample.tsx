// A TypeScript SDK snippet with hand-tuned highlighting (no runtime highlighter).
const k = "text-[#ff9b6b]"; // keyword
const s = "text-mint"; // string
const f = "text-sky"; // function
const c = "text-dim italic"; // comment
const n = "text-ember-2"; // number

export function CodeSample() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-bone">recon.ts</span>
        <span className="font-mono text-[11px] text-dim">@halvo/sdk</span>
        <span className="ml-auto rounded-full bg-mint/10 px-2 py-0.5 font-mono text-[10px] text-mint">typed</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.75] text-bone/90" tabIndex={0}>
        <code>
          <span className={k}>import</span> {"{ "}Halvo{" }"} <span className={k}>from</span>{" "}
          <span className={s}>&quot;@halvo/sdk&quot;</span>;{"\n"}
          {"\n"}
          <span className={k}>const</span> halvo = <span className={k}>new</span> <span className={f}>Halvo</span>(
          {"{ "}apiKey: process.env.HALVO_KEY{" }"});{"\n"}
          {"\n"}
          <span className={c}>{"// Describe the work; Halvo compiles it into a versioned workflow."}</span>
          {"\n"}
          <span className={k}>const</span> recon = <span className={k}>await</span> halvo.agents.
          <span className={f}>create</span>({"{"}
          {"\n"}
          {"  "}name: <span className={s}>&quot;Recon&quot;</span>,{"\n"}
          {"  "}instructions: <span className={s}>&quot;Match NetSuite invoices to Stripe payouts...&quot;</span>,{"\n"}
          {"  "}connectors: [<span className={s}>&quot;netsuite&quot;</span>,{" "}
          <span className={s}>&quot;stripe&quot;</span>],{"\n"}
          {"  "}schedule: <span className={s}>&quot;0 2 * * *&quot;</span>,{"\n"}
          {"  "}approvals: [{"{ "}when: <span className={s}>&quot;total &gt; 5000&quot;</span>, approver:{" "}
          <span className={s}>&quot;maya@northpeak.com&quot;</span>
          {" }"}],{"\n"}
          {"  "}limits: {"{ "}perAction: <span className={n}>5_000</span>, perDay: <span className={n}>50_000</span>
          {" }"},{"\n"}
          {"}"});{"\n"}
          {"\n"}
          <span className={c}>{"// Replay last month's runs before shipping a change."}</span>
          {"\n"}
          <span className={k}>const</span> report = <span className={k}>await</span> recon.
          <span className={f}>replay</span>({"{ "}since: <span className={s}>&quot;30d&quot;</span>
          {" }"});{"\n"}
          console.<span className={f}>log</span>(report.accuracy); <span className={c}>{"// 0.986"}</span>
        </code>
      </pre>
    </div>
  );
}
