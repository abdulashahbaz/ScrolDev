import { ButtonLink } from "@/components/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="relative grid min-h-[86svh] place-items-center overflow-hidden px-5 pb-20 pt-32 text-center"
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-[min(90vw,620px)] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="absolute inset-0 animate-spin-slower rounded-full border border-white/[0.06]" />
          <div className="absolute inset-[14%] animate-spin-slow rounded-full border border-dashed border-white/[0.08] [animation-direction:reverse]" />
          <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgb(245_166_91/0.25),transparent)] blur-xl" />
        </div>
        <div className="relative">
          <p className="font-mono text-sm text-ember">404</p>
          <h1 className="display mt-6 text-[clamp(3rem,9vw,7rem)] text-bone">
            Lost in <em className="font-serif font-normal text-ember-gradient">orbit.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-mute">
            This page drifted out of range. Even our agents couldn&apos;t find it.
          </p>
          <div className="mt-9 flex justify-center">
            <ButtonLink href="/" size="lg" arrow>
              Back to home
            </ButtonLink>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
