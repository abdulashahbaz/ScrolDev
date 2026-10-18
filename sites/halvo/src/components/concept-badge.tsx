"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { studio } from "@/content/site";

const KEY = "halvo-concept-badge-dismissed";

// A small, honest label: this is a ScrolDev concept, not a real company.
// When `studio.url` is set it doubles as the way back to the studio.
// It shrinks to a single dot while the visitor scrolls down, so it never
// sits on top of the content for long.
export function ConceptBadge() {
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (dismissed) return;
    const t = setTimeout(() => setVisible(true), 1400);
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 24) return;
      setCompact(y > last && y > 400);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-label="About this site"
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setCompact(false)}
          onFocus={() => setCompact(false)}
          className="fixed bottom-4 left-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-1 overflow-hidden rounded-full border border-white/10 bg-ink-900/85 p-1 text-[13px] shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)] backdrop-blur-xl"
        >
          <motion.button
            layout="position"
            type="button"
            onClick={() => setCompact((c) => !c)}
            aria-label={compact ? "About this site" : "Collapse"}
            aria-expanded={!compact}
            className="grid size-6 shrink-0 place-items-center rounded-full bg-bone text-[11px] font-bold text-ink-950"
          >
            S
          </motion.button>
          {!compact && (
            <motion.div
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex min-w-0 items-center gap-1"
            >
              <span className="truncate px-1.5 text-mute">
                A <span className="text-bone">{studio.name}</span> concept
              </span>
              {studio.url && (
                <a
                  href={studio.url}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/[0.06] px-3 py-1 text-bone transition-colors hover:bg-white/[0.12]"
                >
                  Get a site like this <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              )}
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="grid size-6 shrink-0 place-items-center rounded-full text-dim transition-colors hover:text-bone"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
