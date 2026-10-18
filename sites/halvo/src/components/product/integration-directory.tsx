"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Search } from "lucide-react";
import { categories, integrations } from "@/content/integrations";
import { cn } from "@/lib/cn";

export function IntegrationDirectory() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = integrations.filter(
    (i) => (category === "All" || i.category === category) && (!q || i.name.toLowerCase().includes(q)),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label="Filter by category"
          className="-mx-5 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors",
                category === c ? "border-ember/40 bg-ember/10 text-ember" : "border-white/10 text-mute hover:text-bone",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 focus-within:border-ember/50 md:w-64">
          <Search className="size-4 text-dim" aria-hidden="true" />
          <span className="sr-only">Search integrations</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 120+ tools"
            className="min-w-0 flex-1 bg-transparent text-sm text-bone placeholder:text-dim focus:outline-none"
          />
        </label>
      </div>

      <motion.ul layout className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence initial={false}>
          {shown.map((i) => (
            <motion.li
              layout
              key={i.name}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="surface group flex items-center gap-3 rounded-2xl p-3.5 transition-colors hover:border-white/15"
            >
              <span
                className="grid size-10 shrink-0 place-items-center rounded-xl font-mono text-[12px] font-medium text-white/90"
                style={{ background: `linear-gradient(135deg, hsl(${i.hue} 45% 38%), hsl(${i.hue} 40% 22%))` }}
                aria-hidden="true"
              >
                {i.initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-medium text-bone">{i.name}</span>
                <span className="block text-[12px] text-dim">{i.category}</span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {shown.length === 0 && (
        <p className="mt-10 text-center text-sm text-mute">
          No match. Halvo&apos;s API and SDK connect to anything with an endpoint.
        </p>
      )}
    </div>
  );
}
