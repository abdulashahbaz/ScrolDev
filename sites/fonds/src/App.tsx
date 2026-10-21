import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { useEffect, useRef } from "react";
import { Cursor } from "./components/cursor";
import { GalleryPanel } from "./components/gallery-panel";
import { Caption, Footer, Header, Logo, Overlay, ProductInfo, ViewButton } from "./components/hero-overlay";
import { VideoStage, type VideoStageHandle } from "./components/video-stage";
import { symbols } from "./content/site";
import { queries, useMediaQuery } from "./hooks/use-media-query";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SYMBOL_INTERVAL = 80;

export default function App() {
  const tablet = useMediaQuery(queries.tablet);
  const desktop = useMediaQuery(queries.desktop);
  const customCursor = useMediaQuery(queries.customCursor);
  const cols = desktop ? 4 : tablet ? 3 : 2;

  const spacerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<VideoStageHandle>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // Phase 1: the black panel rises over the hero during the first screen of scroll.
  useGSAP(
    () => {
      gsap.fromTo(
        panelRef.current,
        { y: () => window.innerHeight },
        {
          y: 0,
          ease: "none",
          scrollTrigger: { start: 0, end: () => window.innerHeight, scrub: true, invalidateOnRefresh: true },
        },
      );
    },
    { scope: spacerRef },
  );

  // Smooth, eased scrolling with the mouse wheel and trackpad. Touch keeps the
  // device's native scrolling. Lenis and ScrollTrigger run on GSAP's ticker so
  // the panel and everything below move from the same scroll position each frame.
  useEffect(() => {
    if (window.matchMedia(queries.reducedMotion).matches) return;
    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // Everything else is driven from one per-frame callback that reads
  // window.scrollY and only writes when the position or layout changed. It runs
  // on GSAP's ticker after Lenis, so it sees this frame's scroll position.
  useEffect(() => {
    const spacer = spacerRef.current!;
    const wrap = wrapRef.current!;
    const info = infoRef.current!;
    const buy = buyRef.current!;
    const overlay = overlayRef.current!;
    const footer = footerRef.current!;
    const symbol = document.getElementById("circle-symbol")!;

    let vh = window.innerHeight;
    let maxScroll = 0;
    let outroOffset = 0;
    let cards: { el: HTMLElement; top: number; height: number; scale: number }[] = [];
    let lastY = -1;
    let dirty = true;
    let heroVisible = true;
    let lastSymbolAt = 0;

    const measure = () => {
      vh = window.innerHeight;
      maxScroll = Math.max(0, wrap.offsetHeight - vh);
      spacer.style.height = `${vh + maxScroll + 2 * vh}px`;
      outroOffset = Number(info.dataset.outroOffset) || 0;
      cards = Array.from(wrap.querySelectorAll<HTMLElement>(".bp-card"), (el) => ({
        el,
        top: el.offsetTop,
        height: el.offsetHeight,
        scale: -1,
      }));
      dirty = true;
    };

    const frame = () => {
      const now = performance.now();
      const y = window.scrollY;
      if (y === lastY && !dirty) return;
      const scrolled = lastY >= 0 && y !== lastY;
      lastY = y;
      dirty = false;

      // Screen position of the gallery's top edge. While the panel rises it
      // moves the cards; once it is pinned the inner wrapper takes over, so
      // either way a card sits at its layout offset plus this.
      const offset = vh - y;
      wrap.style.transform = `translate3d(0, ${Math.min(0, offset)}px, 0)`;

      for (const card of cards) {
        const top = offset + card.top;
        const bottom = top + card.height;
        let scale = 0;
        if (bottom > 0 && top < vh) {
          const enter = (vh - top) / (vh * 0.6);
          const exit = bottom / (vh * 0.4);
          scale = Math.round(Math.max(0, Math.min(1, enter, exit)) * 1e4) / 1e4;
        }
        if (scale !== card.scale) {
          card.scale = scale;
          card.el.style.transform = `scale(${scale})`;
        }
      }

      const progress = Math.min(1, Math.max(0, (y - vh - maxScroll) / (vh - 100)));
      overlay.style.opacity = String(progress);
      footer.style.opacity = String(progress);
      info.style.transform = `translate3d(0, ${-progress * outroOffset}px, 0)`;
      buy.style.transform = `scale(${progress})`;

      const visible = y <= vh;
      if (visible !== heroVisible) {
        heroVisible = visible;
        stageRef.current?.setVisible(visible);
      }

      if (scrolled && now - lastSymbolAt >= SYMBOL_INTERVAL) {
        lastSymbolAt = now;
        const options = symbols.filter((s) => s !== symbol.textContent);
        symbol.textContent = options[Math.floor(Math.random() * options.length)];
      }
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(wrap);
    window.addEventListener("resize", measure);
    measure();
    gsap.ticker.add(frame);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      gsap.ticker.remove(frame);
    };
  }, [cols, tablet]);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div
          ref={spacerRef}
          id="scroll-spacer"
          className="relative bg-white select-none"
          style={{ height: "500vh", cursor: customCursor ? "none" : undefined }}
        >
          <main>
            <VideoStage ref={stageRef} />
            <Logo />
            <Caption />
            <Header />
            <ProductInfo ref={infoRef} outroOffset={tablet ? 166 : 132} />
            <GalleryPanel ref={panelRef} wrapRef={wrapRef} cols={cols} />
            <Overlay ref={overlayRef} />
            <ViewButton ref={buyRef} />
          </main>
          <Footer ref={footerRef} />
          {customCursor && <Cursor />}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
