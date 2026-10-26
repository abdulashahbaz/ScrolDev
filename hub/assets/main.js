// Scroldev: the motion layer.
// The brand's motion rules, in code: motion follows the scroll (scroll is the play button), one easing curve,
// one thing moves at a time, and things fade instead of stopping. With reduced motion on, only fades remain.

const root = document.documentElement;
root.classList.add("ready");

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const wide = matchMedia("(min-width: 900px)");

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = bezier(0.65, 0, 0.35, 1);
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

// The brand curve, cubic-bezier(0.65, 0, 0.35, 1), sampled once into a lookup table.
function bezier(x1, y1, x2, y2) {
  const at = (a, b, t) => 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
  const table = new Float32Array(201);
  for (let i = 0; i <= 200; i++) {
    const x = i / 200;
    let lo = 0, hi = 1;
    for (let j = 0; j < 24; j++) {
      const m = (lo + hi) / 2;
      if (at(x1, x2, m) < x) lo = m;
      else hi = m;
    }
    table[i] = at(y1, y2, (lo + hi) / 2);
  }
  return (x) => table[Math.round(clamp(x) * 200)];
}

/* ---------- One frame loop for everything scroll-linked ---------- */

const state = { y: scrollY, dy: 0, jumped: false };
const always = new Set();
const visible = new Set();
let frame = 0;

function schedule() {
  if (!frame) frame = requestAnimationFrame(render);
}

function render() {
  frame = 0;
  const y = scrollY;
  state.dy = state.jumped ? 0 : y - state.y;
  state.jumped = false;
  state.y = y;
  const vh = innerHeight;
  for (const fn of always) fn(vh);
  for (const fn of visible) fn(vh);
}

// Runs fn every frame while el is on (or near) the screen.
function whileVisible(el, fn, margin = "15% 0px") {
  if (!el) return;
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) visible.add(fn);
      else visible.delete(fn);
      schedule();
    },
    { rootMargin: margin },
  ).observe(el);
}

addEventListener("scroll", schedule, { passive: true });

/* ---------- Layout measurements ---------- */

const layout = { surfaces: [], heroEnd: 0, pageEnd: 1, targets: [] };
const header = $(".header");
const hud = $(".hud");
const footer = $(".footer");
const navLinks = $$(".nav a");

function measure() {
  for (const fn of servicesSizing) fn();
  const y = scrollY;
  const top = (el) => el.getBoundingClientRect().top + y;
  layout.surfaces = $$("[data-surface]").map((el) => {
    const t = top(el);
    return { top: t, bottom: t + el.offsetHeight, surface: el.dataset.surface };
  });
  const hero = $("[data-hero]");
  layout.heroEnd = hero ? top(hero) + hero.offsetHeight : innerHeight;
  layout.pageEnd = Math.max(1, top(footer) + footer.offsetHeight - innerHeight);
  layout.targets = navLinks.map((a) => {
    const el = document.getElementById(a.hash.slice(1));
    return { a, top: el ? top(el) : Infinity };
  });
  const contact = document.getElementById("contact");
  layout.contactTop = contact ? top(contact) : Infinity;
  const services = $(".services");
  layout.servicesTop = services ? top(services) : 0;
  layout.servicesEnd = services ? layout.servicesTop + services.offsetHeight : 0;
  schedule();
}

function surfaceAt(docY) {
  for (const s of layout.surfaces) if (docY >= s.top && docY < s.bottom) return s.surface;
  return "ink";
}

addEventListener("resize", measure);
new ResizeObserver(() => measure()).observe(document.body);
document.fonts?.ready.then(measure);
addEventListener("load", measure);

/* ---------- Header, progress, counter ---------- */

function chrome() {
  let travel = 0;
  const thumb = $(".progress-thumb");
  const counts = $$("[data-count]");
  let total = 0;
  let shown = -1;
  let current = null;

  always.add((vh) => {
    const { y, dy } = state;

    // Hide on the way down, return on the way up.
    travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
    if (root.classList.contains("menu-open") || y < 80 || travel < -28) header.classList.remove("is-hidden");
    else if (travel > 56 && y > vh * 0.6) header.classList.add("is-hidden");
    header.classList.toggle("is-scrolled", y > 24);
    header.classList.toggle("is-past-hero", y > layout.heroEnd - vh * 0.35);
    // The hero's Ember screen only counts while it is still under the bar or the counter.
    header.dataset.on = heroState.ember && y + 36 < layout.heroEnd ? "ember" : surfaceAt(y + 36);

    // Which nav section are we in?
    let next = null;
    if (y + vh * 0.4 < layout.contactTop) {
      for (const t of layout.targets) if (t.top <= y + vh * 0.4) next = t.a;
    }
    if (next !== current) {
      current?.classList.remove("is-current");
      next?.classList.add("is-current");
      current = next;
    }

    // Top progress: the thumb travels the track.
    const end = layout.pageEnd;
    const p = clamp(y / end);
    thumb.style.setProperty("--x", `${(p * (innerWidth - 96)).toFixed(1)}px`);

    // The live pixel count: every pixel scrolled this visit.
    total += Math.abs(dy);
    const rounded = Math.round(total);
    if (rounded !== shown) {
      shown = rounded;
      const text = `${rounded.toLocaleString("en-US")}px`;
      for (const c of counts) c.textContent = text;
    }
    // The counter steps aside while the services section is pinned (it has its own meter) and rests once the
    // contact section arrives; the footer carries its own count.
    const pinned = wide.matches && y >= layout.servicesTop - vh * 0.2 && y < layout.servicesEnd - vh * 0.8;
    hud.classList.toggle("is-on", !pinned && y + vh - 44 < layout.contactTop);
    hud.dataset.on = heroState.ember && y + vh - 44 < layout.heroEnd ? "ember" : surfaceAt(y + vh - 44);
  });
}

/* ---------- Mobile menu ---------- */

function menu() {
  const button = $(".menu-button");
  const panel = $("#menu");
  if (!button || !panel) return;
  let closeTimer = 0;
  // While the menu is open, the page behind it can't be reached by Tab or a screen reader.
  const behind = [$("main"), footer];

  const open = () => {
    clearTimeout(closeTimer);
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("is-open"));
    root.classList.add("menu-open", "is-locked");
    button.setAttribute("aria-expanded", "true");
    for (const el of behind) el.inert = true;
    $("a", panel)?.focus({ preventScroll: true });
  };
  const close = (refocus) => {
    panel.classList.remove("is-open");
    root.classList.remove("menu-open", "is-locked");
    button.setAttribute("aria-expanded", "false");
    for (const el of behind) el.inert = false;
    closeTimer = setTimeout(() => (panel.hidden = true), 450);
    if (refocus) button.focus();
  };

  button.addEventListener("click", () => (panel.hidden ? open() : close()));
  panel.addEventListener("click", (e) => e.target.closest("a") && close());
  addEventListener("keydown", (e) => e.key === "Escape" && !panel.hidden && close(true));
  wide.addEventListener("change", (e) => e.matches && !panel.hidden && close());
}

/* ---------- Reveals ----------
   Blocks fade up as they arrive. Headlines go further: each word rises through its line, like the hero's. Screen
   readers get the headline whole, from a hidden copy; the split words are only for the eye. */

function splitWords(el) {
  const copy = Object.assign(document.createElement("span"), {
    className: "visually-hidden",
    textContent: el.textContent.trim().replace(/\s+/g, " "),
  });
  const shown = document.createElement("span");
  shown.setAttribute("aria-hidden", "true");
  shown.append(...el.childNodes);
  let n = 0;
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.ELEMENT_NODE) walk(child);
      if (child.nodeType !== Node.TEXT_NODE) continue;
      const parts = child.textContent.split(/(\s+)/).filter(Boolean);
      child.replaceWith(
        ...parts.map((part) => {
          if (/^\s+$/.test(part)) return " ";
          const word = Object.assign(document.createElement("span"), { className: "word" });
          const inner = Object.assign(document.createElement("span"), { textContent: part });
          inner.style.setProperty("--w", n++);
          word.append(inner);
          return word;
        }),
      );
    }
  };
  walk(shown);
  el.append(copy, shown);
  el.classList.add("split");
}

function reveals() {
  if (!calm) for (const el of $$(".h1[data-reveal], .statement[data-reveal], .contact-title[data-reveal]")) splitWords(el);
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  for (const el of $$("[data-reveal]")) io.observe(el);
}

/* ---------- Hero: the animated mark ----------
   The logo mark, drawn on a canvas so it stays sharp at any size. It draws itself on load, then its thumb scrolls
   down its track and back, like the logo animation. Scrolling pins the stage: the text dissolves downward, the mark
   moves to the centre and grows, and the view dives into the thumb until the screen is Ember. */

const START = performance.now();
const TRACK_LEN = 47 + Math.PI * 14 + 47; // the open arch: left leg, top arc, right leg
const heroState = { ember: false };

// The thumb at time t (seconds since load): it arrives, then scrolls down its track and back every five seconds.
function thumbAt(t) {
  if (calm) return { arrive: 1, y: 12 };
  const arrive = ease(clamp((t - 0.8) / 0.45));
  const cycle = t < 2.6 ? -1 : (t - 2.6) % 5;
  const travel = cycle < 0 ? 0 : ease(clamp(cycle / 0.8)) - ease(clamp((cycle - 0.8) / 0.8));
  return { arrive, y: 4 + 8 * arrive + 22 * travel };
}

function heroStage(stage) {
  const canvas = $(".hero-mark", stage);
  if (!canvas) return;
  const section = stage.parentElement;
  const ctx = canvas.getContext("2d");
  const words = $$(".hero-title .line > span, .hero-lede, .hero-actions > *", stage);
  const label = $(".hero-label", stage);
  let w = 0, h = 0, dpr = 1, raf = 0, shown = false, last = "";
  let mx = 0, my = 0, px = 0, py = 0, textRight = 0, labelTop = 0;
  // The pointer in screen pixels, how firmly the thumb is following it (0 → 1), where it is following it to, and
  // where the mark was last drawn (for hit-testing the pointer against it).
  let cx = -1, cy = -1, grab = 0, fy = 12, shownY = 12, settling = false, geo = null;

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    // How far the hero's words reach, so the mark can stand in the middle of the space they leave.
    textRight = words.length ? Math.max(...words.map((el) => el.getBoundingClientRect().right)) : w * 0.6;
    // On phones the mark stands above the words, so it needs to know where they start (offsetTop ignores the
    // scroll-linked drift on the copy).
    labelTop = h * 0.45;
    if (label) for (let el = label, top = 0; el; el = el.offsetParent) {
      top += el.offsetTop;
      if (el.offsetParent === stage) {
        labelTop = top;
        break;
      }
    }
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    last = "";
    tick();
  }

  function progress() {
    if (!section || calm) return 0;
    const r = section.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - h));
  }

  // Frames run only while something moves (the intro, a thumb loop, the pointer drift); scrolling wakes a frame,
  // and between loops a timer wakes it for the next one. A still page costs nothing.
  let timer = 0;
  const wake = () => {
    if (!raf && shown) raf = requestAnimationFrame(tick);
  };
  function tick() {
    raf = 0;
    frame();
    if (!shown || calm) return;
    const t = (performance.now() - START) / 1000;
    const cycle = t < 2.6 ? -1 : (t - 2.6) % 5;
    const moving = t < 2.7 || (cycle >= 0 && cycle < 1.7) || settling || Math.abs(mx - px) > 0.002 || Math.abs(my - py) > 0.002;
    clearTimeout(timer);
    if (moving) raf = requestAnimationFrame(tick);
    else timer = setTimeout(wake, (cycle < 0 ? 2.6 - t : 5 - cycle) * 1000);
  }

  function frame() {
    if (!w || !h) return;
    const t = (performance.now() - START) / 1000;
    const p = progress();

    const out = clamp(p / 0.16); // the text dissolves
    const move = ease(clamp((p - 0.06) / 0.34)); // the mark comes to the centre and grows
    const dive = clamp((p - 0.4) / 0.32); // then the view dives into the thumb
    const say = ease(clamp((p - 0.76) / 0.14)); // and the Ember line arrives

    px += (mx - px) * 0.08;
    py += (my - py) * 0.08;
    const thumb = thumbAt(t);
    const rest = 1 - clamp(p / 0.05);
    // With a mouse over the mark, the thumb leaves its loop and follows the pointer up and down its track, never
    // sideways; once the pointer leaves, it eases back into the loop.
    const over = !!geo && rest > 0.5 && thumb.arrive === 1 && Math.abs(cx - geo.sx) < geo.k * 24 &&
      cy > geo.sy - geo.ay * geo.k - 24 && cy < geo.sy + (64 - geo.ay) * geo.k;
    const target = over ? clamp((cy - geo.sy) / geo.k + geo.ay - 9.5, 8, 38) : fy;
    if (over && grab < 0.05) fy = shownY; // pick the thumb up where it is
    fy += (target - fy) * 0.2;
    grab += ((over ? 1 : 0) - grab) * 0.12;
    if (grab < 0.001) grab = 0;
    settling = Math.abs((over ? 1 : 0) - grab) > 0.002 || Math.abs(target - fy) > 0.01;
    shownY = thumb.y + (fy - thumb.y) * grab;
    const thumbY = 12 + (shownY - 12) * rest;
    const draw = calm ? 1 : ease(clamp((t - 0.1) / 0.8));

    const key = [p, thumbY, thumb.arrive, draw, px, py, w, h].map((v) => v.toFixed(3)).join();
    if (key === last) return;
    last = key;

    stage.style.setProperty("--out", out.toFixed(3));
    stage.style.setProperty("--say", say.toFixed(3));
    stage.classList.toggle("is-out", out > 0.6);

    // Where the mark sits: right of the headline on wide screens; on phones, centred above the centred words.
    const wide = w >= 900;
    const edge = Math.min(80, Math.max(20, w * 0.056)); // the page margin
    const k1 = (h * 0.74) / 64;
    // Phones: the mark stands in the band between the header and the words, clear of both. A phone too short for that
    // band doesn't show it at rest; it fades in at the centre as the words dissolve.
    const bandTop = 100, bandBottom = labelTop - 28;
    const roomy = wide || bandBottom - bandTop >= 100;
    const k0 = wide ? Math.min(h * 0.58, 600) / 64 : roomy ? Math.min(bandBottom - bandTop, h * 0.34, 280) / 64 : k1 * 0.8;
    const half = 20 * k0; // half the mark's width
    const x0 = wide ? Math.min(w - edge - half, Math.max((textRight + w - edge) / 2, textRight + half + 32)) : w / 2;
    const y0 = wide ? h * 0.53 : roomy ? (bandTop + bandBottom) / 2 : h / 2;
    const presence = roomy ? 1 : ease(clamp(out * 1.25));
    const kEnd = 1.3 * Math.max(w / 7.5, h / 11.5);
    const drift = 1 - move;
    let k = k0 + (k1 - k0) * move;
    const sx = x0 + (w / 2 - x0) * move + px * 18 * drift;
    const sy = y0 + (h / 2 - y0) * move + py * 12 * drift;
    let ay = 32;
    if (dive > 0) {
      k = k1 * Math.pow(kEnd / k1, ease(dive));
      ay = 32 + (thumbY + 9.5 - 32) * ease(clamp(dive * 1.8));
    }
    const at = (ux, uy) => [sx + (ux - 20) * k, sy + (uy - ay) * k];
    geo = { sx, sy, k, ay };

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Once the thumb covers the screen it is the screen: an Ember page.
    const [left, top] = at(16.25, thumbY + 3.75);
    const [right, bottom] = at(23.75, thumbY + 15.25);
    const ember = left <= 0 && right >= w && top <= 0 && bottom >= h;
    heroState.ember = ember;
    if (ember) {
      emberPage(say);
      return;
    }

    // The mark stands in a soft pool of Ember light, the same light as every section's, centred on the arch rather
    // than ringing the thumb. It comes up as the thumb arrives.
    const [gx, gy] = at(20, 34);
    const radius = Math.min(k * 40, Math.max(w, h));
    const light = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius);
    light.addColorStop(0, `rgba(255, 79, 26, ${0.14 * thumb.arrive * presence})`);
    light.addColorStop(0.5, `rgba(232, 64, 12, ${0.056 * thumb.arrive * presence})`);
    light.addColorStop(1, "rgba(232, 64, 12, 0)");
    ctx.fillStyle = light;
    ctx.fillRect(gx - radius, gy - radius, radius * 2, radius * 2);

    // The mark, in its own 40 × 64 units.
    ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * (sx - 20 * k), dpr * (sy - ay * k));
    const fade = ctx.createLinearGradient(0, 0, 0, 64);
    fade.addColorStop(0.42, "rgba(243, 238, 230, 1)");
    fade.addColorStop(1, "rgba(243, 238, 230, 0)");
    ctx.strokeStyle = fade;
    ctx.lineWidth = 5.2;
    ctx.globalAlpha = presence;
    ctx.setLineDash([TRACK_LEN * draw, TRACK_LEN]);
    ctx.beginPath();
    ctx.moveTo(6, 64);
    ctx.lineTo(6, 17);
    ctx.arc(20, 17, 14, Math.PI, 0);
    ctx.lineTo(34, 64);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    if (thumb.arrive > 0) {
      const fill = ctx.createLinearGradient(0, thumbY, 0, thumbY + 19);
      fill.addColorStop(0, "#FF6533");
      fill.addColorStop(1, "#E8400C");
      ctx.globalAlpha = thumb.arrive * presence;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(16.25, thumbY, 7.5, 19, 3.75);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Inside the thumb, a page in the style of the brand book's Ember chapter openers: flat Ember and the pill grid in
  // white, with the promise centred over it (in the markup).
  function emberPage(say) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const base = ctx.createLinearGradient(0, 0, w, h);
    base.addColorStop(0, "#FF5824");
    base.addColorStop(1, "#F44A15");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    if (say > 0) {
      ctx.globalAlpha = 0.16 * say;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let y = 7.5; y < h; y += 15) {
        for (let x = 7.5; x < w; x += 15) {
          ctx.moveTo(x, y - 1.5);
          ctx.lineTo(x, y + 1.5);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  new ResizeObserver(resize).observe(canvas);
  document.fonts?.ready.then(resize);
  new IntersectionObserver(([e]) => {
    shown = e.isIntersecting;
    wake();
  }).observe(stage);
  addEventListener("scroll", wake, { passive: true });
  if (finePointer && !calm) {
    addEventListener("pointermove", (e) => {
      mx = (e.clientX / innerWidth - 0.5) * 2;
      my = (e.clientY / innerHeight - 0.5) * 2;
      cx = e.clientX;
      cy = e.clientY;
      wake();
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => {
      cx = cy = -1;
      wake();
    });
  }
}

/* ---------- The pill grid ----------
   The brand's pill-grid tile (2 × 5px pills every 15px), drawn live in one fixed layer behind every dark section.
   Ember is kept for the pointer: pills near it warm to Ember and turn to circle it, then cool slowly once it moves
   on, so it leaves a fading orange trail. On touch screens the trail follows the finger. The grid also answers the
   scroll: it drifts up at a fraction of the page's speed, so it reads as a layer behind, and its pills stretch with
   scroll speed, then settle back. */

function pillField(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const GAP = 15, LEN = 5, WIDTH = 2, RADIUS = 120, SHADES = 16, PEAK = 0.62;
  const DRIFT = 0.18; // the grid's share of the scroll
  // The resting grid sits just above Ink: texture you notice, never louder than the words over it.
  const cool = [33, 30, 27], ember = [255, 79, 26];
  const shade = Array.from({ length: SHADES + 1 }, (_, i) =>
    `rgb(${cool.map((c, j) => Math.round(c + (ember[j] - c) * (i / SHADES) * PEAK)).join(",")})`,
  );
  let w = 0, h = 0, dpr = 1, n = 0, cols = 0;
  let xs, ys, as, heat;
  let px = -1e5, py = -1e5;
  let running = 0;
  let row = 0, offset = 0, stretch = 0, lastY = scrollY;
  const travel = () => (calm ? 0 : scrollY * DRIFT);

  // Where the grid sits for the current scroll. It is drawn one row taller than the screen and nudged up by the
  // part of a row it has drifted; each whole row it drifts, the warmth and turn move up a row with their pills.
  function place() {
    const next = Math.floor(travel() / GAP);
    offset = travel() - next * GAP;
    const k = next - row;
    row = next;
    if (!k || !n) return;
    const by = Math.abs(k) * cols;
    for (const values of [heat, as]) {
      if (by >= n) values.fill(0);
      else if (k > 0) values.copyWithin(0, by).fill(0, n - by);
      else values.copyWithin(by, 0, n - by).fill(0, 0, by);
    }
  }

  function build() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    cols = Math.ceil(w / GAP);
    const rows = Math.ceil(h / GAP) + 1;
    n = cols * rows;
    xs = new Float32Array(n);
    ys = new Float32Array(n);
    as = new Float32Array(n);
    heat = new Float32Array(n);
    for (let r = 0, i = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++, i++) {
        xs[i] = GAP / 2 + c * GAP;
        ys[i] = GAP / 2 + r * GAP;
      }
    }
    row = Math.floor(travel() / GAP);
    place();
    draw();
  }

  function pill(i) {
    const half = (LEN / 2) * (1 + heat[i] * 0.5 + stretch * 1.2) - WIDTH / 2;
    const dx = Math.sin(as[i]) * half, dy = Math.cos(as[i]) * half;
    ctx.moveTo(xs[i] - dx, ys[i] - dy);
    ctx.lineTo(xs[i] + dx, ys[i] + dy);
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, -offset * dpr);
    ctx.lineWidth = WIDTH;
    ctx.lineCap = "round";
    // One stroke per shade: the cold grid in a single pass, then the warm pills from dim to Ember.
    const warm = [];
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const level = Math.round(heat[i] * SHADES);
      if (level) warm.push(i, level);
      else pill(i);
    }
    ctx.strokeStyle = shade[0];
    ctx.stroke();
    for (let level = 1; level <= SHADES; level++) {
      ctx.beginPath();
      let any = false;
      for (let j = 0; j < warm.length; j += 2) {
        if (warm[j + 1] !== level) continue;
        pill(warm[j]);
        any = true;
      }
      if (!any) continue;
      ctx.strokeStyle = shade[level];
      ctx.stroke();
    }
  }

  function step() {
    running = 0;
    place();
    // Fast scrolling stretches the pills, like a long exposure; they settle back once the page slows.
    const y = scrollY;
    const speed = Math.min(1, Math.abs(y - lastY) / 50);
    lastY = y;
    stretch += (speed - stretch) * (speed > stretch ? 0.35 : 0.1);
    if (stretch < 0.005) stretch = 0;
    let busy = stretch > 0;
    const R2 = RADIUS * RADIUS;
    for (let i = 0; i < n; i++) {
      const dx = px - xs[i], dy = py - (ys[i] - offset);
      const d2 = dx * dx + dy * dy;
      let k = 0, target = 0;
      if (d2 < R2) {
        const f = 1 - Math.sqrt(d2) / RADIUS;
        k = f * f * (3 - 2 * f);
        target = (Math.atan2(dx, dy) + Math.PI / 2) * k;
      }
      // Warm up quickly, cool down slowly: things fade, they don't stop.
      const hv = heat[i];
      heat[i] = k > hv ? hv + (k - hv) * 0.3 : hv * 0.965;
      if (heat[i] < 0.01) heat[i] = 0;
      // Pills are symmetric, so turn the short way round (angles repeat every half turn).
      let diff = (target - as[i]) % Math.PI;
      if (diff > Math.PI / 2) diff -= Math.PI;
      else if (diff < -Math.PI / 2) diff += Math.PI;
      as[i] += diff * (k ? 0.16 : 0.06);
      if (heat[i] || Math.abs(diff) > 0.003) busy = true;
    }
    draw();
    if (busy) running = requestAnimationFrame(step);
  }

  const kick = () => {
    if (!running) running = requestAnimationFrame(step);
  };
  const point = (x, y) => {
    px = x;
    py = y;
    kick();
  };
  const away = () => point(-1e5, -1e5);

  new ResizeObserver(build).observe(canvas);
  if (calm) return;
  addEventListener("scroll", kick, { passive: true });
  addEventListener("pointermove", (e) => point(e.clientX, e.clientY), { passive: true });
  addEventListener("touchstart", (e) => point(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  addEventListener("touchmove", (e) => point(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  addEventListener("touchend", away, { passive: true });
  document.documentElement.addEventListener("pointerleave", away);
  addEventListener("blur", away);
}

/* ---------- 01 The idea: the manifesto lights up word by word as you read down ---------- */

function manifesto() {
  const el = $("[data-words]");
  if (!el || calm) return;
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = "";
  const spans = words.map((word, i) => {
    const s = document.createElement("span");
    s.className = "w";
    s.textContent = word;
    el.append(s, i < words.length - 1 ? " " : "");
    return s;
  });
  let lit = 0;
  whileVisible(el, (vh) => {
    const r = el.getBoundingClientRect();
    const p = clamp((vh * 0.85 - r.top) / (vh * 0.5 + r.height));
    const next = Math.round(p * spans.length);
    if (next === lit) return;
    const [from, to, on] = next > lit ? [lit, next, true] : [next, lit, false];
    for (let i = from; i < to; i++) spans[i].classList.toggle("is-lit", on);
    lit = next;
  });
}

/* ---------- 02 What we build ----------
   On desktop the section pins and its panels slide past sideways at scroll speed. Each panel's demo is driven by
   --d (0 → 1) as the panel arrives; on phones the panels stack and play as they scroll up into view. */

const servicesSizing = [];

function services() {
  const section = $(".services");
  if (!section) return;
  const track = $(".services-track", section);
  const panels = $$(".service", section);
  const index = $("[data-services-index]", section);
  const meter = $(".meter-track", section);
  const meterThumb = $(".meter-thumb", section);
  const gauge = $("[data-gauge]", section);
  const cms = $(".cms", section);
  const cmsText = $("[data-cms-text]", section);
  const cmsStatus = $("[data-cms-status]", section);
  const headline = cmsText.dataset.cmsText;
  const horizontal = () => wide.matches && !calm;
  let distance = 0;
  let current = -1;

  if (calm) return; // the markup's resting state is every demo finished

  servicesSizing.push(() => {
    if (horizontal()) {
      distance = Math.max(0, track.scrollWidth - innerWidth);
      const height = `${Math.round(innerHeight + distance)}px`;
      if (section.style.height !== height) section.style.height = height;
    } else {
      distance = 0;
      section.style.height = "";
      track.style.transform = "";
    }
  });

  whileVisible(section, (vh) => {
    const vw = innerWidth;
    let p = 0;
    if (horizontal()) {
      const r = section.getBoundingClientRect();
      p = clamp(-r.top / Math.max(1, r.height - vh));
      track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
      meterThumb.style.setProperty("--mx", `${(p * (meter.offsetWidth - meterThumb.offsetWidth)).toFixed(1)}px`);
    }
    let lead = 0;
    panels.forEach((panel, i) => {
      const r = panel.getBoundingClientRect();
      const d = horizontal() ? clamp((vw * 0.94 - r.left) / (vw * 0.5)) : clamp((vh * 0.95 - r.top) / (vh * 0.6));
      panel.style.setProperty("--d", d.toFixed(3));
      if (d > 0.55) lead = i;
      if (i === 2) gauge.textContent = String(Math.round(ease(d) * 90));
      if (i === 3) {
        const typed = clamp((d - 0.1) / 0.6);
        cmsText.textContent = headline.slice(0, Math.round(typed * headline.length));
        const live = d > 0.9;
        cms.classList.toggle("is-published", live);
        cmsStatus.textContent = live ? "Published" : "Draft";
      }
    });
    if (lead !== current) {
      current = lead;
      index.textContent = String(lead + 1).padStart(2, "0");
    }
  });
}

/* ---------- Pillars: the row nearest the middle of the screen is lit ---------- */

function pillars() {
  const list = $(".pillar-list");
  if (!list || calm) return;
  const items = $$(".pillar", list);
  let active = null;
  whileVisible(list, (vh) => {
    let best = items[0], bestD = Infinity;
    for (const it of items) {
      const r = it.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - vh * 0.5);
      if (d < bestD) {
        bestD = d;
        best = it;
      }
    }
    if (best === active) return;
    active?.classList.remove("is-active");
    best.classList.add("is-active");
    active = best;
  });
}

/* ---------- 04 How Scroldev works ----------
   Each step has a small demo of that part of the work, driven by --p (0 → 1): it plays as the step is read and runs
   back if you scroll back up. On desktop the demos share one pinned stage, which shows the step being read; on
   phones each demo sits under its step and plays as it rises up the screen. With reduced motion every demo is
   shown finished. */

const staged = matchMedia("(min-width: 1000px) and (min-height: 640px)");

function flow() {
  const wrap = $(".flow");
  if (!wrap) return;
  const steps = $$(".flow-step", wrap);
  const demos = $$(".flow-demo", wrap);
  const stageEl = $(".flow-stage", wrap);
  const index = $("[data-flow-index]", wrap);
  const meter = $(".flow-meter", wrap);
  const typed = $("[data-type]", wrap);
  const text = typed.textContent;
  const count = $("[data-live-count]", wrap);
  const played = demos.map(() => -1);
  let current = -1;

  function play(i, p) {
    if (p === played[i]) return;
    played[i] = p;
    const demo = demos[i];
    demo.style.setProperty("--p", p);
    // The brief types over the first half; the live site's scroll count runs over the last part.
    if (demo.contains(typed)) typed.textContent = text.slice(0, Math.round(clamp(p / 0.5) * text.length));
    if (demo.contains(count)) count.textContent = `${Math.round(ease(clamp((p - 0.7) / 0.3)) * 4218).toLocaleString("en-US")}px`;
  }

  function show(i) {
    if (i === current) return;
    current = i;
    steps.forEach((s, j) => s.classList.toggle("is-on", j === i));
    demos.forEach((d, j) => d.classList.toggle("is-on", j === i));
    index.textContent = String(i + 1).padStart(2, "0");
    meter.style.setProperty("--step", i);
  }

  whileVisible(wrap, (vh) => {
    const stage = staged.matches;
    // Where the stage pins: centred on the screen, a little below the header (matches the CSS).
    const pin = stage ? (vh - stageEl.offsetHeight) / 2 + 28 : 0;
    const rects = (stage ? steps : demos).map((el) => el.getBoundingClientRect());
    let lead = 0;
    rects.forEach((r, i) => {
      if (stage ? r.top < pin + r.height * 0.35 : r.top < vh * 0.55) lead = i;
      // On the stage a demo plays as its step's words pass the middle; under a step, as it rises up the screen.
      const p = calm ? 1 : stage ? clamp((pin + r.height * 0.2 - r.top) / (r.height * 0.5)) : clamp((vh * 0.92 - r.top) / (vh * 0.55));
      play(i, Math.round(p * 1000) / 1000);
    });
    show(lead);
  });
}

/* ---------- The end: the logo ----------
   The page ends on the logo. When it arrives it draws itself in like the logo animation: the track draws, the thumb
   drops in, the letters rise through their line. Then the thumb follows the pointer up and down its track and the
   letters lift as the pointer passes over them. Left alone, the thumb scrolls down its track and back. */

function footerLogo() {
  const wrap = $(".footer-logo");
  if (!wrap) return;
  const svg = $("svg", wrap);
  const thumb = $(".fl-thumb-wrap", wrap);
  const letters = $$(".fl-letter", wrap);
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return;
    wrap.classList.add("is-drawn");
    io.disconnect();
  }, { threshold: 0.3 }).observe(wrap);
  if (calm) return;

  // Each letter's centre, as a share of the logo's width (the SVG's viewBox starts at x 120 and is 4662 wide).
  // Measured on first use, so the page load doesn't pay for it.
  let centres = null;
  const measureLetters = () =>
    letters.map((l) => {
      const b = l.getBBox();
      return (b.x + b.width / 2 + 66.88 - 120) / 4662;
    });
  const lifts = letters.map(() => 0);
  let px = null, py = 0, ty = 0, raf = 0, shown = false;
  const start = performance.now();

  function tick() {
    raf = 0;
    centres ??= measureLetters();
    const r = svg.getBoundingClientRect();
    const near = px !== null && py > r.top - 140 && py < r.bottom + 60;
    const t = (performance.now() - start) / 1000;
    const cycle = t % 5;
    const idle = 22 * (ease(clamp((cycle - 1.2) / 0.8)) - ease(clamp((cycle - 2) / 0.8)));
    const target = near ? clamp((py - r.top) / (r.height * 0.85)) * 22 : idle;
    ty += (target - ty) * 0.12;
    thumb.style.transform = `translateY(${ty.toFixed(2)}px)`;
    letters.forEach((l, i) => {
      let lift = 0;
      if (near) {
        const d = Math.abs(px - (r.left + centres[i] * r.width)) / (r.width * 0.1);
        lift = d < 1 ? (1 - d) * (1 - d) * (1 + 2 * d) : 0;
      }
      lifts[i] += (lift - lifts[i]) * 0.14;
      l.style.transform = `translateY(${(-lifts[i] * 120).toFixed(1)}px)`;
    });
    if (shown) raf = requestAnimationFrame(tick);
  }

  new IntersectionObserver(([e]) => {
    shown = e.isIntersecting;
    if (shown && !raf) raf = requestAnimationFrame(tick);
  }).observe(wrap);
  const point = (x, y) => {
    px = x;
    py = y;
  };
  addEventListener("pointermove", (e) => point(e.clientX, e.clientY), { passive: true });
  addEventListener("touchmove", (e) => point(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  addEventListener("touchend", () => (px = null), { passive: true });
  document.documentElement.addEventListener("pointerleave", () => (px = null));
}

/* ---------- Light and pull ----------
   With a mouse, cards catch the light: an Ember glint follows the pointer across a card's edge and surface. Buttons
   lean toward the pointer and their labels lean a little further, then settle back when it leaves. */

function pointerCraft() {
  if (!finePointer || calm) return;
  addEventListener("pointermove", (e) => {
    const card = e.target.closest?.(".card, .brief");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
    card.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
  }, { passive: true });

  for (const btn of $$(".btn:not(.plan-cta)")) {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--pull-x", `${(((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(1)}px`);
      btn.style.setProperty("--pull-y", `${(((e.clientY - r.top) / r.height - 0.5) * 10).toFixed(1)}px`);
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.removeProperty("--pull-x");
      btn.style.removeProperty("--pull-y");
    });
  }
}

/* ---------- 03 Agency: the Paper page rises as a sheet, growing to full width as it arrives ---------- */

function sheet() {
  const el = $(".agency");
  if (!el || calm) return;
  let last = -1;
  whileVisible(el, (vh) => {
    // Scaled from its top edge, so its top (and every measurement taken from it) never moves.
    const p = clamp((vh - el.getBoundingClientRect().top) / (vh * 0.7));
    const s = Math.round((0.94 + 0.06 * ease(p)) * 1000) / 1000;
    if (s === last) return;
    last = s;
    el.style.scale = s === 1 ? "" : String(s);
  });
}

/* ---------- Small things: the tab and the console ---------- */

function signature() {
  const title = document.title;
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "Keep scrolling ↓ · Scroldev" : title;
  });
  const email = $("#brief")?.dataset.email;
  console.log(
    `%cScroldev%c\nWebsites you’d scroll for eternity. Designed and built by hand, no templates.${email ? `\nLike what you see under the hood? ${email}` : ""}`,
    "font: 500 22px/1.6 Geist, system-ui, sans-serif; color: #ff4f1a",
    "font: 12px/1.7 'Geist Mono', ui-monospace, monospace; color: #b8b0a6",
  );
}

/* ---------- 06 Contact: the brief opens as an email ---------- */

function brief() {
  const form = $("#brief");
  if (!form) return;
  const status = $(".brief-status", form);
  const to = form.dataset.email;

  for (const link of $$("[data-package]")) {
    link.addEventListener("click", () => {
      const radio = $(`input[name="package"][value="${link.dataset.package}"]`, form);
      if (radio) radio.checked = true;
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const d = new FormData(form);
    const get = (k) => String(d.get(k) ?? "").trim();
    const subject = `New project: ${get("company") || get("name")} (${get("package")})`;
    const body = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      `Company or site: ${get("company") || "-"}`,
      `Package: ${get("package")}`,
      `Launch: ${get("when")}`,
      "",
      get("message"),
    ].join("\n");
    location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "";
    status.append(
      "Your email app should open with the brief ready to send. Nothing opened? Email ",
      Object.assign(document.createElement("a"), { href: `mailto:${to}`, textContent: to }),
      ".",
    );
  });

  for (const btn of $$("[data-copy]")) {
    const label = $(".copy-label", btn);
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        label.textContent = "Copied";
      } catch {
        label.textContent = "Select it";
      }
      setTimeout(() => (label.textContent = "Copy"), 2000);
    });
  }
}

/* ---------- Start ---------- */

services();
measure();
chrome();
menu();
reveals();
heroStage($(".hero-stage"));
pillField($(".pills"));
manifesto();
pillars();
flow();
sheet();
pointerCraft();
footerLogo();
brief();
signature();
schedule();
