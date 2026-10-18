import Link from "next/link";
import { footerColumns, site, studio } from "@/content/site";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-ink-950">
      <div className="container-x pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr]">
          <div className="max-w-sm">
            <Logo id="footer-logo" />
            <p className="mt-5 text-sm leading-relaxed text-mute">{site.description}</p>
            <p className="mt-8 text-sm font-medium text-bone">Field notes, every other Thursday</p>
            <NewsletterForm />
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-dim">{col.title}</p>
                <ul className="mt-4 grid gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href + link.title}>
                      <Link href={link.href} className="text-sm text-mute transition-colors hover:text-bone">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.07] py-6 text-[13px] text-dim sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2 text-mute">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-mint text-mint" aria-hidden="true" />
              All systems operational
            </span>
            <span>
              © {new Date().getFullYear()} {site.legalName}
            </span>
          </div>
          <p>
            A concept site designed and built by{" "}
            {studio.url ? (
              <a
                href={studio.url}
                className="text-mute underline decoration-white/20 underline-offset-4 hover:text-bone"
              >
                {studio.name}
              </a>
            ) : (
              <span className="text-mute">{studio.name}</span>
            )}
            . Halvo, its customers and its numbers are fictional.
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none relative -mb-[0.2em] select-none overflow-hidden">
        <p className="text-center text-[27vw] font-semibold leading-[0.8] tracking-[-0.07em] bg-[linear-gradient(180deg,rgb(243_238_228/0.1),transparent_80%)] bg-clip-text text-transparent [-webkit-text-stroke:1px_rgb(243_238_228/0.07)]">
          halvo
        </p>
      </div>
    </footer>
  );
}
