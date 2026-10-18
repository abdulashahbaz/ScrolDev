"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type TransitionEvent } from "react";
import { Icon } from "@/components/icon";
import type { Place } from "@/content/places";
import { sceneVars } from "@/lib/palette";

// The home page's pinned scroll story: one day in Hunza, dawn to night.
// Scroll distance drives everything through CSS custom properties on the
// stage, written once per animation frame.

type Props = {
  sky: ReactNode;
  back: ReactNode;
  bridge: ReactNode;
  cliffLeft: ReactNode;
  cliffRight: ReactNode;
  places: Place[];
};

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, v: number) => {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
};
const segment = (s: number, a: number, b: number, c: number, d: number) => {
  const enter = smoothstep(a, b, s);
  const exit = smoothstep(c, d, s);
  return { enter, exit, active: enter * (1 - exit) };
};

// Scroll distance → time of day. Easing between keyframes makes the light
// linger at dawn, midday, golden hour and night, where the panels sit.
const DAY: [number, number][] = [[0, 0], [260, 0.02], [1150, 0.35], [2300, 0.68], [3450, 1]];
function timeAt(s: number): number {
  for (let i = 0; i < DAY.length - 1; i++) {
    const [s0, t0] = DAY[i];
    const [s1, t1] = DAY[i + 1];
    if (s <= s1) return lerp(t0, t1, smoothstep(s0, s1, s));
  }
  return 1;
}

const CLOCK: [number, number][] = [[0, 330], [0.35, 760], [0.68, 1085], [1, 1300]];
const PHASES: [number, string][] = [[0.08, "First light"], [0.25, "Morning"], [0.45, "Midday"], [0.6, "Afternoon"], [0.79, "Golden hour"], [0.92, "Dusk"], [1.01, "Night"]];
function clockAt(t: number): { time: string; phase: string } {
  let minutes = CLOCK[CLOCK.length - 1][1];
  for (let i = 0; i < CLOCK.length - 1; i++) {
    if (t <= CLOCK[i + 1][0]) {
      minutes = lerp(CLOCK[i][1], CLOCK[i + 1][1], (t - CLOCK[i][0]) / (CLOCK[i + 1][0] - CLOCK[i][0]));
      break;
    }
  }
  const m = Math.round(minutes / 5) * 5;
  const time = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  return { time, phase: PHASES.find(([limit]) => t < limit)![1] };
}

const INITIAL = { ...sceneVars(0), "--places-vis": "hidden", "--places-x": "110vw", "--controls-o": "0" } as CSSProperties;

export function Cinema({ sky, back, bridge, cliffLeft, cliffRight, places }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const controls = controlsRef.current;
    if (!section || !stage || !controls) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = 0;
    let smooth = 0;
    let ready = false;
    let pending = false;
    let frame = 0;
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;
    let lastTime = -1;
    let lastClock = "";
    const set = (key: string, value: string | number) => stage.style.setProperty(key, String(value));

    const update = () => {
      pending = false;
      const still = reduce.matches;
      const max = Math.max(0, section.offsetHeight - window.innerHeight);
      target = clamp(-section.getBoundingClientRect().top, 0, max);
      smooth = !ready || still ? target : lerp(smooth, target, 0.12);
      ready = true;
      if (Math.abs(smooth - target) < 0.08) smooth = target;
      mx = still ? 0 : lerp(mx, tmx, 0.08);
      my = still ? 0 : lerp(my, tmy, 0.08);

      const s = smooth;
      const introExit = smoothstep(60, 620, s);
      const lift = smoothstep(380, 940, s);
      const split = Math.pow(smoothstep(480, 1250, s), 1.5);
      const f1 = segment(s, 640, 980, 1420, 1720);
      const f2 = segment(s, 1780, 2120, 2580, 2880);
      const f3 = segment(s, 2940, 3280, 3700, 4000);
      const blur = clamp(f1.active + f2.active + f3.active * 0.3);
      const progress = clamp(s / 4000);
      const placesIn = Math.pow(smoothstep(4000, 4620, s), 1.55);
      const controlsIn = smoothstep(4420, 4760, s);
      const backScale = 1 + progress * 0.14 + f1.enter * 0.1 + f2.enter * 0.06 + f3.enter * 0.06;

      set("--mx", mx.toFixed(4));
      set("--my", my.toFixed(4));
      set("--back-scale", backScale.toFixed(4));
      set("--back-x", `${(f3.enter * 8).toFixed(3)}vw`);
      set("--back-y", `${(f2.enter * -5 + f3.enter * 4).toFixed(3)}vh`);
      set("--back-filter", blur > 0.002 ? `blur(${(blur * 8).toFixed(2)}px) brightness(${(1 - blur * 0.2).toFixed(3)})` : "none");
      set("--shade-a", blur.toFixed(4));

      set("--title-y", `${(introExit * -180).toFixed(2)}px`);
      set("--title-scale", (1 - introExit * 0.08).toFixed(4));
      set("--title-o", (1 - introExit).toFixed(4));
      set("--intro-y", `${(introExit * 90).toFixed(2)}px`);
      set("--intro-o", (1 - introExit).toFixed(4));
      set("--cue-o", (1 - smoothstep(0, 180, s)).toFixed(4));

      set("--bridge-y", `${(-lift * 105).toFixed(3)}vh`);
      set("--bridge-scale", (1 + lift * 1.1).toFixed(4));
      set("--split-l", `${(-split * 56).toFixed(3)}vw`);
      set("--split-r", `${(split * 56).toFixed(3)}vw`);
      set("--split-y", `${(-split * 8).toFixed(3)}vh`);
      set("--split-scale", (1 + split * 0.45).toFixed(4));

      [f1, f2, f3].forEach((f, i) => {
        set(`--p${i + 1}-o`, (f.active * (1 - f.exit)).toFixed(4));
        set(`--p${i + 1}-y`, `${(-f.exit * 86 + (1 - f.enter) * 58).toFixed(2)}px`);
      });

      set("--places-x", `${((1 - placesIn) * 110).toFixed(3)}vw`);
      set("--places-vis", placesIn > 0.01 ? "visible" : "hidden");
      set("--places-shade", placesIn.toFixed(4));
      set("--controls-o", controlsIn.toFixed(4));
      controls.classList.toggle("is-ready", controlsIn > 0.98);

      const time = timeAt(s);
      if (Math.abs(time - lastTime) > 0.0015 || (time !== lastTime && (time === 0 || time === 1))) {
        const vars = sceneVars(time);
        for (const key in vars) set(key, vars[key as keyof typeof vars]);
        set("--day", time.toFixed(4));
        lastTime = time;
        const { time: label, phase } = clockAt(time);
        if (label !== lastClock && clockRef.current && phaseRef.current) {
          clockRef.current.textContent = label;
          phaseRef.current.textContent = phase;
          lastClock = label;
        }
      }

      const settling = Math.abs(smooth - target) > 0.08 || (!still && (Math.abs(mx - tmx) > 0.001 || Math.abs(my - tmy) > 0.001));
      if (settling) tick();
    };

    const tick = () => {
      if (pending) return;
      pending = true;
      frame = requestAnimationFrame(update);
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tmx = e.clientX / window.innerWidth - 0.5;
      tmy = e.clientY / window.innerHeight - 0.5;
      tick();
    };

    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    window.addEventListener("pointermove", onPointer, { passive: true });
    tick();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="cinema" aria-label="One day in Hunza, from first light to night" data-hero>
      <div ref={stageRef} className="scene stage" style={INITIAL}>
        {sky}
        <h1 className="cinema-title">Hunza</h1>
        {back}
        {bridge}
        {cliffLeft}
        {cliffRight}
        <div className="stage-shade" aria-hidden="true" />
        <div className="stage-grain" aria-hidden="true" />

        <div className="cinema-intro">
          <p>Apricot orchards, glacier light and a lake the mountains made. Small-group journeys through the high Karakoram, at the pace the valley keeps.</p>
          <ul className="pill-row" aria-label="Highlights">
            <li>Rakaposhi · 7,788 m</li>
            <li>Attabad Lake</li>
            <li>Karakoram Highway</li>
          </ul>
        </div>

        <div className="cinema-cue" aria-hidden="true">
          <span>Scroll to begin the day</span>
          <span className="cue-line" />
        </div>

        <div className="cinema-clock" aria-hidden="true">
          <span className="clock-place">Karimabad</span>
          <span className="clock-time" ref={clockRef}>05:30</span>
          <span className="clock-phase" ref={phaseRef}>First light</span>
          <span className="clock-track">
            <span className="clock-dot" />
          </span>
        </div>

        <article className="cinema-panel panel-1" aria-label="Rakaposhi">
          <h2>Rakaposhi keeps the time.</h2>
          <p>From Karimabad you watch the day cross its snow: rose at first light, white by noon, gold before dark.</p>
          <dl className="facts">
            <div>
              <dt>7,788</dt>
              <dd>metres: Rakaposhi&apos;s summit</dd>
            </div>
            <div>
              <dt>4,693</dt>
              <dd>metres: Khunjerab Pass, the top of the road</dd>
            </div>
          </dl>
        </article>

        <article className="cinema-panel panel-2" aria-label="Attabad Lake">
          <h2>A lake the mountain made.</h2>
          <p>In 2010 a landslide dammed the Hunza River and flooded villages upstream. The lake that rose behind it is part of valley life now, and its colour stops everyone who passes.</p>
          <Link className="pill-button" href="/journeys/hunza-classic">
            <Icon name="arrowUpRight" size={18} />
            <span>The Hunza Classic, 8 days</span>
          </Link>
        </article>

        <article className="cinema-panel panel-3" aria-label="Baltit Fort">
          <h2>After dark, the fort keeps watch.</h2>
          <p>Baltit Fort has stood over Karimabad for some seven centuries. Restored and reopened as a museum in 1996, it is the valley&apos;s memory in timber and stone.</p>
          <Link className="pill-button" href="/places">
            <Icon name="arrowUpRight" size={18} />
            <span>Eight places worth the journey</span>
          </Link>
        </article>

        <PlacesSlider places={places} controlsRef={controlsRef} />
      </div>
    </section>
  );
}

function PlacesSlider({ places, controlsRef }: { places: Place[]; controlsRef: React.RefObject<HTMLDivElement | null> }) {
  const count = places.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(count);
  const [jumping, setJumping] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
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

  // Three copies of the cards; after each move, snap back into the middle copy without animating.
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

  return (
    <>
      <section className="places" aria-label="Places along the way">
        <div className="places-head">
          <p>Places along the way</p>
          <Link href="/places">
            All eight places <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div
          ref={trackRef}
          className={jumping ? "places-track is-jumping" : "places-track"}
          style={{ transform: `translate3d(${-step * active}px, 0, 0)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {[0, 1, 2].map((copy) =>
            places.map((place, i) => {
              const index = copy * count + i;
              const clone = copy !== 1;
              return (
                <Link
                  key={index}
                  href={`/places#${place.slug}`}
                  className={index === active ? "place-card is-active" : "place-card"}
                  aria-hidden={clone || undefined}
                  tabIndex={clone ? -1 : undefined}
                  onFocus={clone ? undefined : () => setActive(index)}
                >
                  <span className="place-kicker">{place.kicker}</span>
                  <span className="place-icon">
                    <Icon name={place.icon} size={28} strokeWidth={1.4} />
                  </span>
                  <h3>{place.name}</h3>
                  <p>{place.short}</p>
                </Link>
              );
            }),
          )}
        </div>
      </section>
      <div ref={controlsRef} className="places-controls" role="group" aria-label="Slider controls">
        <button type="button" aria-label="Previous place" onClick={() => setActive((a) => Math.max(0, a - 1))}>
          <Icon name="arrowLeft" size={20} />
        </button>
        <button type="button" aria-label="Next place" onClick={() => setActive((a) => Math.min(count * 3 - 1, a + 1))}>
          <Icon name="arrow" size={20} />
        </button>
      </div>
    </>
  );
}
