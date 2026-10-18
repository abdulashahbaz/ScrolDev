import type { CSSProperties } from "react";
import { sceneVars, type Season } from "@/lib/palette";
import { bridge, cliffs, cones, farRidges, fort, lake, midRidges, rakaposhi, shores, stars, terraces, trees, village } from "@/lib/terrain";

// The valley scene, split into layers so the home page can move each one
// independently. Every colour is a CSS variable from lib/palette.ts, set on
// the nearest `.scene` ancestor.

const layer = (depth: number) =>
  ({
    viewBox: "0 0 1600 1000",
    preserveAspectRatio: "xMidYMax slice",
    "aria-hidden": true,
    focusable: "false",
    style: { "--d": depth } as CSSProperties,
  }) as const;

const stop = (offset: string, color: string, opacity = 1) => (
  <stop offset={offset} style={{ stopColor: `var(${color})`, stopOpacity: opacity }} />
);

export function SceneSky() {
  return (
    <>
      <div className="scene-sky" />
      <svg className="scene-layer scene-stars" {...layer(0.04)}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} opacity={s.o} className={s.twinkle ? "twinkle" : undefined} style={s.twinkle ? { animationDelay: `${(i % 9) * 0.45}s` } : undefined} />
        ))}
      </svg>
      <div className="scene-sun" />
      <div className="scene-moon" />
    </>
  );
}

export function SceneBack({ uid }: { uid: string }) {
  const id = (name: string) => `${uid}-${name}`;
  return (
    <div className="scene-back">
      {/* Rakaposhi, the far ridges and high mist */}
      <svg className="scene-layer" {...layer(0.1)}>
        <defs>
          <linearGradient id={id("far")} x1="0" y1="0" x2="0" y2="1">
            {stop("0", "--far")}
            {stop("1", "--far-low")}
          </linearGradient>
          <radialGradient id={id("mist")}>
            {stop("0", "--mist", 0.85)}
            {stop("1", "--mist", 0)}
          </radialGradient>
        </defs>
        <path d={rakaposhi.leftFace} className="f-rock-lit" />
        <path d={rakaposhi.rightFace} className="f-rock-shade" />
        <path d={rakaposhi.snowLeft} className="f-snow-lit" />
        <path d={rakaposhi.snowRight} className="f-snow-shade" />
        {rakaposhi.gulliesLeft.map((d, i) => (
          <path key={`gl${i}`} d={d} className="f-snow-lit" opacity={0.85} />
        ))}
        {rakaposhi.gulliesRight.map((d, i) => (
          <path key={`gr${i}`} d={d} className="f-snow-shade" opacity={0.8} />
        ))}
        {rakaposhi.crevasses.map((d, i) => (
          <path key={`c${i}`} d={d} className="s-rock-shade" fill="none" strokeWidth={2} opacity={0.35} />
        ))}
        <g className="mist mist-slow">
          <ellipse cx="560" cy="610" rx="520" ry="56" fill={`url(#${id("mist")})`} className="mist-o" />
          <ellipse cx="1180" cy="570" rx="460" ry="44" fill={`url(#${id("mist")})`} className="mist-o" />
        </g>
        {farRidges.map((d, i) => (
          <path key={i} d={d} fill={`url(#${id("far")})`} />
        ))}
      </svg>

      {/* Passu Cones and the low hills on the right */}
      <svg className="scene-layer" {...layer(0.18)}>
        <path d={cones.silhouette} className="f-cones-shade" />
        {cones.litFaces.map((d, i) => (
          <path key={`f${i}`} d={d} className="f-cones-lit" />
        ))}
        {cones.snowCaps.map((d, i) => (
          <path key={`s${i}`} d={d} className="f-snow-shade" opacity={0.9} />
        ))}
        <path d={midRidges.right} className="f-mid-shade" />
      </svg>

      {/* The fort ridge and Karimabad's houses */}
      <svg className="scene-layer" {...layer(0.28)}>
        <defs>
          <radialGradient id={id("glow")}>
            {stop("0", "--window", 0.7)}
            {stop("1", "--window", 0)}
          </radialGradient>
        </defs>
        <ellipse cx="290" cy="470" rx="150" ry="90" fill={`url(#${id("glow")})`} className="window-halo" />
        <path d={midRidges.left} className="f-mid" />
        <path d={fort.foundation} className="f-mid-shade" />
        {fort.blocks.map((b, i) => (
          <rect key={`b${i}`} {...b} className="f-fort" />
        ))}
        {fort.shade.map((b, i) => (
          <rect key={`sh${i}`} {...b} fill="#000" opacity={0.18} />
        ))}
        <rect {...fort.roof} className="f-mid-shade" />
        {fort.beams.map((b, i) => (
          <rect key={`bm${i}`} {...b} className="f-mid-shade" opacity={0.55} />
        ))}
        {fort.windows.map((w, i) => (
          <g key={`w${i}`}>
            <rect {...w} className="f-mid-shade" />
            <rect {...w} className="f-window window-glow" />
          </g>
        ))}
        {terraces.map((t, i) => (
          <rect key={`t${i}`} {...t} rx={1} className="f-field" opacity={0.32} />
        ))}
        {village.map((h, i) => (
          <g key={`h${i}`}>
            <rect x={h.x} y={h.y} width={h.width} height={h.height} className="f-fort" opacity={0.78} />
            <rect x={h.x - 0.6} y={h.y - 1.4} width={h.width + 1.2} height={1.6} className="f-mid-shade" />
            {h.lit && <rect {...h.win} className="f-window window-glow" />}
          </g>
        ))}
      </svg>

      {/* Attabad's water, reflections and low mist */}
      <svg className="scene-layer" {...layer(0.36)}>
        <defs>
          <linearGradient id={id("lake")} gradientUnits="userSpaceOnUse" x1="0" y1="700" x2="0" y2="1000">
            {stop("0", "--lake-top")}
            {stop("1", "--lake-deep")}
          </linearGradient>
          <radialGradient id={id("lowmist")}>
            {stop("0", "--mist", 0.7)}
            {stop("1", "--mist", 0)}
          </radialGradient>
        </defs>
        <rect x="-500" y="700" width="2600" height="400" fill={`url(#${id("lake")})`} />
        <g transform="matrix(1 0 0 -0.42 0 994)" opacity={0.24}>
          <path d={rakaposhi.leftFace} className="f-rock-lit" />
          <path d={rakaposhi.rightFace} className="f-rock-shade" />
          <path d={rakaposhi.snowLeft} className="f-snow-lit" />
          <path d={rakaposhi.snowRight} className="f-snow-shade" />
          <path d={cones.silhouette} className="f-cones-shade" />
        </g>
        <rect x="-500" y="697" width="2600" height="10" className="f-haze" opacity={0.55} />
        {lake.shimmer.map((s, i) => (
          <rect key={i} x={s.x} y={s.y} width={s.w} height={1.6} rx={0.8} className="f-shimmer shimmer" fillOpacity={s.o} style={{ animationDelay: `${s.delay}s` }} />
        ))}
        <g className="mist mist-fast">
          <ellipse cx="820" cy="712" rx="620" ry="30" fill={`url(#${id("lowmist")})`} className="mist-o" />
        </g>
      </svg>

      {/* Shores, poplars and apricot orchards */}
      <svg className="scene-layer" {...layer(0.48)}>
        <path d={shores.left} className="f-field" />
        <path d={shores.right} className="f-field" />
        {trees.orchard.map((t, i) => (
          <circle key={`o${i}`} {...t} className="f-orchard" />
        ))}
        {trees.poplars.map((p, i) => (
          <g key={`p${i}`}>
            <path d={p.full} className="f-poplar" />
            <path d={p.shade} className="f-poplar-shade" />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function SceneBridge() {
  return (
    <svg className="scene-layer scene-bridge" {...layer(0.7)}>
      <path d={bridge.railFar} className="s-cable" fill="none" strokeWidth={2} opacity={0.75} />
      {bridge.hangers.map((d, i) => (
        <path key={i} d={d} className="s-cable" strokeWidth={1.2} />
      ))}
      <path d={bridge.deckLow} className="s-bridge" fill="none" strokeWidth={2} />
      <path d={bridge.deck} className="s-cable" fill="none" strokeWidth={2.4} />
      {bridge.planks.map((p, i) => (
        <rect key={i} x={-5} y={-3} width={10} height={6} rx={1} className="f-bridge" transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.angle.toFixed(1)})`} />
      ))}
      <path d={bridge.railNear} className="s-cable" fill="none" strokeWidth={2.6} />
      {bridge.posts.map((p, i) => (
        <rect key={`post${i}`} x={p.x} y={p.y} width={p.w} height={p.h} className="f-bridge" />
      ))}
    </svg>
  );
}

export function SceneCliff({ side, uid }: { side: "left" | "right"; uid: string }) {
  const c = cliffs[side];
  const gid = `${uid}-cliff-${side}`;
  const [x1, x2] = side === "left" ? [-520, 480] : [2120, 1148];
  return (
    <svg className={`scene-layer scene-cliff scene-cliff-${side}`} {...layer(1)}>
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={x1} y1="0" x2={x2} y2="0">
          {stop("0", "--cliff-low")}
          {stop("0.82", "--cliff")}
          {stop("1", "--cliff")}
        </linearGradient>
      </defs>
      <path d={c.body} fill={`url(#${gid})`} />
      {c.strata.map((d, i) => (
        <path key={i} d={d} className="s-cliff-rim" fill="none" strokeWidth={1.6} opacity={0.2} />
      ))}
      <path d={c.rim} className="s-cliff-rim" fill="none" strokeWidth={3} opacity={0.6} />
    </svg>
  );
}

type LandscapeProps = {
  time: number;
  season?: Season;
  uid: string;
  /** Adds the gorge walls and the suspension bridge in front of the view. */
  foreground?: boolean;
  className?: string;
};

/** A still scene at a fixed time of day and season, for heroes and cards. */
export function Landscape({ time, season = "summer", uid, foreground = false, className }: LandscapeProps) {
  return (
    <div className={className ? `scene ${className}` : "scene"} style={sceneVars(time, season) as CSSProperties} aria-hidden="true">
      <SceneSky />
      <SceneBack uid={uid} />
      {foreground && (
        <>
          <SceneBridge />
          <SceneCliff side="left" uid={uid} />
          <SceneCliff side="right" uid={uid} />
        </>
      )}
    </div>
  );
}
