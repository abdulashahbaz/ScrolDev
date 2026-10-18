"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { studio } from "@/content/site";
import { cn } from "@/lib/cn";

const TEAMS = ["Finance", "Support", "Revenue", "People", "Something else"];
const SIZES = ["1–50", "51–200", "201–1,000", "1,000+"];

const inputClass =
  "h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-[15px] text-bone placeholder:text-dim transition-colors focus:border-ember/60 focus:bg-white/[0.05] focus:outline-none aria-[invalid=true]:border-rose/60";

// A demo-request form. This is a concept site, so submitting shows the
// success state without sending anything anywhere.
export function ContactForm() {
  const [teams, setTeams] = useState<string[]>(["Finance"]);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (t: string) => setTeams((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get("name") ?? "").trim()) next.name = "Please add your name.";
    const email = String(data.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please use a valid work email.";
    if (!String(data.get("company") ?? "").trim()) next.company = "Please add your company.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus("sending");
    setTimeout(() => setStatus("done"), 900);
  };

  return (
    <div className="surface relative overflow-hidden rounded-[28px] p-6 sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[520px] flex-col items-center justify-center text-center"
            role="status"
          >
            <span className="grid size-14 place-items-center rounded-full bg-mint/15 text-mint">
              <Check className="size-6" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-bone">
              Thanks, that&apos;s everything we need.
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-mute">
              On a live site, a solutions engineer would reply within one business day. This is a {studio.name} concept,
              so nothing was sent.
            </p>
            {studio.url && (
              <a
                href={studio.url}
                className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink-950"
              >
                Want a site like this? <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            onSubmit={onSubmit}
            noValidate
            className="grid gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  className={inputClass}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </Field>
              <Field label="Work email" name="email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </Field>
              <Field label="Company" name="company" error={errors.company}>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  className={inputClass}
                  aria-invalid={!!errors.company}
                  aria-describedby={errors.company ? "company-error" : undefined}
                />
              </Field>
              <Field label="Company size" name="size">
                <select
                  id="size"
                  name="size"
                  defaultValue="51–200"
                  className={cn(
                    inputClass,
                    "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2016%2016%22%20fill=%22none%22%20stroke=%22%23a39f97%22%20stroke-width=%221.5%22%3E%3Cpath%20d=%22m4%206%204%204%204-4%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10",
                  )}
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s} className="bg-ink-900">
                      {s} people
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <fieldset>
              <legend className="text-[13px] text-mute">Which teams would use Halvo first?</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {TEAMS.map((t) => {
                  const on = teams.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(t)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors",
                        on ? "border-ember/40 bg-ember/10 text-ember" : "border-white/10 text-mute hover:text-bone",
                      )}
                    >
                      {on && <Check className="size-3.5" aria-hidden="true" />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Field label="What would you like to automate? (optional)" name="message">
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="We reconcile about 30,000 invoices a month across NetSuite and Stripe…"
                className={cn(inputClass, "h-auto resize-none py-3")}
              />
            </Field>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ember text-[15px] font-medium text-ink-950 transition-all duration-300 hover:bg-ember-2 hover:shadow-[0_10px_40px_-10px_rgb(245_166_91/0.8)] disabled:opacity-70"
            >
              {status === "sending" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Sending
                </>
              ) : (
                <>
                  Book my demo <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
            <p className="text-center text-[12px] leading-relaxed text-dim">
              Concept site: this form doesn&apos;t send or store anything.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[13px] text-mute">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-[12px] text-rose">
          {error}
        </p>
      )}
    </div>
  );
}
