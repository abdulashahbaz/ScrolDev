"use client";

import { cn } from "@/lib/cn";

export function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("spotlight", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
