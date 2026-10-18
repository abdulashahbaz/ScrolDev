// Colour for every layer of the valley scene, keyed by time of day.
// t runs 0 (dawn) → 0.35 (midday) → 0.68 (golden hour) → 1 (night); in between,
// every colour and number is interpolated, which is what lets the home page
// scroll through a whole day.

export type Season = "spring" | "summer" | "autumn" | "winter";

type Frame = {
  colors: Record<ColorKey, string>;
  numbers: Record<NumberKey, number>;
};

const COLOR_KEYS = [
  "sky-top",
  "sky-mid",
  "sky-low",
  "sun",
  "snow-lit",
  "snow-shade",
  "rock-lit",
  "rock-shade",
  "far",
  "far-low",
  "cones-lit",
  "cones-shade",
  "mid",
  "mid-shade",
  "fort",
  "window",
  "lake-top",
  "lake-deep",
  "shimmer",
  "poplar",
  "poplar-shade",
  "orchard",
  "field",
  "cliff",
  "cliff-rim",
  "cliff-low",
  "bridge",
  "cable",
  "mist",
  "haze",
] as const;

const NUMBER_KEYS = ["sun-x", "sun-y", "sun-o", "moon-o", "stars", "window-glow", "mist-o"] as const;

type ColorKey = (typeof COLOR_KEYS)[number];
type NumberKey = (typeof NUMBER_KEYS)[number];

const STOPS = [0, 0.35, 0.68, 1];

const FRAMES: Frame[] = [
  {
    // Dawn: alpenglow on the snow, lavender haze in the valley.
    colors: {
      "sky-top": "#1c2647",
      "sky-mid": "#7f74a3",
      "sky-low": "#f3b48e",
      sun: "#ffd6a8",
      "snow-lit": "#ffd8cc",
      "snow-shade": "#b5a2c4",
      "rock-lit": "#86698a",
      "rock-shade": "#4b4266",
      far: "#6d6893",
      "far-low": "#a492b2",
      "cones-lit": "#8c7ca3",
      "cones-shade": "#4b4570",
      mid: "#46415f",
      "mid-shade": "#36324d",
      fort: "#c3abb0",
      window: "#ffcf86",
      "lake-top": "#93a7c4",
      "lake-deep": "#3d587c",
      shimmer: "#ffd8c2",
      poplar: "#4d584f",
      "poplar-shade": "#384140",
      orchard: "#56604f",
      field: "#6a6a5e",
      cliff: "#2a2537",
      "cliff-rim": "#8c6f86",
      "cliff-low": "#141120",
      bridge: "#251d2b",
      cable: "#3f3240",
      mist: "#f6d0cf",
      haze: "#e7b2a8",
    },
    numbers: { "sun-x": 70, "sun-y": 58, "sun-o": 0.95, "moon-o": 0, stars: 0.3, "window-glow": 0.4, "mist-o": 0.6 },
  },
  {
    // Midday: white snow, turquoise lake, green poplars.
    colors: {
      "sky-top": "#2a6db4",
      "sky-mid": "#78b5e2",
      "sky-low": "#d7edf7",
      sun: "#fffbea",
      "snow-lit": "#fbfdff",
      "snow-shade": "#b4c9e0",
      "rock-lit": "#7c7570",
      "rock-shade": "#4b5463",
      far: "#7f9ab9",
      "far-low": "#b5cee2",
      "cones-lit": "#9b9087",
      "cones-shade": "#56606f",
      mid: "#5a6857",
      "mid-shade": "#45513f",
      fort: "#ebdfcd",
      window: "#ffcf86",
      "lake-top": "#35c4c1",
      "lake-deep": "#0f7c8a",
      shimmer: "#e9fffb",
      poplar: "#6e9a39",
      "poplar-shade": "#4b7129",
      orchard: "#5f8d37",
      field: "#a5b35b",
      cliff: "#4a3f37",
      "cliff-rim": "#b59c7d",
      "cliff-low": "#241d19",
      bridge: "#352719",
      cable: "#574536",
      mist: "#ffffff",
      haze: "#cfe6f2",
    },
    numbers: { "sun-x": 54, "sun-y": 4, "sun-o": 0.75, "moon-o": 0, stars: 0, "window-glow": 0, "mist-o": 0.32 },
  },
  {
    // Golden hour: amber snow, long warm light, gilded poplars.
    colors: {
      "sky-top": "#394683",
      "sky-mid": "#df8c68",
      "sky-low": "#ffd08c",
      sun: "#ffb45e",
      "snow-lit": "#ffcd90",
      "snow-shade": "#a688a3",
      "rock-lit": "#a06e58",
      "rock-shade": "#563f5a",
      far: "#977a8d",
      "far-low": "#dfa88f",
      "cones-lit": "#c08360",
      "cones-shade": "#5c4156",
      mid: "#694e45",
      "mid-shade": "#483540",
      fort: "#f3c48c",
      window: "#ffcf86",
      "lake-top": "#4fa6a8",
      "lake-deep": "#2a5c74",
      shimmer: "#ffd79a",
      poplar: "#c99a31",
      "poplar-shade": "#8b6a25",
      orchard: "#b9793a",
      field: "#b98f45",
      cliff: "#3a2929",
      "cliff-rim": "#d48c5a",
      "cliff-low": "#1a1113",
      bridge: "#241817",
      cable: "#553a2e",
      mist: "#ffd0a4",
      haze: "#f2b388",
    },
    numbers: { "sun-x": 24, "sun-y": 46, "sun-o": 1, "moon-o": 0, stars: 0, "window-glow": 0.2, "mist-o": 0.42 },
  },
  {
    // Night: moonlit snow, stars, lamps in the fort and the village.
    colors: {
      "sky-top": "#04071a",
      "sky-mid": "#0d1938",
      "sky-low": "#243562",
      sun: "#ffffff",
      "snow-lit": "#a6bbe0",
      "snow-shade": "#5a6c99",
      "rock-lit": "#2b3553",
      "rock-shade": "#192040",
      far: "#1e294b",
      "far-low": "#2b3a66",
      "cones-lit": "#293456",
      "cones-shade": "#151c38",
      mid: "#131a33",
      "mid-shade": "#0d1328",
      fort: "#38426a",
      window: "#ffc56e",
      "lake-top": "#1a2c52",
      "lake-deep": "#0a1530",
      shimmer: "#c6d4ff",
      poplar: "#11192e",
      "poplar-shade": "#0b1124",
      orchard: "#121a30",
      field: "#192240",
      cliff: "#0a0e1e",
      "cliff-rim": "#3c4a78",
      "cliff-low": "#04060e",
      bridge: "#090c17",
      cable: "#283152",
      mist: "#8ea2d6",
      haze: "#29396a",
    },
    numbers: { "sun-x": 24, "sun-y": 70, "sun-o": 0, "moon-o": 1, stars: 1, "window-glow": 1, "mist-o": 0.26 },
  },
];

// Seasonal colour swaps, applied on top of whatever time of day is showing.
const SEASONS: Record<Exclude<Season, "summer">, Partial<Record<ColorKey, string>>> = {
  spring: {
    poplar: "#a6c769",
    "poplar-shade": "#7c9c48",
    orchard: "#f6d5dd",
    field: "#b7cd7b",
  },
  autumn: {
    poplar: "#e4ab2f",
    "poplar-shade": "#b0791d",
    orchard: "#d2672f",
    field: "#c6a259",
  },
  winter: {
    poplar: "#7b6f67",
    "poplar-shade": "#5c524c",
    orchard: "#7b6f67",
    field: "#e6edf3",
    mid: "#c3cfdb",
    "mid-shade": "#93a3b6",
    "lake-top": "#9fc3d2",
    "lake-deep": "#5e8aa0",
    "cliff-rim": "#e4ecf3",
  },
};

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${c(ar, br)}, ${c(ag, bg)}, ${c(ab, bb)})`;
}

function segment(t: number): [number, number] {
  const clamped = Math.min(1, Math.max(0, t));
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (clamped <= STOPS[i + 1]) {
      const local = (clamped - STOPS[i]) / (STOPS[i + 1] - STOPS[i]);
      return [i, local];
    }
  }
  return [STOPS.length - 2, 1];
}

export type SceneVars = Record<`--${string}`, string>;

/** CSS custom properties for the scene at time t, optionally in a season. */
export function sceneVars(t: number, season: Season = "summer"): SceneVars {
  const [i, local] = segment(t);
  const from = FRAMES[i];
  const to = FRAMES[i + 1];
  const swaps = season === "summer" ? {} : SEASONS[season];
  const vars: SceneVars = {};

  for (const key of COLOR_KEYS) {
    vars[`--${key}`] = mixHex(swaps[key] ?? from.colors[key], swaps[key] ?? to.colors[key], local);
  }
  for (const key of NUMBER_KEYS) {
    const value = from.numbers[key] + (to.numbers[key] - from.numbers[key]) * local;
    vars[`--${key}`] = value.toFixed(3);
  }
  // The depth-of-field shade reuses the sky's top colour as an "r, g, b" triple.
  vars["--shade-rgb"] = vars["--sky-top"].slice(4, -1);
  return vars;
}
