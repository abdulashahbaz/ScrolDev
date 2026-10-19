(() => {
const { boot, gsap, ScrollTrigger, SplitText, reduced, fine, $, $$, lockScroll, onHashArrival } = window.Oriel;

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

// Draws an image sequence on a canvas, one frame per scroll position, so the
// films only move when the reader scrolls. Frames load coarse to fine, so
// scrubbing works before the whole set has arrived.
function frameSequence(canvas, { dir, count, alignY = 0.5 }) {
  const ctx = canvas.getContext("2d");
  const frames = [];
  let want = 0, drawn = -1, raf = 0, started = false;

  const draw = () => {
    raf = 0;
    let i = -1;
    for (let d = 0; d < count && i < 0; d++) {
      if (frames[want - d]?.ok) i = want - d;
      else if (frames[want + d]?.ok) i = want + d;
    }
    if (i < 0 || i === drawn) return;
    const img = frames[i].img;
    const cw = canvas.width, ch = canvas.height;
    const k = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * k, h = img.naturalHeight * k;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) * alignY, w, h);
    drawn = i;
    canvas.classList.add("is-ready");
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(draw); };
  const load = (i) => new Promise((done) => {
    const img = new Image();
    const entry = { img, ok: false };
    frames[i] = entry;
    img.decoding = "async";
    img.onload = () => { entry.ok = true; schedule(); done(); };
    img.onerror = done;
    img.src = `${dir}${String(i).padStart(4, "0")}.webp`;
  });
  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    ctx.imageSmoothingQuality = "high";
    drawn = -1;
    schedule();
  };
  size();
  window.addEventListener("resize", size);

  return {
    start() {
      if (started) return;
      started = true;
      const order = [], seen = new Set();
      for (const step of [count - 1, 16, 8, 4, 2, 1]) {
        for (let i = 0; i < count; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
      }
      // four requests at a time leaves room for everything else on the page
      let k = 0;
      const next = () => { if (k < order.length) load(order[k++]).then(next); };
      for (let c = 0; c < 4; c++) next();
    },
    seek(p) {
      want = Math.round(Math.min(1, Math.max(0, p)) * (count - 1));
      schedule();
    },
  };
}

// The hero film is scrubbed by the scroll. Its first frame is the poster, so
// it takes over from the loader without a cut. Skipped for reduced motion and
// data saver, which keep the still.
function heroFilm() {
  const canvas = $(".hero__canvas");
  if (!canvas || reduced || navigator.connection?.saveData) return null;
  const portrait = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
  const seq = frameSequence(canvas, {
    dir: (portrait && canvas.dataset.framesPortrait) || canvas.dataset.frames,
    count: Number(canvas.dataset.count),
    alignY: 1,
  });
  document.documentElement.classList.add("has-film");
  return seq;
}

function heroIntro(fromLoader) {
  fitTitle();
  $(".hero__title").classList.add("is-split");
  if (reduced) return gsap.timeline();
  const tl = gsap.timeline({ paused: true });
  const small = SplitText.create(".hero__title .t-small", { type: "lines, words, chars", mask: "lines", aria: "none" });
  const big = SplitText.create(".hero__title .t-big", { type: "lines, chars", mask: "lines", aria: "none" });
  tl.from(small.chars, { yPercent: 115, duration: 1.2, stagger: 0.035 }, 0.1)
    .from(big.chars, { yPercent: 115, duration: 1.5, stagger: 0.04 }, 0.2)
    .from(".hero__shade", { opacity: 0, duration: 1.6, ease: "power2.out" }, 0)
    .from("[data-hero-fade]", { opacity: 0, y: 24, duration: 1.2, stagger: 0.12 }, 0.8);
  if (!fromLoader) tl.from(".hero__inner", { scale: 1.12, duration: 2.6, ease: "oriel" }, 0);
  return tl;
}

// With the film, the hero holds for an extra screen (the statement's top
// margin makes the room) and the camera moves in as the page is scrolled.
function heroScroll(film) {
  if (reduced) return;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: () => "+=" + window.innerHeight * (film ? 2 : 1),
      scrub: true,
      pin: true,
      pinSpacing: false,
      // the film is done by the time the next section starts to cover it
      onUpdate: film ? (self) => film.seek(self.progress / 0.55) : undefined,
    },
  });
  tl.to(".hero__title", { yPercent: -45, opacity: 0, ease: "none", duration: 0.45 }, 0)
    .to("[data-hero-fade]", { opacity: 0, ease: "none", duration: 0.12 }, 0);
  if (!film) tl.to(".hero__media", { scale: 1.1, yPercent: 6, ease: "none", duration: 1 }, 0);
  tl.set({}, {}, 1); // durations above are fractions of the pin
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
      st.kill();
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

// The spotlight film moves with the scroll: through the first chapter on
// wide screens, and while it crosses the screen on phones.
function spotFilm() {
  const canvas = $(".spot__film canvas");
  if (!canvas || reduced || navigator.connection?.saveData) return;
  const seq = frameSequence(canvas, { dir: canvas.dataset.frames, count: Number(canvas.dataset.count) });
  ScrollTrigger.create({ trigger: ".spot", start: "top bottom+=100%", once: true, onEnter: () => seq.start() });
  const mm = gsap.matchMedia();
  mm.add("(min-width: 821px)", () => {
    const st = ScrollTrigger.create({
      trigger: ".spot", start: "top bottom", endTrigger: $$(".chapter")[1], end: "top bottom",
      onUpdate: (self) => seq.seek(self.progress),
    });
    return () => st.kill();
  });
  mm.add("(max-width: 820px)", () => {
    const st = ScrollTrigger.create({
      trigger: ".spot__media", start: "top bottom", end: "bottom top",
      onUpdate: (self) => seq.seek(self.progress / 0.5),
    });
    return () => st.kill();
  });
}

function spotlight() {
  const imgs = $$(".spot__frame");
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
    // on phones the media is not sticky: the film runs as it comes up the
    // screen, then the two photographs wipe in as it leaves
    if (reduced) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".spot__media", start: "top bottom", end: "bottom top", scrub: true,
        onUpdate: (self) => (idx.textContent = pad(self.progress < 0.62 ? 1 : self.progress < 0.8 ? 2 : 3)),
      },
    });
    imgs.slice(1).forEach((im, j) => tl.fromTo(im, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none", duration: 0.16 }, 0.48 + j * 0.18));
    tl.set({}, {}, 1);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
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
    // the words only arrive once the picture fills the screen, so they never sit half on paper
    gsap.timeline({ scrollTrigger: { trigger: ".quote", start: "top 75%", end: "bottom bottom", scrub: true } })
      .to(".quote__frame", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", duration: 1 }, 0)
      .to(".quote__frame img", { scale: 1, ease: "none", duration: 1 }, 0)
      .fromTo(".quote blockquote", { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "power1.out", duration: 0.3 }, 0.72);
  });
  mm.add("(max-width: 820px)", () => gsap.set(".quote__frame", { clipPath: "inset(0% 0% 0% 0%)" }));
}

// ---------------------------------------------------------------- boot

boot(async () => {
  const film = heroFilm();
  const fromLoader = await runLoader();
  heroIntro(fromLoader).play();
  if (film) {
    // nothing moves until the reader scrolls, so let the first paint finish before fetching frames
    const kick = () => { film.start(); events.forEach((e) => window.removeEventListener(e, kick)); };
    const events = ["scroll", "wheel", "touchstart", "pointermove", "keydown"];
    events.forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }));
    setTimeout(kick, 2500);
  }
  heroScroll(film);
  strip();
  spotlight();
  spotFilm();
  floatImages();
  quote();
  requestAnimationFrame(onHashArrival);
});
})();
