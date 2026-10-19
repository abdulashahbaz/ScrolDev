// Shared behaviour for every page: smooth scroll, header, cursor, menu,
// page transitions and the scroll-driven reveal vocabulary.
(() => {

const { residences } = window.Oriel;
const { gsap, ScrollTrigger, SplitText, Flip, CustomEase } = window;
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase);
CustomEase.create("oriel", "0.16, 1, 0.3, 1");
CustomEase.create("oriel-io", "0.76, 0, 0.24, 1");
gsap.defaults({ ease: "oriel", duration: 1.1 });

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

let lenis = null;

// ---------------------------------------------------------------- scroll

function initScroll() {
  if (reduced || !window.Lenis) return;
  lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
  lenis.on("scroll", ScrollTrigger.update);
  window.__lenis = lenis;
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollTo(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6, offset: 0, ...opts });
  else {
    const el = typeof target === "string" ? $(target) : target;
    if (typeof target === "number") window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
    else el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
}

function lockScroll(lock) {
  document.body.classList.toggle("is-locked", lock);
  if (lenis) lock ? lenis.stop() : lenis.start();
}

// ---------------------------------------------------------------- header

function initHeader() {
  const header = $(".header");
  if (!header) return;
  const sections = $$("[data-header]");
  sections.forEach((s) => {
    ScrollTrigger.create({
      trigger: s,
      start: "top top+=42",
      end: "bottom top+=42",
      onToggle: (self) => self.isActive && (header.dataset.theme = s.dataset.header),
    });
  });
  let last = 0;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      const down = y > last && y > window.innerHeight * 0.6;
      header.classList.toggle("is-hidden", down && !document.documentElement.classList.contains("menu-open"));
      last = y;
    },
  });
  const bar = $(".progress span");
  if (bar) {
    gsap.to(bar, { scaleY: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  }
}

// ---------------------------------------------------------------- cursor

function initCursor() {
  if (!fine || reduced) return;
  const c = $(".cursor");
  if (!c) return;
  document.documentElement.classList.add("has-cursor");
  const dot = $(".cursor__dot", c);
  const ring = $(".cursor__ring", c);
  const label = $(".cursor__label", c);
  const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
  const rx = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });
  window.addEventListener("pointermove", (e) => {
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    c.classList.add("is-on");
  }, { passive: true });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("[data-cursor], a, button, label, select, input, textarea");
    c.classList.remove("is-hover", "is-label", "is-hidden");
    if (!t) return;
    if (t.matches("input:not([type=range]):not([type=checkbox]):not([type=radio]), textarea")) return c.classList.add("is-hidden");
    if (t.dataset.cursor) {
      label.textContent = t.dataset.cursor;
      c.classList.add("is-label");
    } else c.classList.add("is-hover");
  });
  document.addEventListener("pointerleave", () => c.classList.add("is-hidden"));
  document.addEventListener("pointerenter", () => c.classList.remove("is-hidden"));
}

function initMagnetic() {
  if (!fine || reduced) return;
  $$("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic) || 0.3;
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
  });
}

// ---------------------------------------------------------------- menu

function initMenu() {
  const menu = $("#menu");
  const burger = $(".burger");
  if (!menu || !burger) return;
  const bg = $(".menu__bg", menu);
  const labels = $$(".menu__label, .menu__no", menu);
  const fades = $$(".menu__fade", menu);
  const previews = $$(".menu__preview img", menu);
  let open = false;

  const tl = gsap.timeline({ paused: true, defaults: { ease: "oriel-io" } })
    .set(menu, { visibility: "visible" })
    .fromTo(bg, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9 })
    .fromTo(labels, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.04, ease: "oriel" }, 0.35)
    .fromTo(fades, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "oriel" }, 0.55)
    .fromTo(".menu__preview", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.1 }, 0.4);

  const set = (v) => {
    open = v;
    document.documentElement.classList.toggle("menu-open", v);
    burger.setAttribute("aria-expanded", String(v));
    menu.setAttribute("aria-hidden", String(!v));
    menu.classList.toggle("is-open", v);
    lockScroll(v);
    if (v) {
      tl.timeScale(1).play();
      setTimeout(() => $(".menu__link", menu)?.focus({ preventScroll: true }), 400);
    } else {
      tl.timeScale(1.6).reverse();
      burger.focus({ preventScroll: true });
    }
  };
  burger.addEventListener("click", () => set(!open));
  document.addEventListener("keydown", (e) => e.key === "Escape" && open && set(false));
  $$(".menu__link", menu).forEach((a, i) => {
    a.addEventListener("pointerenter", () => previews.forEach((p, j) => p.classList.toggle("is-active", j === i)));
  });
  previews[0]?.classList.add("is-active");
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a[href*='#']");
    if (a && new URL(a.href).pathname === location.pathname) set(false);
  });
  window.__closeMenu = () => open && set(false);
}

// ---------------------------------------------------------------- shortlist

const SAVED_KEY = "oriel:shortlist";
let saved = [];
try {
  saved = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]").filter((id) => residences.some((r) => r.id === id));
} catch { /* storage blocked: the shortlist lives for this page only */ }

const plusIcon = `<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1v12M1 7h12" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`;
const isSaved = (id) => saved.includes(id);

function syncSaved() {
  $$("[data-saved-count]").forEach((el) => {
    el.textContent = saved.length;
    el.classList.toggle("has", saved.length > 0);
  });
  $$("[data-save]").forEach((b) => {
    const on = isSaved(b.dataset.save);
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", `${on ? "Remove" : "Save"} ${b.dataset.name} ${on ? "from" : "to"} shortlist`);
  });
  const panel = $("#saved");
  if (!panel) return;
  $("[data-saved-list]", panel).innerHTML = saved.map((id) => {
    const r = residences.find((x) => x.id === id);
    return `<li class="saved__item">
      <a href="residence.html?id=${r.id}" tabindex="-1" aria-hidden="true"><img src="assets/img/${r.cover}-800.webp" alt=""></a>
      <div><strong><a href="residence.html?id=${r.id}">${r.name}</a></strong><span>${r.city} · ${r.price}</span></div>
      <button type="button" data-unsave="${r.id}" aria-label="Remove ${r.name}">Remove</button>
    </li>`;
  }).join("");
  panel.classList.toggle("has-items", saved.length > 0);
  $("[data-saved-cta]", panel).href = "contact.html?about=" + saved.join(",");
}

function toggleSaved(id) {
  saved = isSaved(id) ? saved.filter((x) => x !== id) : [...saved, id];
  try { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); } catch { /* storage blocked */ }
  syncSaved();
}

function initSaved() {
  const panel = $("#saved");
  const openers = $$("[data-saved-open]");
  let open = false;
  const set = (v) => {
    open = v;
    panel.classList.toggle("is-open", v);
    panel.setAttribute("aria-hidden", String(!v));
    openers.forEach((b) => b.setAttribute("aria-expanded", String(v)));
    lockScroll(v);
    if (v) setTimeout(() => $(".saved__head .icon-btn", panel)?.focus(), 50);
    else openers[0]?.focus({ preventScroll: true });
  };
  if (panel) {
    openers.forEach((b) => b.addEventListener("click", () => set(!open)));
    $$("[data-saved-close]", panel).forEach((b) => b.addEventListener("click", () => set(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && open && set(false));
    panel.addEventListener("click", (e) => {
      const b = e.target.closest("[data-unsave]");
      if (b) toggleSaved(b.dataset.unsave);
    });
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-save]");
    if (!b) return;
    e.preventDefault();
    toggleSaved(b.dataset.save);
    if (!reduced) gsap.fromTo($$("[data-saved-count]"), { scale: 1.6 }, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  });
  syncSaved();
}

// ---------------------------------------------------------------- page transitions

function initTransitions() {
  const t = $(".transition");
  if (!t) return;
  const panel = $(".transition__panel", t);
  const mark = $$(".transition__mark span", t);

  const reveal = () => {
    t.classList.add("is-active");
    gsap.set(panel, { clipPath: "inset(0% 0 0% 0)" });
    document.documentElement.classList.remove("is-arriving");
    gsap.timeline({ onComplete: () => t.classList.remove("is-active") })
      .to(mark, { yPercent: -110, duration: 0.6, ease: "oriel-io" }, 0.05)
      .to(panel, { clipPath: "inset(0% 0 100% 0)", duration: 1.0, ease: "oriel-io" }, 0.2);
  };

  let arrived = false;
  try { arrived = sessionStorage.getItem("oriel:nav") === "1"; sessionStorage.removeItem("oriel:nav"); } catch { /* storage blocked */ }
  if (arrived && !reduced) reveal();
  else document.documentElement.classList.remove("is-arriving");

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented) return;
    if (a.target === "_blank" || a.hasAttribute("download") || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const href = a.getAttribute("href");
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) {
      if (url.hash) {
        e.preventDefault();
        window.__closeMenu?.();
        scrollTo(url.hash, { offset: -10 });
      }
      return;
    }
    e.preventDefault();
    if (reduced) return void (location.href = url.href);
    try { sessionStorage.setItem("oriel:nav", "1"); } catch { /* storage blocked */ }
    t.classList.add("is-active");
    gsap.timeline({ onComplete: () => (location.href = url.href) })
      .fromTo(panel, { clipPath: "inset(100% 0 0% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 0.85, ease: "oriel-io" })
      .fromTo(mark, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "oriel" }, 0.35);
  });

  // returning through the back/forward cache: drop the cover
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      gsap.set(panel, { clipPath: "inset(100% 0 0% 0)" });
      t.classList.remove("is-active");
    }
  });
}

// ---------------------------------------------------------------- reveal vocabulary

function splitLines(el, { delay = 0, stagger = 0.09, trigger = el, start = "top 88%", immediate = false } = {}) {
  el.classList.add("is-split");
  if (reduced) return null;
  let anim;
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "line",
    autoSplit: true,
    onSplit(self) {
      anim?.kill();
      anim = gsap.from(self.lines, {
        yPercent: 115,
        duration: 1.3,
        stagger,
        delay,
        paused: immediate === "paused",
        scrollTrigger: immediate ? undefined : { trigger, start, once: true },
      });
      return anim;
    },
  });
  return () => anim;
}

function initReveals() {
  $$("[data-split]").forEach((el) => {
    if (el.dataset.split === "manual") return;
    splitLines(el, { delay: parseFloat(el.dataset.delay) || 0 });
  });
  $$("[data-reveal]").forEach((el) => {
    if (reduced) return;
    gsap.to(el, { opacity: 1, y: 0, duration: 1.2, delay: parseFloat(el.dataset.delay) || 0, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  $$("[data-img-reveal]").forEach((el) => {
    if (reduced) return;
    const inner = el.querySelector("img");
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    tl.to(el, { clipPath: "inset(0% 0 0 0)", duration: 1.5, ease: "oriel-io" });
    if (inner) tl.from(inner, { scale: 1.3, duration: 1.8, ease: "oriel" }, 0);
  });
  $$("[data-parallax]").forEach((el) => {
    if (reduced) return;
    const amt = parseFloat(el.dataset.parallax) || 0.15;
    gsap.fromTo(el, { yPercent: -amt * 50 }, {
      yPercent: amt * 50, ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
  $$("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split(".")[1] || "").length;
    const pre = el.dataset.prefix || "";
    const suf = el.dataset.suffix || "";
    const fmt = (v) => pre + v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (reduced) return void (el.textContent = fmt(end));
    const o = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(o, { v: end, duration: 2.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true }, onUpdate: () => (el.textContent = fmt(o.v)) });
  });
}

// images lean into fast scrolling, then settle
function initSkew() {
  if (reduced || !fine) return;
  const els = $$(".card__img, .post__img, .gallery__item");
  if (!els.length) return;
  const proxy = { skew: 0 };
  const set = gsap.quickSetter(els, "skewY", "deg");
  const clamp = gsap.utils.clamp(-4, 4);
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = clamp(self.getVelocity() / -400);
      if (Math.abs(v) > Math.abs(proxy.skew)) {
        proxy.skew = v;
        gsap.to(proxy, { skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => set(proxy.skew) });
      }
    },
  });
}

function initWords() {
  $$("[data-words]").forEach((el) => {
    if (reduced) return;
    const split = SplitText.create(el, { type: "words", wordsClass: "w" });
    gsap.to(split.words, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: true },
    });
  });
}

function initForms() {
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  $$("[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let first = null;
      $$("[required]", form).forEach((inp) => {
        let valid = inp.type === "checkbox" ? inp.checked : inp.value.trim() !== "";
        if (valid && inp.type === "email") valid = email.test(inp.value.trim());
        (inp.closest(".field") || inp.closest(".consent"))?.classList.toggle("is-invalid", !valid);
        inp.setAttribute("aria-invalid", String(!valid));
        if (!valid && !first) first = inp;
      });
      if (first) return first.focus();
      const success = form.parentElement.querySelector(".form-success");
      gsap.to(form, {
        opacity: 0, y: -20, duration: reduced ? 0 : 0.5,
        onComplete: () => {
          form.hidden = true;
          success.classList.add("is-shown");
          if (!reduced) gsap.from(success.children, { opacity: 0, y: 30, stagger: 0.08, duration: 1 });
          success.setAttribute("tabindex", "-1");
          success.focus({ preventScroll: true });
          ScrollTrigger.refresh();
        },
      });
    });
    form.addEventListener("input", (e) => {
      (e.target.closest(".field") || e.target.closest(".consent"))?.classList.remove("is-invalid");
      e.target.removeAttribute("aria-invalid");
    });
  });
}

function initMarquees() {
  $$("[data-marquee]").forEach((m) => {
    const track = $(".marquee__track", m);
    if (!track) return;
    track.innerHTML += track.innerHTML;
    if (reduced) return;
    const dir = m.dataset.marquee === "right" ? 1 : -1;
    const tween = gsap.fromTo(track, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: parseFloat(m.dataset.speed) || 30, ease: "none", repeat: -1 });
    ScrollTrigger.create({
      trigger: m,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = Math.min(Math.abs(self.getVelocity()) / 400, 4);
        gsap.to(tween, { timeScale: 1 + v, duration: 0.3, overwrite: true });
        gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.3 });
      },
    });
  });
}

// ---------------------------------------------------------------- small utilities

function initClocks() {
  const els = $$("[data-clock]");
  if (!els.length) return;
  const fmts = new Map();
  const tick = () => {
    const now = new Date();
    els.forEach((el) => {
      const tz = el.dataset.clock;
      if (!fmts.has(tz)) fmts.set(tz, new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }));
      const target = el.querySelector("time") || el;
      target.textContent = fmts.get(tz).format(now);
    });
  };
  tick();
  setInterval(tick, 15000);
}

// scale a single line of display type to exactly fill its container
function fitText(el) {
  if (!el) return;
  const fit = () => {
    el.style.fontSize = "100px";
    el.style.display = "inline-block";
    const w = el.getBoundingClientRect().width;
    el.style.display = "";
    const cs = getComputedStyle(el);
    const avail = el.parentElement.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    el.style.fontSize = (100 * avail) / (w - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) + "px";
  };
  fit();
  let raf;
  window.addEventListener("resize", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });
}

function initFooter() {
  const mark = $(".footer__mark");
  fitText(mark);
  if (mark && !reduced) {
    const split = SplitText.create(mark, { type: "chars", charsClass: "ch" });
    gsap.from(split.chars, {
      yPercent: 100, duration: 1.4, stagger: 0.05, ease: "oriel",
      scrollTrigger: { trigger: mark, start: "top 98%", once: true },
    });
  }
  $$(".js-news").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      const msg = form.parentElement.querySelector(".news-msg");
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      msg.textContent = ok ? "Thank you. Concept site: nothing was sent." : "Please enter a valid email address.";
      if (ok) input.value = "";
    });
  });
  $$("[data-top]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); scrollTo(0, { duration: 2 }); }));
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

function markNav() {
  const page = document.body.dataset.page;
  const key = page === "residence" ? "residences" : page;
  $$(`.nav [data-nav="${key}"]`).forEach((a) => a.setAttribute("aria-current", "page"));
}

function dragScroll(el) {
  if (!el) return;
  let down = false, startX = 0, startLeft = 0, moved = false;
  el.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
    el.classList.add("is-dragging");
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    el.scrollLeft = startLeft - dx;
  });
  window.addEventListener("pointerup", () => { down = false; el.classList.remove("is-dragging"); });
  el.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  el.addEventListener("wheel", (e) => {
    // let a vertical wheel keep scrolling the page; only horizontal intent moves the track
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation();
  }, { passive: true });
}

function onHashArrival() {
  if (!location.hash) return;
  const el = document.getElementById(location.hash.slice(1));
  if (!el) return;
  ScrollTrigger.refresh();
  if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
  else el.scrollIntoView();
}

// prepare(): synchronous render of data-driven markup, before reveals bind
async function boot(pageInit, prepare) {
  window.__oriel = true;
  prepare?.();
  markNav();
  initSaved();
  initScroll();
  initTransitions();
  initMenu();
  initCursor();
  try { await document.fonts.ready; } catch { /* fonts API unavailable */ }
  initHeader();
  initReveals();
  initWords();
  initForms();
  initMarquees();
  initMagnetic();
  initClocks();
  initFooter();
  if (pageInit) await pageInit();
  initSkew();
  ScrollTrigger.refresh();
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

Object.assign(window.Oriel, {
  gsap, ScrollTrigger, SplitText, Flip, reduced, fine, $, $$, scrollTo, lockScroll, plusIcon, isSaved,
  splitLines, initMarquees, initClocks, fitText, dragScroll, onHashArrival, boot,
});
})();
