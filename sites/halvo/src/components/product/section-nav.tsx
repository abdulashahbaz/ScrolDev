"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

// A sticky row of anchor links that highlights the section in view.
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    // Above the first section, highlight the first link.
    const first = document.getElementById(items[0]?.id);
    const onScroll = () => {
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.4) setActive(items[0].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-30 border-y border-white/[0.06] bg-ink-950/80 backdrop-blur-xl"
    >
      <ul className="container-x flex gap-1 overflow-x-auto py-2.5 [scrollbar-width:none]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "block whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition-colors",
                active === item.id ? "bg-white/[0.07] text-bone" : "text-mute hover:text-bone",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
