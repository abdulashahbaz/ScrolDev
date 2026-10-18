"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { AgentRoster } from "./agent-roster";
import { ConnectVisual } from "./connect-visual";
import { DescribeVisual } from "./describe-visual";
import { InsightsVisual } from "./insights-visual";
import { SuperviseVisual } from "./supervise-visual";

const VISUALS = {
  connect: ConnectVisual,
  describe: DescribeVisual,
  supervise: SuperviseVisual,
  agents: AgentRoster,
  insights: InsightsVisual,
};

// Lets server-rendered pages drop in an animated visual that starts playing
// once it scrolls into view.
export function InViewVisual({ name, className }: { name: keyof typeof VISUALS; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const Visual = VISUALS[name];
  return (
    <div ref={ref} className={className}>
      <Visual active={active} />
    </div>
  );
}
