import { boot, gsap, ScrollTrigger, SplitText, reduced, fine, $, $$, lockScroll, onHashArrival } from "./core.js";
import { livingSky } from "./gl.js";

const pad = (n) => String(n).padStart(2, "0");

// ---------------------------------------------------------------- loader

async function runLoader() {
  const loader = $(".loader");
  if (!loader || getComputedStyle(loader).display === "none") return false;
  lockScroll(true);
  window.scrollTo(0, 0);
  const stage = $(".loader__stage", loader);
  const imgs = $$("img", stage);
  const count = $(".loader__count", loader);

  // give the frames a moment to decode, but never hold the page hostage
  await Promise.race([
    Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()))),
    new Promise((r) => setTimeout(r, 2500)),
  ]);

  const o = { v: 0 };
  const tl = gsap.timeline();
  tl.fromTo(stage, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "oriel-io" }, 0)
    .to(o, { v: 100, duration: 2.8, ease: "power2.inOut", onUpdate: () => (count.textContent = String(Math.round(o.v)).padStart(3, "0")) }, 0);
  imgs.forEach((im, i) => tl.set(im, { opacity: 1, zIndex: i + 1 }, 0.1 + i * 0.36));
  tl.to([".loader__note", ".loader__brand", count], { opacity: 0, duration: 0.5, ease: "power2.out" }, "+=0.15")
    .add(() => gsap.set(stage, { height: stage.offsetHeight, aspectRatio: "auto" }))
    .to(stage, { width: () => window.innerWidth, height: () => window.innerHeight, borderRadius: 0, duration: 1.25, ease: "oriel-io" }, "<");
  await tl;
  try { sessionStorage.setItem("oriel:loaded", "1"); } catch { /* storage blocked */ }
  gsap.to(loader, { autoAlpha: 0, duration: 0.5, delay: 0.05, onComplete: () => loader.remove() });
  lockScroll(false);
  return true;
}

// ---------------------------------------------------------------- hero

// size the big word so it spans the full measure exactly
function fitTitle() {
  const big = $(".hero__title .t-big");
  if (!big) return;
  const fit = () => {
    big.style.display = "inline-block";
    big.style.fontSize = "100px";
    const w = big.getBoundingClientRect().width;
    big.style.display = "";
    big.style.fontSize = (100 * big.parentElement.clientWidth) / w + "px";
  };
  fit();
  let raf;
  window.addEventListener("resize", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });
}

function heroIntro(fromLoader) {
  const title = $(".hero__title");
  fitTitle();
  title.classList.add("is-split");
  if (reduced) return gsap.timeline();
  const small = SplitText.create(".hero__title .t-small", { type: "lines, words, chars", mask: "lines" });
  const big = SplitText.create(".hero__title .t-big", { type: "lines, chars", mask: "lines" });
  const tl = gsap.timeline({ paused: true });
  tl.from(small.chars, { yPercent: 115, duration: 1.2, stagger: 0.035 }, 0)
    .from(big.chars, { yPercent: 115, duration: 1.5, stagger: 0.04 }, 0.12)
    .from("[data-hero-fade]", { opacity: 0, y: 24, duration: 1.2, stagger: 0.12 }, 0.7);
  if (!fromLoader) {
    tl.from(".hero__fg .hero__inner", { scale: 1.08, duration: 2.4, ease: "oriel" }, 0)
      .from(".hero__sky .hero__inner", { scale: 1.14, duration: 2.6, ease: "oriel" }, 0);
  }
  return tl;
}

function heroScroll() {
  if (reduced) return;
  gsap.timeline({
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true, pin: true, pinSpacing: false },
  })
    .to(".hero__title", { yPercent: -70, opacity: 0, ease: "none" }, 0)
    .to(".hero__fg", { scale: 1.16, ease: "none" }, 0)
    .to(".hero__sky", { yPercent: 10, scale: 1.04, ease: "none" }, 0)
    .to("[data-hero-fade]", { opacity: 0, ease: "none", duration: 0.25 }, 0);
}

function heroMouse() {
  if (!fine || reduced) return;
  const hero = $(".hero");
  const q = (sel, prop) => gsap.quickTo(sel, prop, { duration: 1.4, ease: "power3" });
  const fx = q(".hero__fg .hero__inner", "x"), fy = q(".hero__fg .hero__inner", "y");
  const sx = q(".hero__sky .hero__inner", "x"), sy = q(".hero__sky .hero__inner", "y");
  const tx = q(".hero__title", "x");
  hero.addEventListener("pointermove", (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    fx(nx * -26); fy(ny * -12);
    sx(nx * 12); sy(ny * 8);
    tx(nx * -6);
  });
}

// ---------------------------------------------------------------- collection strip

function strip() {
  const section = $(".strip");
  if (!section) return;
  const items = $$(".strip__item", section);
  const current = $(".strip__current", section);
  const bar = $(".strip__bar span", section);
  const list = $(".strip__list", section);
  const mm = gsap.matchMedia();

  mm.add("(min-width: 821px)", () => {
    let active = 0;
    let hovering = null;
    const setActive = (i) => {
      items.forEach((it, j) => {
        it.classList.toggle("is-active", j === i);
        gsap.to(it, { flexGrow: j === i ? 6 : 1, duration: reduced ? 0 : 1.2, ease: "oriel", overwrite: true });
      });
      current.textContent = pad(i + 1);
    };
    setActive(0);
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => "+=" + window.innerHeight * 2.4,
      pin: ".strip__pin",
      onUpdate(self) {
        const i = Math.min(items.length - 1, Math.floor(self.progress * items.length * 0.999));
        gsap.set(bar, { scaleX: self.progress });
        if (i !== active) {
          active = i;
          if (hovering === null) setActive(i);
        }
      },
    });
    const bg = gsap.fromTo(".strip__bg", { xPercent: 0 }, {
      xPercent: -45, ease: "none",
      scrollTrigger: { trigger: section, start: "top bottom", end: () => "+=" + window.innerHeight * 4.4, scrub: true },
    });
    const enter = (i) => { hovering = i; setActive(i); };
    const handlers = items.map((it, i) => {
      const h = () => enter(i);
      it.addEventListener("pointerenter", h);
      it.addEventListener("focusin", h);
      return h;
    });
    const leave = () => { hovering = null; setActive(active); };
    list.addEventListener("pointerleave", leave);
    return () => {
      st.kill(); bg.scrollTrigger?.kill(); bg.kill();
      items.forEach((it, i) => {
        it.removeEventListener("pointerenter", handlers[i]);
        it.removeEventListener("focusin", handlers[i]);
        gsap.set(it, { clearProps: "flexGrow" });
      });
      list.removeEventListener("pointerleave", leave);
    };
  });
}

// ---------------------------------------------------------------- spotlight

function spotlight() {
  const imgs = $$(".spot__media img");
  const chapters = $$(".chapter");
  const idx = $(".spot__idx");
  if (!imgs.length) return;
  const mm = gsap.matchMedia();
  mm.add("(min-width: 821px)", () => {
    chapters.forEach((ch, i) => {
      ScrollTrigger.create({ trigger: ch, start: "top center", end: "bottom center", onToggle: (s) => s.isActive && (idx.textContent = pad(i + 1)) });
      if (i === 0 || !imgs[i]) return;
      const st = { trigger: ch, start: "top bottom", end: "top 30%", scrub: true };
      gsap.fromTo(imgs[i], { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none", scrollTrigger: st });
      gsap.fromTo(imgs[i], { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { ...st } });
    });
  });
  mm.add("(max-width: 820px)", () => {
    // on phones the media is not sticky; cycle the three frames instead
    let i = 0;
    const id = setInterval(() => {
      const next = (i + 1) % imgs.length;
      if (next === 0) imgs.slice(1).forEach((im) => gsap.set(im, { clipPath: "inset(100% 0 0 0)" }));
      else gsap.fromTo(imgs[next], { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "oriel-io" });
      idx.textContent = pad(next + 1);
      i = next;
    }, 3200);
    return () => clearInterval(id);
  });
}

// ---------------------------------------------------------------- hover image lists

function floatImages() {
  if (!fine) return;
  $$("[data-float]").forEach((list) => {
    const box = document.createElement("div");
    box.className = "float-img";
    box.setAttribute("aria-hidden", "true");
    document.body.appendChild(box);
    const items = $$("[data-img]", list);
    items.forEach((it) => {
      const im = new Image();
      im.src = it.dataset.img;
      im.alt = "";
      im.decoding = "async";
      box.appendChild(im);
      it._img = im;
    });
    const xTo = gsap.quickTo(box, "x", { duration: 0.8, ease: "power3" });
    const yTo = gsap.quickTo(box, "y", { duration: 0.8, ease: "power3" });
    const rTo = gsap.quickTo(box, "rotation", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    list.addEventListener("pointermove", (e) => {
      xTo(e.clientX + 30);
      yTo(e.clientY - box.offsetHeight / 2);
      rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    });
    items.forEach((it) => it.addEventListener("pointerenter", () => {
      items.forEach((o) => o._img.classList.toggle("is-active", o === it));
      gsap.to(box, { opacity: 1, scale: 1, duration: 0.6, ease: "oriel", overwrite: "auto" });
    }));
    list.addEventListener("pointerleave", () => gsap.to(box, { opacity: 0, scale: 0.8, duration: 0.5, ease: "power3.out", overwrite: "auto" }));
  });
  $(".approach > .float-img")?.remove();
}

// ---------------------------------------------------------------- quote

function quote() {
  if (reduced) return;
  const mm = gsap.matchMedia();
  mm.add("(min-width: 821px)", () => {
    gsap.timeline({ scrollTrigger: { trigger: ".quote", start: "top 75%", end: "bottom bottom", scrub: true } })
      .to(".quote__frame", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" }, 0)
      .to(".quote__frame img", { scale: 1, ease: "none" }, 0);
  });
  mm.add("(max-width: 820px)", () => gsap.set(".quote__frame", { clipPath: "inset(0% 0% 0% 0%)" }));
}

// ---------------------------------------------------------------- boot

boot(async () => {
  const canvas = $(".hero__gl");
  const skyImg = $(".hero__sky img");
  if (canvas && !reduced) {
    const pick = () => skyImg.currentSrc || skyImg.src;
    if (skyImg.complete) livingSky(canvas, pick());
    else skyImg.addEventListener("load", () => livingSky(canvas, pick()), { once: true });
  }

  const fromLoader = await runLoader();
  heroIntro(fromLoader).play();
  heroScroll();
  heroMouse();
  strip();
  spotlight();
  floatImages();
  quote();
  requestAnimationFrame(onHashArrival);
});
