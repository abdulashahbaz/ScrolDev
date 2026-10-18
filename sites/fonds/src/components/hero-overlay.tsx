import type { Ref } from "react";
import { brand, caption, collection, nav, symbols } from "../content/site";
import { LogoMark } from "./logo-mark";
import { Reveal } from "./reveal";

// Fixed UI over the video and the gallery. Every piece uses mix-blend-mode
// exclusion so it reads on the video, the black panel and the white outro alike.
const layer = "pointer-events-none fixed z-20 mix-blend-exclusion";
const type = "font-medium tracking-[-0.04em] text-white";

export function Logo() {
  return (
    <Reveal className={`${layer} top-4 left-4 w-[124px] sm:top-8 sm:left-8 sm:w-[266px] lg:w-[355px]`}>
      <h1>
        <LogoMark className="block h-auto w-full" />
      </h1>
    </Reveal>
  );
}

export function Caption() {
  return (
    <Reveal
      delay={0.3}
      className={`${layer} ${type} top-[118px] left-4 w-[calc(100vw-32px)] text-[12px] leading-[1.4] sm:top-[180px] sm:left-8 sm:w-[calc(50vw-48px)] lg:top-[244px] lg:w-[692px]`}
    >
      <p>{caption}</p>
    </Reveal>
  );
}

export function Header() {
  return (
    <Reveal
      delay={0.15}
      className={`${layer} ${type} top-4 right-4 flex h-[30px] items-center justify-between uppercase sm:top-8 sm:right-8 sm:w-[330px]`}
    >
      <span className="hidden text-[15px] tracking-normal sm:block">{nav.about}</span>
      <div className="flex items-center gap-5 sm:gap-[50px]">
        <svg aria-hidden className="size-6 sm:size-[30px]" viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="2.5">
          <path d="M0 14H40M0 26H40" />
        </svg>
        <span className="text-[13px] tracking-normal sm:text-[15px]">{nav.bag}</span>
      </div>
    </Reveal>
  );
}

export function ProductInfo({ ref, outroOffset }: { ref: Ref<HTMLDivElement>; outroOffset: number }) {
  return (
    <Reveal
      ref={ref}
      id="outro-info"
      data-outro-offset={outroOffset}
      delay={0.45}
      rise={false}
      className={`${layer} ${type} right-0 bottom-12 left-0 flex flex-col items-center sm:bottom-20 sm:left-auto sm:right-8 sm:w-[330px]`}
    >
      <div className="mb-3 flex w-[252px] flex-col items-start sm:mb-8 sm:w-full">
        <div className="relative size-5 sm:size-[30px]">
          <svg aria-hidden className="absolute inset-0 size-full" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18.75" stroke="#fff" className="[stroke-width:2] sm:[stroke-width:2.5]" />
          </svg>
          <span
            id="circle-symbol"
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-[10px] uppercase sm:text-[15px]"
          >
            {symbols[0]}
          </span>
        </div>
        <p className="text-center text-[20px] leading-none uppercase sm:text-[30px]">
          {collection.label}
          <br />“{collection.title}”
        </p>
      </div>
      <p className="text-center text-[60px] leading-none sm:text-[80px]">{collection.price}</p>
    </Reveal>
  );
}

export function ViewButton({ ref }: { ref: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      id="outro-buy"
      style={{ transform: "scale(0)" }}
      className={`${layer} right-4 bottom-[60px] left-4 flex h-[100px] origin-bottom-right items-center justify-center rounded-[1335px] bg-white sm:right-8 sm:bottom-8 sm:left-auto sm:h-[174px] sm:w-[330px]`}
    >
      <span className={`${type} text-[72px] leading-none mix-blend-exclusion sm:text-[110px]`}>{collection.cta}</span>
    </div>
  );
}

export function Overlay({ ref }: { ref: Ref<HTMLDivElement> }) {
  return <div ref={ref} id="outro-overlay" aria-hidden className="pointer-events-none fixed inset-0 z-[12] bg-white opacity-0" />;
}

export function Footer({ ref }: { ref: Ref<HTMLElement> }) {
  return (
    <footer
      ref={ref}
      id="outro-footer"
      className={`${layer} right-4 bottom-6 left-4 flex justify-between text-[11px] font-medium tracking-[-0.02em] text-white uppercase opacity-0 sm:right-auto sm:bottom-8 sm:left-8 sm:justify-start sm:gap-20 sm:text-[13px]`}
    >
      <span>
        {brand.name}® {brand.year}
      </span>
      <span>Privacy policy</span>
      <span>{brand.credit}</span>
    </footer>
  );
}
