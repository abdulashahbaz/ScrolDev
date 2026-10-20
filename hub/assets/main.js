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

/* ---------- Intro (first visit per session) ---------- */

function intro() {
  const el = $(".intro");
  if (!el || !root.classList.contains("has-intro")) {
    el?.remove();
    return;
  }
  root.classList.add("is-locked");
  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    el.remove();
    root.classList.remove("is-locked");
    try {
      sessionStorage.setItem("sd-intro", "1");
    } catch {}
    measure();
  };
  const skip = () => {
    root.style.setProperty("--intro-delay", "0s");
    el.classList.add("is-skipped");
  };
  el.addEventListener("animationend", (e) => e.target === el && done());
  el.addEventListener("pointerdown", skip);
  addEventListener("keydown", skip, { once: true });
  setTimeout(done, 3200);
}

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
    header.dataset.on = surfaceAt(y + 36);

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
    // The counter rests once the contact section arrives; the footer carries its own count.
    hud.classList.toggle("is-on", y > vh * 0.55 && y + vh - 44 < layout.contactTop);
    hud.dataset.on = surfaceAt(y + vh - 44);
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

/* ---------- Hero: the thumb scrolls down its track, the content dissolves downward ---------- */

function heroScroll(hero) {
  if (!hero || calm) return;
  whileVisible(hero, () => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--p", clamp(-r.top / r.height).toFixed(4));
  });
}

/* ---------- Hero: the pill grid ----------
   The brand's base texture, drawn live. Near the cursor the pills turn to circle it, so the pointer leaves
   an echo of arches in the grid. The pills never brighten; only their angle changes. */

function pillGrid(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const GAP = 15, LEN = 5, WIDTH = 2, RADIUS = 190;
  let w = 0, h = 0, dpr = 1, n = 0;
  let xs, ys, as, ss;
  let px = -1e5, py = -1e5, cx = -1e5, cy = -1e5;
  let running = 0, inView = false;
  const interactive = finePointer && !calm;

  function build() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    if (!w || !h) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const cols = Math.ceil(w / GAP) + 1, rows = Math.ceil(h / GAP) + 1;
    const ox = (w - (cols - 1) * GAP) / 2, oy = (h - (rows - 1) * GAP) / 2;
    n = cols * rows;
    xs = new Float32Array(n);
    ys = new Float32Array(n);
    as = new Float32Array(n);
    ss = new Float32Array(n).fill(1);
    for (let r = 0, i = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++, i++) {
        xs[i] = ox + c * GAP;
        ys[i] = oy + r * GAP;
      }
    }
    draw();
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = WIDTH;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#2E2A26";
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const half = (LEN / 2) * ss[i] - WIDTH / 2;
      const dx = Math.sin(as[i]) * half, dy = Math.cos(as[i]) * half;
      ctx.moveTo(xs[i] - dx, ys[i] - dy);
      ctx.lineTo(xs[i] + dx, ys[i] + dy);
    }
    ctx.stroke();
  }

  function step() {
    running = 0;
    const rect = canvas.getBoundingClientRect();
    cx = px - rect.left;
    cy = py - rect.top;
    let moving = false;
    const R2 = RADIUS * RADIUS;
    for (let i = 0; i < n; i++) {
      const dx = cx - xs[i], dy = cy - ys[i];
      const d2 = dx * dx + dy * dy;
      let target = 0, scale = 1;
      if (d2 < R2) {
        const f = 1 - Math.sqrt(d2) / RADIUS;
        const k = f * f * (3 - 2 * f);
        target = (Math.atan2(dx, dy) + Math.PI / 2) * k;
        scale = 1 + k * 0.9;
      }
      // Pills are symmetric, so turn the short way round (angles repeat every half turn).
      let diff = (target - as[i]) % Math.PI;
      if (diff > Math.PI / 2) diff -= Math.PI;
      else if (diff < -Math.PI / 2) diff += Math.PI;
      const ds = scale - ss[i];
      if (Math.abs(diff) > 0.002 || Math.abs(ds) > 0.002) moving = true;
      as[i] += diff * 0.14;
      ss[i] += ds * 0.14;
    }
    draw();
    if (moving && inView) running = requestAnimationFrame(step);
  }

  const kick = () => {
    if (!running && inView && interactive) running = requestAnimationFrame(step);
  };

  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView) kick();
  }).observe(canvas);
  new ResizeObserver(build).observe(canvas);

  if (interactive) {
    addEventListener("pointermove", (e) => {
      px = e.clientX;
      py = e.clientY;
      kick();
    }, { passive: true });
    document.addEventListener("pointerleave", () => {
      px = py = -1e5;
      kick();
    });
    addEventListener("scroll", kick, { passive: true });
  }
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

/* ---------- The Endless Thumb: track, then thumb, then fade ---------- */

function markStory() {
  const section = $(".mark-story");
  if (!section) return;
  const track = $(".story-track", section);
  const guide = $(".story-guide", section);
  const thumb = $(".story-thumb", section);
  const stop = $(".story-stop", section);
  const steps = $$(".mark-steps li", section);
  const count = $("[data-story-count]", section);

  if (calm) {
    stop.setAttribute("offset", "0.42");
    steps.forEach((s) => s.classList.add("is-active"));
    count.textContent = "100";
    return;
  }

  let active = 0;
  whileVisible(section, (vh) => {
    const r = section.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh));

    // 1 · Track: the page draws itself, rounded top first.
    const draw = ease(clamp(p / 0.3));
    track.style.strokeDashoffset = (1 - draw).toFixed(4);
    guide.style.opacity = (1 - draw).toFixed(3);

    // 2 · Thumb: arrives, then scrolls down its track and back, like the loader.
    const arrive = ease(clamp((p - 0.34) / 0.1));
    const t = clamp((p - 0.44) / 0.22);
    const travel = t < 0.5 ? ease(t * 2) : ease((1 - t) * 2);
    thumb.style.opacity = arrive.toFixed(3);
    thumb.style.transform = `translateY(${(-8 * (1 - arrive) + 18 * travel).toFixed(3)}px)`;

    // 3 · Fade: the bottom of the track dissolves, so you never see where it ends.
    stop.setAttribute("offset", (1 - 0.58 * ease(clamp((p - 0.7) / 0.22))).toFixed(4));

    const next = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
    if (next !== active) {
      steps[active].classList.remove("is-active");
      steps[next].classList.add("is-active");
      active = next;
    }
    count.textContent = String(Math.round(p * 100));
  });
}

/* ---------- 02 Work: screenshots drift inside their frames ---------- */

function work() {
  if (calm) return;
  for (const img of $$(".frame img")) {
    const frameEl = img.parentElement;
    whileVisible(frameEl, (vh) => {
      const r = frameEl.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh + r.height));
      img.style.setProperty("--py", `${(p * -0.09 * r.height).toFixed(1)}px`);
    });
  }
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
  const copy = hero.cloneNode(true);
  copy.removeAttribute("id");
  copy.removeAttribute("data-hero");
  for (const el of $$("[id]", copy)) el.removeAttribute("id");
  const title = $("h1", copy);
  const div = document.createElement("div");
  div.className = title.className;
  div.innerHTML = title.innerHTML;
  title.replaceWith(div);
  wrap.append(copy);
  footer.after(wrap);
  root.classList.add("has-loop");

  pillGrid($("canvas", copy));
  heroScroll(copy);

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

intro();
loop();
measure();
chrome();
menu();
reveals();
heroScroll($("[data-hero]"));
pillGrid($(".hero-grid"));
manifesto();
markStory();
work();
pillars();
processTrack();
footerMark();
brief();
schedule();
