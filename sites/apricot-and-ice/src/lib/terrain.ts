// Geometry for the valley scene, drawn in a 1600 × 1000 viewBox.
// Hand-placed key points give each landform its shape; seeded midpoint
// displacement adds the irregular edges. Everything is deterministic, so the
// server and the browser always produce identical markup.

type Pt = [number, number];

export const VIEW = { w: 1600, h: 1000, horizon: 700 } as const;

function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Adds 2^depth − 1 displaced points between each pair of key points. Key points keep their index × 2^depth. */
function roughen(points: Pt[], seed: number, amount: number, depth = 3): Pt[] {
  const rand = random(seed);
  let pts = points;
  let amt = amount;
  for (let d = 0; d < depth; d++) {
    const next: Pt[] = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.hypot(dx, dy) || 1;
      const off = (rand() - 0.5) * 2 * amt * len;
      next.push([(x0 + x1) / 2 + (-dy / len) * off, (y0 + y1) / 2 + (dx / len) * off]);
      next.push(pts[i]);
    }
    pts = next;
    amt *= 0.55;
  }
  return pts;
}

const n = (v: number) => String(Math.round(v * 10) / 10);

function path(points: Pt[], close = true): string {
  return "M" + points.map(([x, y]) => `${n(x)} ${n(y)}`).join("L") + (close ? "Z" : "");
}

/** Irregular snow line from a to b: small rises between deep gully dips. */
function snowline(a: Pt, b: Pt, seed: number, count: number, dip: [number, number]): Pt[] {
  const rand = random(seed);
  const pts: Pt[] = [];
  for (let i = 1; i < count; i++) {
    const t = i / count;
    const x = a[0] + (b[0] - a[0]) * t + (rand() - 0.5) * 10;
    const y = a[1] + (b[1] - a[1]) * t;
    pts.push([x, i % 2 ? y + dip[0] + rand() * (dip[1] - dip[0]) : y - 4 + rand() * 8]);
  }
  return pts;
}

/* ---------------------------------------------------------------- Rakaposhi */

const SUMMIT: Pt = [822, 280];
const rkLeft = roughen(
  [[-120, 700], [150, 690], [330, 632], [430, 592], [520, 552], [590, 506], [650, 462], [700, 420], [748, 372], [790, 324], SUMMIT],
  11,
  0.12,
);
const rkRight = roughen(
  [SUMMIT, [858, 306], [902, 338], [960, 366], [1030, 394], [1100, 432], [1170, 472], [1250, 522], [1340, 577], [1440, 637], [1540, 690], [1760, 700]],
  12,
  0.12,
);
const rkSpine = roughen([SUMMIT, [812, 336], [826, 396], [808, 452], [830, 516], [812, 580], [836, 640], [826, 700]], 13, 0.1);

const leftSnowStart = rkLeft.findIndex(([, y]) => y < 520);
const spineSnowEnd = rkSpine.findIndex(([, y]) => y > 468);
const rightSnowEnd = rkRight.findIndex(([, y]) => y > 540);

const snowLeftPts: Pt[] = [
  ...rkLeft.slice(leftSnowStart),
  ...rkSpine.slice(1, spineSnowEnd),
  ...snowline(rkSpine[spineSnowEnd - 1], rkLeft[leftSnowStart], 14, 16, [10, 40]),
];
const snowRightPts: Pt[] = [
  ...rkRight.slice(0, rightSnowEnd),
  ...snowline(rkRight[rightSnowEnd - 1], rkSpine[spineSnowEnd - 1], 15, 18, [10, 36]),
  ...rkSpine.slice(1, spineSnowEnd).reverse(),
];

function gullies(line: Pt[], seed: number, length: [number, number]): string[] {
  const rand = random(seed);
  // snowline() puts its dips at even indices; streaks hang from every other one.
  return line
    .filter((_, i) => i % 4 === 0)
    .map(([x, y]) => {
      const len = length[0] + rand() * (length[1] - length[0]);
      const w = 3 + rand() * 4;
      return path([[x - w, y - 6], [x + w, y - 6], [x + 1 + rand() * 4, y + len]]);
    });
}

export const rakaposhi = {
  leftFace: path([...rkLeft, ...rkSpine.slice(1)]),
  rightFace: path([...rkRight, ...rkSpine.slice().reverse().slice(1)]),
  snowLeft: path(snowLeftPts),
  snowRight: path(snowRightPts),
  gulliesLeft: gullies(snowLeftPts.slice(rkLeft.length - leftSnowStart + spineSnowEnd - 1), 16, [12, 38]),
  gulliesRight: gullies(snowRightPts.slice(rightSnowEnd, rightSnowEnd + 17), 17, [10, 34]),
  crevasses: [
    path(roughen([[842, 318], [900, 372], [930, 420]], 18, 0.2, 2), false),
    path(roughen([[828, 352], [870, 420], [884, 470]], 19, 0.2, 2), false),
    path(roughen([[960, 380], [1010, 430], [1030, 470]], 20, 0.2, 2), false),
  ],
};

/* --------------------------------------------------------------- Far ridges */

export const farRidges = [
  path(
    roughen(
      [[-420, 700], [-420, 520], [-200, 470], [-40, 500], [60, 456], [150, 482], [236, 440], [310, 470], [390, 512], [470, 560], [560, 612], [650, 664], [740, 700]],
      31,
      0.16,
    ),
  ),
  path(
    roughen(
      [[880, 700], [960, 664], [1040, 620], [1120, 586], [1196, 548], [1262, 516], [1330, 536], [1404, 488], [1484, 506], [1566, 470], [1660, 492], [1800, 452], [2020, 500], [2020, 700]],
      32,
      0.16,
    ),
  ),
];

/* ------------------------------------------------------------- Passu Cones */

const CONE_DEPTH = 3;
const coneTips: Pt[] = [
  [1010, 552], [1074, 486], [1130, 524], [1190, 440], [1256, 492], [1318, 426],
  [1384, 478], [1446, 452], [1516, 506], [1590, 476], [1680, 530],
];
const coneKeys: Pt[] = [[940, 700]];
{
  const rand = random(41);
  coneTips.forEach((tip, i) => {
    const prev = i === 0 ? ([960, 640] as Pt) : coneTips[i - 1];
    if (i > 0) coneKeys.push([(prev[0] + tip[0]) / 2, Math.max(prev[1], tip[1]) + 24 + rand() * 30]);
    coneKeys.push(tip);
  });
  coneKeys.push([1760, 580], [1900, 610], [1900, 700]);
}
const conePts = roughen(coneKeys, 42, 0.07, CONE_DEPTH);
const step = 2 ** CONE_DEPTH;

export const cones = {
  silhouette: path(conePts),
  // The sunward face of each spire: up its left edge to the tip, then back down to a point halfway to the valley floor.
  litFaces: coneTips.map((tip, i) => {
    const tipKey = 2 * i + 1;
    const face = conePts.slice((tipKey - 1) * step, tipKey * step + 1);
    return path([...face, [tip[0] + 2, tip[1] + (700 - tip[1]) * 0.55]]);
  }),
  snowCaps: coneTips.map((_, i) => {
    const at = (2 * i + 1) * step;
    return path(conePts.slice(at - 1, at + 2).concat([[conePts[at][0], conePts[at][1] + 16]]));
  }),
};

/* ------------------------------------------------- Mid ridges, fort, village */

export const midRidges = {
  left: path(
    roughen(
      [[-420, 1000], [-420, 640], [-200, 610], [-40, 600], [40, 575], [120, 548], [180, 526], [232, 510], [352, 510], [390, 522], [450, 554], [520, 600], [600, 648], [690, 700], [780, 740], [780, 1000]],
      51,
      0.06,
    ),
  ),
  right: path(
    roughen([[860, 1000], [860, 712], [940, 690], [1040, 668], [1150, 650], [1260, 640], [1360, 628], [1470, 606], [1560, 590], [1660, 580], [2020, 600], [2020, 1000]], 52, 0.06),
  ),
};

type Box = { x: number; y: number; width: number; height: number };
const box = (x: number, y: number, width: number, height: number): Box => ({ x, y, width, height });

export const fort = {
  foundation: path([[230, 536], [242, 500], [342, 500], [354, 536]]),
  blocks: [box(246, 470, 22, 32), box(262, 440, 74, 62), box(272, 416, 50, 26), box(306, 398, 20, 20)],
  shade: [box(320, 440, 16, 62), box(314, 416, 8, 26), box(246, 470, 6, 32)],
  roof: box(301, 393, 30, 5),
  beams: [box(262, 459, 74, 2.5), box(272, 431, 50, 2), box(262, 440, 74, 2.5)],
  windows: [
    [272, 447], [286, 447], [300, 447], [314, 447], [252, 480], [274, 478], [294, 478], [314, 478], [282, 422], [298, 422], [312, 403],
  ].map(([x, y]) => box(x, y, 4.5, 7)),
};

// Top edge of the fort ridge, for placing houses and terraces on its slope.
const ridgeTop: Pt[] = [[-40, 600], [40, 575], [120, 548], [180, 526], [232, 510], [352, 510], [390, 522], [450, 554], [520, 600], [600, 648], [690, 700]];
function yAtX(edge: Pt[], x: number): number {
  for (let i = 1; i < edge.length; i++) {
    const [x0, y0] = edge[i - 1];
    const [x1, y1] = edge[i];
    if (x >= x0 && x <= x1) return y0 + ((x - x0) / (x1 - x0 || 1)) * (y1 - y0);
  }
  return edge[edge.length - 1][1];
}

export const village = (() => {
  const rand = random(61);
  const houses: { x: number; y: number; width: number; height: number; win: Box; lit: boolean }[] = [];
  const clusters: [number, number, number][] = [[150, 30, 5], [404, 34, 5], [470, 40, 4], [560, 30, 3], [96, 24, 3]];
  for (const [cx, spread, count] of clusters) {
    for (let i = 0; i < count; i++) {
      const x = cx + (rand() - 0.5) * spread * 2;
      const width = 8 + rand() * 7;
      const height = 5 + rand() * 3.5;
      const y = yAtX(ridgeTop, x) + 10 + rand() * 30;
      houses.push({ x: x - width / 2, y: y - height, width, height, win: box(x - 1.2, y - height + 1.8, 2.4, 2.6), lit: rand() > 0.3 });
    }
  }
  return houses.sort((a, b) => a.y - b.y);
})();

export const terraces = (() => {
  const rand = random(62);
  return Array.from({ length: 26 }, () => {
    const x = 20 + rand() * 600;
    const y = yAtX(ridgeTop, x) + 16 + rand() * 90;
    return box(x, y, 18 + rand() * 46, 2);
  });
})();

/* --------------------------------------------------------------------- Lake */

export const lake = {
  shimmer: (() => {
    const rand = random(71);
    return Array.from({ length: 52 }, (_, i) => {
      const depth = rand() ** 1.6;
      return {
        x: -100 + rand() * 1800,
        y: 712 + depth * 280,
        w: 14 + rand() * 70 * (0.4 + depth),
        o: 0.3 + rand() * 0.45,
        delay: (i % 7) * 0.9,
      };
    });
  })(),
};

/* ------------------------------------------------------------ Shores, trees */

export const shores = {
  left: path([[-420, 702], [-200, 700], [120, 698], [300, 703], [460, 712], [560, 724], [610, 740], [560, 752], [420, 758], [-420, 766]]),
  right: path([[2020, 700], [1640, 699], [1440, 698], [1260, 704], [1120, 714], [1040, 730], [1010, 746], [1080, 754], [1260, 758], [2020, 764]]),
};

function shoreTop(x: number): number {
  return x < 800 ? 700 + Math.max(0, (x - 120) / 440) ** 2 * 22 : 700 + Math.max(0, (1440 - x) / 420) ** 2 * 26;
}

function poplarPath(x: number, base: number, w: number, h: number, half = false): string {
  const top = base - h;
  if (half) {
    return `M${n(x)} ${n(top)}C${n(x + w * 0.7)} ${n(base - h * 0.85)} ${n(x + w)} ${n(base - h * 0.25)} ${n(x)} ${n(base)}Z`;
  }
  return (
    `M${n(x)} ${n(base)}C${n(x - w)} ${n(base - h * 0.25)} ${n(x - w * 0.7)} ${n(base - h * 0.85)} ${n(x)} ${n(top)}` +
    `C${n(x + w * 0.7)} ${n(base - h * 0.85)} ${n(x + w)} ${n(base - h * 0.25)} ${n(x)} ${n(base)}Z`
  );
}

export const trees = (() => {
  const rand = random(81);
  const poplars: { full: string; shade: string }[] = [];
  const orchard: { cx: number; cy: number; r: number }[] = [];
  const rows: [number, number][] = [[-400, 560], [1050, 2000]];
  for (const [from, to] of rows) {
    for (let x = from; x < to; x += 12 + rand() * 14) {
      const base = shoreTop(x) + 6 + rand() * 4;
      if (rand() < 0.62) {
        const h = 40 + rand() * 54;
        const w = 7 + rand() * 6;
        poplars.push({ full: poplarPath(x, base, w, h), shade: poplarPath(x, base, w, h, true) });
      } else {
        orchard.push({ cx: x, cy: base - 7, r: 6 + rand() * 6 });
      }
    }
  }
  return { poplars, orchard };
})();

/* -------------------------------------------------------- Foreground cliffs */

function xAtY(edge: Pt[], y: number): number {
  for (let i = 1; i < edge.length; i++) {
    const [x0, y0] = edge[i - 1];
    const [x1, y1] = edge[i];
    if ((y >= y0 && y <= y1) || (y >= y1 && y <= y0)) return x0 + ((y - y0) / (y1 - y0 || 1)) * (x1 - x0);
  }
  return edge[edge.length - 1][0];
}

function cliff(side: "left" | "right") {
  const sign = side === "left" ? 1 : -1;
  const mirror = (x: number) => (side === "left" ? x : VIEW.w - x);
  const keys: Pt[] = [
    [40, 100], [120, 186], [176, 262], [230, 336], [264, 424], [302, 506], [338, 594], [372, 684], [404, 772], [440, 862], [468, 944], [482, 1040],
  ].map(([x, y]) => [mirror(x + (side === "right" ? -30 : 0)), y]);
  const inner = roughen(keys, side === "left" ? 91 : 92, 0.14);
  const outerX = mirror(-520);
  const outline: Pt[] = [[outerX, 1040], [outerX, side === "left" ? 60 : 30], ...inner];
  const rand = random(side === "left" ? 93 : 94);
  const strata = [190, 300, 420, 540, 660, 780, 900].map((y) => {
    const ix = xAtY(inner, y);
    return path(roughen([[outerX, y + 70 + rand() * 30], [ix - sign * (60 + rand() * 40), y + rand() * 12], [ix - sign * 8, y - 4]], 95 + y, 0.12, 2), false);
  });
  return { body: path(outline), rim: path(inner, false), strata };
}

export const cliffs = { left: cliff("left"), right: cliff("right") };

/* ------------------------------------------------------- Suspension bridge */

function quad(p0: Pt, c: Pt, p2: Pt, t: number): Pt {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p2[1]];
}

/** Quadratic control point that makes a curve between y0 ends sag to `mid` at its centre. */
const sagControl = (x0: number, x1: number, y: number, mid: number): Pt => [(x0 + x1) / 2, 2 * mid - y];

export const bridge = (() => {
  const x0 = 360;
  const x1 = 1270;
  const deck: [Pt, Pt, Pt] = [[x0, 762], sagControl(x0, x1, 762, 846), [x1, 762]];
  const railFar: [Pt, Pt, Pt] = [[x0, 698], sagControl(x0, x1, 698, 792), [x1, 698]];
  const railNear: [Pt, Pt, Pt] = [[x0, 706], sagControl(x0, x1, 706, 802), [x1, 706]];
  const q = (c: [Pt, Pt, Pt]) => `M${n(c[0][0])} ${n(c[0][1])}Q${n(c[1][0])} ${n(c[1][1])} ${n(c[2][0])} ${n(c[2][1])}`;
  const rand = random(101);
  const planks: { x: number; y: number; angle: number }[] = [];
  const hangers: string[] = [];
  const count = 64;
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const [x, y] = quad(...deck, t);
    const [xa, ya] = quad(...deck, Math.min(1, t + 0.001));
    if (rand() > 0.22) planks.push({ x, y, angle: (Math.atan2(ya - y, xa - x) * 180) / Math.PI });
    if (i % 3 === 0) {
      const [rx, ry] = quad(...railNear, t);
      hangers.push(`M${n(rx)} ${n(ry)}L${n(x)} ${n(y)}`);
    }
  }
  return {
    deck: q(deck),
    deckLow: q([[x0, 768], sagControl(x0, x1, 768, 852), [x1, 768]]),
    railFar: q(railFar),
    railNear: q(railNear),
    hangers,
    planks,
    posts: [x0 - 6, x1 - 2].map((x) => ({ x, y: 690, w: 8, h: 84 })),
  };
})();

/* -------------------------------------------------------------------- Stars */

export const stars = (() => {
  const rand = random(111);
  return Array.from({ length: 150 }, (_, i) => ({
    cx: -200 + rand() * 2000,
    cy: rand() ** 1.5 * 620,
    r: 0.5 + rand() ** 3 * 1.6,
    o: 0.35 + rand() * 0.65,
    twinkle: i % 5 === 0,
  }));
})();
