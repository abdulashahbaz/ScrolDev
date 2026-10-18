"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, KeyRound, MailCheck } from "lucide-react";
import { cn } from "@/lib/cn";

// Log in and sign up share one form. Concept site: nothing is submitted.
export function AuthForm() {
  const params = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(params.get("mode") === "signup" ? "signup" : "login");
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-ember/15 text-ember">
          <MailCheck className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-bone">Check your inbox</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-mute">
          On a live site we&apos;d have sent a sign-in link to <span className="text-bone">{sentTo}</span>. This is a
          concept, so no email is on its way.
        </p>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="mt-8 text-sm text-mute underline underline-offset-4 hover:text-bone"
        >
          Use a different email
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      <div role="tablist" aria-label="Account" className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "relative z-10 flex-1 rounded-full py-2 text-sm transition-colors",
              mode === m ? "text-ink-950" : "text-mute hover:text-bone",
            )}
          >
            {mode === m && (
              <motion.span
                layoutId="auth-pill"
                className="absolute inset-0 -z-10 rounded-full bg-bone"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            {m === "login" ? "Log in" : "Start free"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="mt-10 text-[2rem] font-medium leading-tight tracking-[-0.04em] text-bone">
            {mode === "login" ? "Welcome back" : "Ship your first agent today"}
          </h1>
          <p className="mt-2 text-[15px] text-mute">
            {mode === "login" ? "Log in to your Halvo workspace." : "Free for 14 days. No card required."}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 grid gap-2.5">
        {[
          { label: "Continue with Google", mark: "G" },
          { label: "Continue with Microsoft", mark: "M" },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => setSentTo("your account")}
            className="flex h-11 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] text-sm text-bone transition-colors hover:bg-white/[0.07]"
          >
            <span
              className="grid size-5 place-items-center rounded-full bg-bone text-[10px] font-bold text-ink-950"
              aria-hidden="true"
            >
              {b.mark}
            </span>
            {b.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSentTo("your identity provider")}
          className="flex h-11 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] text-sm text-bone transition-colors hover:bg-white/[0.07]"
        >
          <KeyRound className="size-4 text-mute" aria-hidden="true" />
          Continue with SAML SSO
        </button>
      </div>

      <div className="my-7 flex items-center gap-4 text-[12px] text-dim">
        <span className="h-px flex-1 bg-white/10" />
        or with email
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = String(new FormData(e.currentTarget).get("email") ?? "");
          setSentTo(email);
        }}
        className="grid gap-3"
      >
        <label htmlFor="auth-email" className="sr-only">
          Work email
        </label>
        <input
          id="auth-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="h-11 rounded-full border border-white/10 bg-white/[0.03] px-5 text-[15px] text-bone placeholder:text-dim focus:border-ember/60 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ember text-sm font-medium text-ink-950 transition-colors hover:bg-ember-2"
        >
          {mode === "login" ? "Email me a sign-in link" : "Create my workspace"}{" "}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] leading-relaxed text-dim">
        By continuing you agree to the{" "}
        <Link href="/legal#terms" className="text-mute underline underline-offset-4 hover:text-bone">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/legal#privacy" className="text-mute underline underline-offset-4 hover:text-bone">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
