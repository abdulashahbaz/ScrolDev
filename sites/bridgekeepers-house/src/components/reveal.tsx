"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Fades [data-reveal] elements in as they enter the viewport. The hidden
// starting state only applies under html.js, so content never depends on JS.
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
