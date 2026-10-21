"use client";
/* eslint-disable @next/next/no-img-element -- the scene layers need exact CSS sizing and transforms, not next/image wrappers */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type TransitionEvent } from "react";

// The home page's pinned scroll story. The stage sticks for 3,700px of
// scroll; each frame we turn that distance (smoothed) and the pointer
// position into CSS custom properties on the stage, and the stylesheet does
// the rest.

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, v: number) => {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
};
const segmentInOut = (s: number, a: number, b: number, c: number, d: number) => {
  const enter = smoothstep(a, b, s);
  const exit = smoothstep(c, d, s);
  return { enter, exit, active: enter * (1 - exit) };
};

export type HouseCard = { kicker: string; title: string; body: string; href: string; icon: "icon1" | "icon2" | "icon3" };

const layer = (name: string) => ({
  src: `/scene/${name}-2560.webp`,
  srcSet: `/scene/${name}-1440.webp 1440w, /scene/${name}-2560.webp 2560w`,
});

export function Cinema({ cards }: { cards: HouseCard[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const controls = controlsRef.current;
    if (!section || !stage || !controls) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetScroll = 0;
    let smoothScroll = 0;
    let initialized = false;
    let rafPending = false;
    let frame = 0;
    const set = (key: string, value: string | number) => stage.style.setProperty(key, String(value));
    const getScrollDistance = () => clamp(-section.getBoundingClientRect().top, 0, section.offsetHeight - window.innerHeight);

    const update = () => {
      rafPending = false;
      const still = reduceMotion.matches;
      targetScroll = getScrollDistance();
      if (!initialized || still) {
        smoothScroll = targetScroll;
        initialized = true;
      } else {
        smoothScroll = lerp(smoothScroll, targetScroll, 0.14);
      }
      if (Math.abs(smoothScroll - targetScroll) < 0.08) smoothScroll = targetScroll;
      mouseX = still ? 0 : lerp(mouseX, targetMouseX, 0.12);
      mouseY = still ? 0 : lerp(mouseY, targetMouseY, 0.12);

      const s = smoothScroll;
      const frame2 = segmentInOut(s, 560, 900, 1300, 1620);
      const frame3 = segmentInOut(s, 1760, 2140, 2540, 2700);
      const progress = clamp(s / 2700);
      const introExit = smoothstep(90, 650, s);
      const sightsEnter = Math.pow(smoothstep(2760, 3560, s), 1.55);
      const sightsControlsEnter = smoothstep(3360, 3660, s);
      const blurActive = clamp(frame2.active + frame3.active);
      const frame2Opacity = frame2.active * (1 - frame3.enter);
      const splitDrift = Math.pow(frame2.enter, 1.5);
      const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
      const sharedHeroY = progress * -74;
      const sharedHeroScale = progress * 0.23;
      const sightsScreenTop = Math.min(220, Math.max(112, window.innerHeight * 0.19)) - 50;
      const sightsParentTop = window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale;

      set("--mx", mouseX.toFixed(4));
      set("--my", mouseY.toFixed(4));

      set("--back-opacity", (1 - frame2.active * 0.06).toFixed(4));
      set("--back-x", `${(mouseX * -12).toFixed(2)}px`);
      set("--back-y", `${(mouseY * -4).toFixed(2)}px`);
      set("--back-scale", backScale.toFixed(4));
      set("--four-y", `${(10 + progress * 10).toFixed(3)}vh`);
      set("--four-scale", (0.78 + progress * 0.16).toFixed(4));
      set("--bazaar-y", `${(20 - progress * 8).toFixed(3)}vh`);
      set("--blur-px", `${(blurActive * 14).toFixed(2)}px`);
      set("--back-brightness", (1 - blurActive * 0.255).toFixed(4));
      set("--bazaar-blur-px", `${(frame2.active * 14).toFixed(2)}px`);
      set("--bazaar-brightness", (1 - frame2.active * 0.255 - frame3.active * 0.06).toFixed(4));
      set("--bazaar-saturation", (1 + frame3.active * 0.18).toFixed(4));
      set("--shade-z", frame2.active > 0.02 ? "2" : "0");
      set("--shade-top-alpha", (blurActive * 0.465).toFixed(4));
      set("--shade-mid-alpha", (blurActive * 0.42).toFixed(4));
      set("--shade-bottom-alpha", (blurActive * 0.51).toFixed(4));

      set("--title-y", `${(introExit * -210).toFixed(2)}px`);
      set("--title-scale", (1 - introExit * 0.08).toFixed(4));
      set("--title-opacity", (1 - introExit).toFixed(4));

      set("--bridge-x", `calc(-50% + ${(mouseX * 18).toFixed(2)}px)`);
      set("--bridge-y", `${(mouseY * 8 + sharedHeroY - frame2.exit * 760).toFixed(2)}px`);
      set("--bridge-bottom", `${(5 - frame2.enter * 13).toFixed(3)}vh`);
      set("--bridge-width", `${(67.2 + frame2.enter * 37.8).toFixed(3)}vw`);
      set("--bridge-scale", (1.02 + sharedHeroScale + frame2.exit * 0.46).toFixed(4));

      const splitY = `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`;
      const splitScale = (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4);
      set("--split-left-x", `calc(-50% + ${(-splitDrift * 46).toFixed(3)}vw + ${(mouseX * 22).toFixed(2)}px)`);
      set("--split-right-x", `calc(-50% + ${(splitDrift * 46).toFixed(3)}vw + ${(mouseX * 22).toFixed(2)}px)`);
      set("--split-y", splitY);
      set("--split-scale", splitScale);

      set("--frame2-opacity", frame2Opacity.toFixed(4));
      set("--frame2-x", `calc(-50% + ${(mouseX * 10).toFixed(2)}px)`);
      set("--frame2-y", `calc(-50% + ${(mouseY * 8 - frame2.exit * 150).toFixed(2)}px)`);
      set("--frame2-scale", (1.06 + frame2.enter * 0.08 + frame2.exit * 0.08).toFixed(4));

      set("--intro-copy-y", `${(introExit * 90).toFixed(2)}px`);
      set("--intro-copy-opacity", (1 - introExit).toFixed(4));
      set("--panel2-opacity", (frame2.active * (1 - frame2.exit)).toFixed(4));
      set("--panel2-y", `calc(-50% + ${(-frame2.exit * 86 + (1 - frame2.enter) * 58).toFixed(2)}px)`);
      set("--panel3-opacity", (frame3.active * (1 - frame3.exit)).toFixed(4));
      set("--panel3-y", `calc(-50% + ${(-frame3.exit * 86 + (1 - frame3.enter) * 58).toFixed(2)}px)`);

      set("--sights-controls-opacity", sightsControlsEnter.toFixed(4));
      controls.classList.toggle("is-ready", sightsControlsEnter > 0.98);
      set("--sights-visibility", sightsEnter > 0.01 ? "visible" : "hidden");
      set("--sights-enter-x", `${((1 - sightsEnter) * 420).toFixed(3)}vw`);
      set("--sights-scale", (1 / backScale).toFixed(4));
      set("--sights-top", `${sightsParentTop.toFixed(2)}px`);
      set("--sights-screen-top", `${sightsScreenTop.toFixed(2)}px`);
      set("--cue-opacity", (1 - smoothstep(0, 220, s)).toFixed(4));

      const settling =
        Math.abs(smoothScroll - targetScroll) > 0.08 || (!still && (Math.abs(mouseX - targetMouseX) > 0.001 || Math.abs(mouseY - targetMouseY) > 0.001));
      if (settling) requestTick();
    };

    const requestTick = () => {
      if (rafPending) return;
      rafPending = true;
      frame = requestAnimationFrame(update);
    };
    const onPointer = (e: PointerEvent) => {
      targetMouseX = e.clientX / window.innerWidth - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
      requestTick();
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    window.addEventListener("pointermove", onPointer, { passive: true });
    requestTick();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="cinema-scroll" id="cinema" aria-label="Mostar and the house, told in one scroll" data-hero>
      <div ref={stageRef} className="stage">
        <div className="world">
          <img className="scene-img sky-img" {...layer("sky")} sizes="100vw" alt="" fetchPriority="high" />
          <div className="back-stack">
            <img className="scene-img back-img back-four" {...layer("back-four")} sizes="112vw" alt="" />
            <HouseSlider cards={cards} />
            <img className="scene-img back-img back-bazaar" {...layer("bazaar")} sizes="112vw" alt="" fetchPriority="high" />
          </div>
          <SliderControls controlsRef={controlsRef} />
          <h1 className="hero-title">Mostar</h1>
          <img className="scene-img splitframe-img splitframe-left" {...layer("split-left")} sizes="118vw" alt="" fetchPriority="high" />
          <img className="scene-img splitframe-img splitframe-right" {...layer("split-right")} sizes="118vw" alt="" fetchPriority="high" />
          <img className="scene-img bridge-img" {...layer("bridge")} sizes="(max-width: 640px) 190vw, 105vw" alt="" fetchPriority="high" />
          <img className="scene-img frame-two-img" {...layer("frame-two")} sizes="122vw" alt="" />
          <div className="shade" />
        </div>

        <section className="intro-copy" aria-label="About the house">
          <p>
            Mostar is named for the <em>mostari</em>, the keepers of its Old Bridge. Our stone house above the Neretva keeps their habit: looking after everyone who crosses.
          </p>
          <ul className="hero-tags" aria-label="The house at a glance">
            <li>21 rooms &amp; suites</li>
            <li>Hammam in the old cellars</li>
            <li>Terrace on the river</li>
          </ul>
        </section>

        <section className="story-panel story-panel-bridge" aria-label="The Old Bridge">
          <h2>Kept since 1566.</h2>
          <p>Stari Most has joined the two banks of the Neretva since the sixteenth century. It fell in 1993 and rose again, stone by stone, in 2004.</p>
          <dl className="facts">
            <div>
              <dt>1566</dt>
              <dd>Stari Most completed</dd>
            </div>
            <div>
              <dt>2004</dt>
              <dd>Rebuilt and reopened</dd>
            </div>
          </dl>
        </section>

        <section className="story-panel story-panel-bazaar" aria-label="The old town">
          <h2>The old town is your hallway.</h2>
          <p>Copper workshops on Kujundžiluk, minarets above the river, coffee poured from a copper džezva. All of it a few minutes from your door.</p>
          <Link className="note-button" href="/experiences">
            <span aria-hidden="true">↗</span>
            <span>Plan your days</span>
          </Link>
        </section>

        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <span className="scroll-cue-line" />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Slider */

// The slider state is shared with the controls, which sit outside the
// zooming back stack, through a tiny module-level store.
type SliderApi = { move: (dir: number) => void };
const sliderApi: { current: SliderApi | null } = { current: null };

function HouseSlider({ cards }: { cards: HouseCard[] }) {
  const router = useRouter();
  const count = cards.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(count);
  const [jumping, setJumping] = useState(false);
  const [step, setStep] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first) return;
      setStep(first.offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    sliderApi.current = { move: (dir) => setActive((a) => clamp(a + dir, 0, count * 3 - 1)) };
    return () => {
      sliderApi.current = null;
    };
  }, [count]);

  const jump = (index: number) => {
    setJumping(true);
    setActive(index);
    requestAnimationFrame(() => requestAnimationFrame(() => setJumping(false)));
  };
  const onTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (active >= count * 2) jump(active - count);
    else if (active < count) jump(active + count);
  };
  // As in the original: clicking a card that isn't centred selects it; clicking the selected card opens it.
  const onCardClick = (e: MouseEvent<HTMLAnchorElement>, index: number, href: string) => {
    e.preventDefault();
    if (index === active) router.push(href);
    else setActive(index);
  };

  return (
    <section className="sights-slider" aria-label="Inside the house">
      <div
        ref={trackRef}
        className={jumping ? "sights-track is-jumping" : "sights-track"}
        style={{ transform: `translate3d(calc(${-step * active}px - 18vw), 0, 0)` }}
        onTransitionEnd={onTransitionEnd}
      >
        {[0, 1, 2].map((copy) =>
          cards.map((card, i) => {
            const index = copy * count + i;
            const clone = copy !== 1;
            return (
              <a
                key={index}
                href={card.href}
                className={index === active ? "sight-card is-active" : "sight-card"}
                aria-hidden={clone || undefined}
                tabIndex={clone ? -1 : undefined}
                onClick={(e) => onCardClick(e, index, card.href)}
                onFocus={clone ? undefined : () => setActive(index)}
              >
                <span className="sight-kicker">{card.kicker}</span>
                <img className="sight-pin" src={`/scene/${card.icon}.webp`} alt="" width={64} height={64} />
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </a>
            );
          }),
        )}
      </div>
    </section>
  );
}

function SliderControls({ controlsRef }: { controlsRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={controlsRef} className="sights-controls" role="group" aria-label="Slider controls">
      <button type="button" className="sight-nav" aria-label="Previous" onClick={() => sliderApi.current?.move(-1)}>
        ←
      </button>
      <button type="button" className="sight-nav" aria-label="Next" onClick={() => sliderApi.current?.move(1)}>
        →
      </button>
    </div>
  );
}
