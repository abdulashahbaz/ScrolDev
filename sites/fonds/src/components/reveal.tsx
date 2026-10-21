import { m, type HTMLMotionProps } from "motion/react";

const ease = [0.25, 0.1, 0.25, 1] as const;

// Entry animation shared by the overlaid UI: fade in, optionally rising 12px.
export function Reveal({ delay = 0, rise = true, ...props }: HTMLMotionProps<"div"> & { delay?: number; rise?: boolean }) {
  return (
    <m.div
      initial={{ opacity: 0, ...(rise && { y: 12 }) }}
      animate={{ opacity: 1, ...(rise && { y: 0 }) }}
      transition={{ duration: 0.6, ease, delay }}
      {...props}
    />
  );
}
