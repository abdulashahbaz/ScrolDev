import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { Avatar } from "@/components/avatar";
import { Logo } from "@/components/logo";
import { caseStudies } from "@/content/customers";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Halvo workspace, or start free.",
};

export default function LoginPage() {
  const quote = caseStudies[2].quote;
  return (
    <main id="main" className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Halvo home">
            <Logo id="login-logo" />
          </Link>
          <Link href="/" className="group inline-flex items-center gap-1.5 text-sm text-mute hover:text-bone">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            Back to site
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-16">
          <Suspense fallback={<div className="h-[560px]" />}>
            <AuthForm />
          </Suspense>
        </div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-white/[0.07] bg-ink-900 lg:block">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(rgb(243_238_228/0.05)_1px,transparent_1px)] bg-[size:22px_22px]"
        />
        <div aria-hidden="true" className="absolute left-1/2 top-[18%] size-[560px] -translate-x-1/2">
          <div className="absolute -inset-[15%] rounded-full bg-[radial-gradient(closest-side,rgb(245_166_91/0.35),transparent)] blur-2xl" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,#c96a1f_0%,#f5a65b_86%,#fff0db_97%,#ffb36b_100%)]" />
          <div className="absolute inset-[1.2%] -translate-x-[2%] translate-y-[2%] rounded-full bg-ink-900" />
          <div className="absolute -inset-[10%] animate-spin-slow rounded-full border border-dashed border-white/[0.07]" />
        </div>
        <figure className="absolute inset-x-12 bottom-12">
          <blockquote className="font-serif text-[1.75rem] leading-[1.25] text-bone">“{quote.quote}”</blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <Avatar name={quote.name} hue={215} className="size-10 text-sm" />
            <span className="text-sm">
              <span className="block font-medium text-bone">{quote.name}</span>
              <span className="block text-mute">
                {quote.role}, {quote.company}
              </span>
            </span>
          </figcaption>
        </figure>
      </div>
    </main>
  );
}
