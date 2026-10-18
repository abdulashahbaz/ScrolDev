"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="mt-3 inline-flex items-center gap-2 text-sm text-mint" role="status">
        <Check className="size-4" aria-hidden="true" /> You&apos;re on the list.
      </p>
    );
  }

  return (
    <form
      className="mt-3 flex max-w-sm items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 focus-within:border-ember/50"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Work email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@company.com"
        autoComplete="email"
        className="h-9 min-w-0 flex-1 bg-transparent px-3.5 text-sm text-bone placeholder:text-dim focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-bone text-ink-950 transition-transform hover:scale-105"
      >
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}
