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

const layout = { surfaces: [], heroEnd: 0, pageEnd: 1, loopTop: 0, targets: [] };
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
  const loop = $(".loop");
  layout.loopTop = loop ? top(loop) : 0;
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
  const lapEl = $(".hud-lap");
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
    header.dataset.on = heroState.ember ? "ember" : surfaceAt(y + 36);

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

    // Top progress: the thumb travels the track; the loop's copy of the hero doesn't count.
    const end = layout.pageEnd;
    const p = clamp(y / end);
    thumb.style.setProperty("--x", `${(p * (innerWidth - 96)).toFixed(1)}px`);

    // The live pixel count: every pixel scrolled this visit, laps included.
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
    hud.dataset.on = heroState.ember ? "ember" : surfaceAt(y + vh - 44);
    lapEl.textContent = laps > 1 ? `Lap ${String(laps).padStart(2, "0")} ·` : "";
  });
}

/* ---------- Mobile menu ---------- */

function menu() {
  const button = $(".menu-button");
  const panel = $("#menu");
  if (!button || !panel) return;
  let closeTimer = 0;

  const open = () => {
    clearTimeout(closeTimer);
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("is-open"));
    root.classList.add("menu-open", "is-locked");
    button.setAttribute("aria-expanded", "true");
    $("a", panel)?.focus({ preventScroll: true });
  };
  const close = (refocus) => {
    panel.classList.remove("is-open");
    root.classList.remove("menu-open", "is-locked");
    button.setAttribute("aria-expanded", "false");
    closeTimer = setTimeout(() => (panel.hidden = true), 450);
    if (refocus) button.focus();
  };

  button.addEventListener("click", () => (panel.hidden ? open() : close()));
  panel.addEventListener("click", (e) => e.target.closest("a") && close());
  addEventListener("keydown", (e) => e.key === "Escape" && !panel.hidden && close(true));
  wide.addEventListener("change", (e) => e.matches && !panel.hidden && close());
}

/* ---------- Reveals ---------- */

function reveals() {
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

// The thumb at time t (seconds since load). The hero and its copy after the footer share it, so the loop is seamless.
function thumbAt(t) {
  if (calm) return { arrive: 1, y: 12 };
  const arrive = ease(clamp((t - 0.8) / 0.45));
  const cycle = t < 2.6 ? -1 : (t - 2.6) % 5;
  const travel = cycle < 0 ? 0 : ease(clamp(cycle / 0.8)) - ease(clamp((cycle - 0.8) / 0.8));
  return { arrive, y: 4 + 8 * arrive + 22 * travel };
}

function heroStage(stage, frozen = false) {
  const canvas = $(".hero-mark", stage);
  if (!canvas) return;
  const section = frozen ? null : stage.parentElement;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1, raf = 0, shown = false, last = "";
  let mx = 0, my = 0, px = 0, py = 0;

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
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

  function tick() {
    raf = 0;
    if (shown && !calm) raf = requestAnimationFrame(tick);
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
    const thumbY = 12 + (thumb.y - 12) * rest;
    const draw = calm ? 1 : ease(clamp((t - 0.1) / 0.8));

    const key = [p, thumbY, thumb.arrive, draw, px, py, w, h].map((v) => v.toFixed(3)).join();
    if (key === last) return;
    last = key;

    stage.style.setProperty("--out", out.toFixed(3));
    stage.style.setProperty("--say", say.toFixed(3));
    stage.classList.toggle("is-out", out > 0.6);

    // Where the mark sits: right of the headline on wide screens, top right on phones.
    const wide = w >= 900;
    const k0 = (wide ? Math.min(h * 0.58, 600) : Math.min(h * 0.16, 150)) / 64;
    const x0 = wide ? w * 0.8 : w * 0.8;
    const y0 = wide ? h * 0.53 : h * 0.18;
    const k1 = (h * 0.74) / 64;
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

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Once the thumb covers the screen it is the screen: an Ember field, lit from the centre.
    const [left, top] = at(16.25, thumbY + 3.75);
    const [right, bottom] = at(23.75, thumbY + 15.25);
    const ember = left <= 0 && right >= w && top <= 0 && bottom >= h;
    if (!frozen) heroState.ember = ember;
    if (ember) {
      const g = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.max(w, h) * 0.75);
      g.addColorStop(0, "#FF5A26");
      g.addColorStop(1, "#E8400C");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      return;
    }

    // A warm glow behind the mark.
    const [gx, gy] = at(20, thumbY + 9.5);
    const radius = Math.min(k * 34, Math.max(w, h));
    const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius);
    glow.addColorStop(0, `rgba(255, 79, 26, ${0.2 * thumb.arrive})`);
    glow.addColorStop(1, "rgba(255, 79, 26, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // The mark, in its own 40 × 64 units.
    ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * (sx - 20 * k), dpr * (sy - ay * k));
    const fade = ctx.createLinearGradient(0, 0, 0, 64);
    fade.addColorStop(0.42, "rgba(243, 238, 230, 1)");
    fade.addColorStop(1, "rgba(243, 238, 230, 0)");
    ctx.strokeStyle = fade;
    ctx.lineWidth = 5.2;
    ctx.setLineDash([TRACK_LEN * draw, TRACK_LEN]);
    ctx.beginPath();
    ctx.moveTo(6, 64);
    ctx.lineTo(6, 17);
    ctx.arc(20, 17, 14, Math.PI, 0);
    ctx.lineTo(34, 64);
    ctx.stroke();
    ctx.setLineDash([]);

    if (thumb.arrive > 0) {
      const fill = ctx.createLinearGradient(0, thumbY, 0, thumbY + 19);
      fill.addColorStop(0, "#FF6533");
      fill.addColorStop(1, "#E8400C");
      ctx.globalAlpha = thumb.arrive;
      ctx.shadowColor = "rgba(255, 79, 26, 0.55)";
      ctx.shadowBlur = k < k1 * 2 ? 28 * dpr : 0;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(16.25, thumbY, 7.5, 19, 3.75);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => {
    shown = e.isIntersecting;
    if (shown && !raf) tick();
  }).observe(stage);
  if (finePointer && !calm) {
    addEventListener("pointermove", (e) => {
      mx = (e.clientX / innerWidth - 0.5) * 2;
      my = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
  }
}

/* ---------- The pill grid ----------
   The brand's pill-grid tile (2 × 5px pills every 15px), drawn live in one fixed layer behind every dark section.
   Ember is kept for the pointer: pills near it warm to Ember and turn to circle it, then cool slowly once it moves
   on, so it leaves a fading orange trail. On touch screens the trail follows the finger. */

function pillField(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const GAP = 15, LEN = 5, WIDTH = 2, RADIUS = 120, SHADES = 16, PEAK = 0.62;
  const cool = [46, 42, 38], ember = [255, 79, 26];
  const shade = Array.from({ length: SHADES + 1 }, (_, i) =>
    `rgb(${cool.map((c, j) => Math.round(c + (ember[j] - c) * (i / SHADES) * PEAK)).join(",")})`,
  );
  let w = 0, h = 0, dpr = 1, n = 0;
  let xs, ys, as, heat;
  let px = -1e5, py = -1e5;
  let running = 0;

  function build() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const cols = Math.ceil(w / GAP), rows = Math.ceil(h / GAP);
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
    draw();
  }

  function pill(i) {
    const half = (LEN / 2) * (1 + heat[i] * 0.5) - WIDTH / 2;
    const dx = Math.sin(as[i]) * half, dy = Math.cos(as[i]) * half;
    ctx.moveTo(xs[i] - dx, ys[i] - dy);
    ctx.lineTo(xs[i] + dx, ys[i] + dy);
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
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
    let busy = false;
    const R2 = RADIUS * RADIUS;
    for (let i = 0; i < n; i++) {
      const dx = px - xs[i], dy = py - ys[i];
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

/* ---------- 04 Process: the thumb travels the track, each step lights as it passes ---------- */

function processTrack() {
  const wrap = $(".steps-wrap");
  if (!wrap || calm) return;
  const track = $(".steps-track", wrap);
  const thumb = $(".steps-thumb", wrap);
  const steps = $$(".step", wrap);
  whileVisible(wrap, (vh) => {
    const r = wrap.getBoundingClientRect();
    const p = ease(clamp((vh * 0.78 - r.top) / (r.height + vh * 0.3)));
    if (wide.matches) {
      const max = track.offsetWidth - thumb.offsetWidth;
      thumb.style.setProperty("--tx", `${(p * max).toFixed(1)}px`);
      steps.forEach((s, i) => s.classList.toggle("is-on", p * steps.length > i + 0.02 || p > 0.98));
    } else {
      const max = track.offsetHeight - thumb.offsetHeight;
      const at = p * max;
      thumb.style.setProperty("--ty", `${at.toFixed(1)}px`);
      steps.forEach((s) => s.classList.toggle("is-on", s.offsetTop <= at + thumb.offsetHeight));
    }
  });
}

/* ---------- Footer: the thumb settles as the page runs out ---------- */

function footerMark() {
  if (calm) return;
  whileVisible(footer, (vh) => {
    const r = footer.getBoundingClientRect();
    footer.style.setProperty("--ft", `${(clamp((vh - r.top) / r.height) * 18).toFixed(2)}px`);
  });
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

/* ---------- The loop ----------
   Websites you'd scroll for eternity, taken literally: a frozen copy of the hero sits after the footer.
   When it reaches the top of the screen the page jumps back to the real hero, which looks identical, so the
   scroll carries on without a seam. Desktop pointers only; with reduced motion the page simply ends. */

let laps = 1;

function loop() {
  const hero = $("[data-hero]");
  if (!hero || calm || !finePointer) return;

  const wrap = document.createElement("div");
  wrap.className = "loop";
  wrap.setAttribute("aria-hidden", "true");
  wrap.inert = true;
  const copy = $(".hero-stage", hero).cloneNode(true);
  for (const el of $$("[id]", copy)) el.removeAttribute("id");
  const title = $("h1", copy);
  const div = document.createElement("div");
  div.className = title.className;
  div.innerHTML = title.innerHTML;
  title.replaceWith(div);
  wrap.append(copy);
  footer.after(wrap);
  root.classList.add("has-loop");

  heroStage(copy, true);

  always.add(() => {
    if (!layout.loopTop || state.y < layout.loopTop - 0.5) return;
    const to = Math.max(0, state.y - layout.loopTop);
    laps += 1;
    state.jumped = true;
    state.y = to;
    scrollTo({ top: to, behavior: "instant" });
  });
}

/* ---------- Start ---------- */

loop();
services();
measure();
chrome();
menu();
reveals();
heroStage($(".hero-stage"));
pillField($(".pills"));
manifesto();
pillars();
processTrack();
footerMark();
brief();
schedule();
