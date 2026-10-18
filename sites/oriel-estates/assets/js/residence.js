import { boot, gsap, ScrollTrigger, SplitText, reduced, $, $$, dragScroll, lockScroll } from "./core.js";
import { residences, img, src, srcset, planFor } from "./data.js";

const params = new URLSearchParams(location.search);
const r = residences.find((x) => x.id === params.get("id")) || residences[0];
const i = residences.indexOf(r);
const next = residences[(i + 1) % residences.length];
const pad = (n) => String(n).padStart(2, "0");
const arrow = `<svg class="btn__arrow" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7h12M8 2l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`;

// "€18,900,000" -> { cur: "€", value: 18900000 }
function parsePrice(p) {
  const m = p.match(/^([^\d]*)([\d,]+)/);
  if (!m) return null;
  return { cur: m[1], value: Number(m[2].replace(/,/g, "")) };
}
const money = (cur, v) => cur + Math.round(v).toLocaleString("en-US");

function hash(s) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

// ---------------------------------------------------------------- markup

function mapSvg() {
  const rnd = hash(r.id);
  const coastal = r.region === "Coastal" || r.region === "Alpine";
  let paths = "";
  for (let k = 1; k <= 11; k++) {
    const rad = k * 34;
    const pts = [];
    const ph = rnd() * 6.28;
    for (let a = 0; a <= 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      const wob = 1 + 0.16 * Math.sin(t * 3 + ph) + 0.08 * Math.sin(t * 5 + ph * 2) + 0.05 * Math.sin(t * 9 + k);
      pts.push(`${(400 + Math.cos(t) * rad * wob * 1.25).toFixed(1)},${(300 + Math.sin(t) * rad * wob).toFixed(1)}`);
    }
    paths += `<polyline points="${pts.join(" ")}" fill="none" stroke="rgba(236,230,220,${k % 5 === 0 ? 0.28 : 0.11})" stroke-width="${k % 5 === 0 ? 1.2 : 0.8}"/>`;
  }
  const road = () => {
    let d = `M${-20} ${100 + rnd() * 400}`;
    for (let x = 80; x <= 900; x += 120) d += ` Q${x - 60} ${100 + rnd() * 400} ${x} ${100 + rnd() * 400}`;
    return `<path d="${d}" fill="none" stroke="rgba(236,230,220,0.35)" stroke-width="1.4" stroke-dasharray="1 0"/>`;
  };
  const water = coastal
    ? `<path d="M0 ${430 + rnd() * 40} C 200 ${380 + rnd() * 60}, 420 ${470 + rnd() * 40}, 800 ${400 + rnd() * 40} L800 600 L0 600Z" fill="rgba(120,150,170,0.14)"/>`
    : "";
  return `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${water}${paths}${road()}${road()}</svg>`;
}

function planSvg(level, k) {
  const rooms = level.rooms;
  const closed = rooms.filter((x) => !x.open);
  const minX = Math.min(...closed.map((x) => x.x)), minY = Math.min(...closed.map((x) => x.y));
  const maxX = Math.max(...closed.map((x) => x.x + x.w)), maxY = Math.max(...closed.map((x) => x.y + x.h));
  const unit = Math.sqrt(k);
  const rects = rooms.map((x, j) => `
    <g class="room-g" data-room="${j}">
      <rect class="room" x="${x.x}" y="${x.y}" width="${x.w}" height="${x.h}" ${x.open ? 'stroke-dasharray="1.2 1"' : ""}/>
      <text x="${x.x + x.w / 2}" y="${x.y + x.h / 2}" text-anchor="middle">${x.n}</text>
      <text class="dim" x="${x.x + x.w / 2}" y="${x.y + x.h / 2 + 3.2}" text-anchor="middle">${Math.round(x.w * x.h * k)} m²</text>
    </g>`).join("");
  return `<svg viewBox="-4 -4 108 72" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${level.name} floor plan">
    <rect class="wall" x="${minX}" y="${minY}" width="${maxX - minX}" height="${maxY - minY}"/>
    ${rects}
    <text class="dim" x="${(minX + maxX) / 2}" y="${maxY + 5.5}" text-anchor="middle">${((maxX - minX) * unit).toFixed(1)} m</text>
  </svg>`;
}

function render() {
  document.title = `${r.name}, ${r.city} — Oriel`;
  const price = parsePrice(r.price);
  const levels = planFor(r);
  const closedArea = levels.flatMap((l) => l.rooms.filter((x) => !x.open)).reduce((a, x) => a + x.w * x.h, 0);
  const k = r.interior / closedArea;
  const status = r.status === "Under offer" ? "chip--offer" : r.status === "Private" ? "chip--private" : "";
  const story = r.story;
  const half = Math.ceil(story.length / 2);
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, d) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + d + 2));

  $("[data-residence]").outerHTML = `
    <section class="r-hero" data-header="bone">
      <div class="r-hero__img">${img(r.cover, `${r.name}, ${r.city}`, "100vw", 'fetchpriority="high" loading="eager"').replace('loading="lazy" ', "")}</div>
      <a class="r-hero__back" href="residences.html"><span aria-hidden="true">←</span><span class="link-line">The collection</span></a>
      <div class="r-hero__content">
        <div>
          <p class="r-hero__loc"><span class="chip ${status}"><i></i>${r.status}</span><span>${r.city}, ${r.country}</span></p>
          <h1 class="display r-hero__title" data-split="manual">${r.name}</h1>
        </div>
        <div class="r-hero__side" data-hero-side>
          <span class="eyebrow">${price ? "Guide price" : "Offered privately"}</span>
          <span class="r-hero__price">${r.price}</span>
          <a class="btn" href="#enquire" data-magnetic="0.25" style="margin-top:18px"><span class="roll"><span>Arrange a viewing</span><span aria-hidden="true">Arrange a viewing</span></span>${arrow}</a>
        </div>
      </div>
    </section>

    <dl class="facts" data-header="bone">
      <div class="fact"><dt>Bedrooms</dt><dd>${r.beds}</dd></div>
      <div class="fact"><dt>Bathrooms</dt><dd>${r.baths}</dd></div>
      <div class="fact"><dt>Interior</dt><dd>${r.interior.toLocaleString("en-US")} m²</dd></div>
      <div class="fact"><dt>Plot</dt><dd>${r.plot}</dd></div>
      <div class="fact"><dt>Completed</dt><dd>${r.year}</dd></div>
      <div class="fact"><dt>Architect</dt><dd style="font-size:clamp(1rem,1.3vw,1.3rem);line-height:1.25">${r.architect}</dd></div>
    </dl>

    <section class="section story" data-header="bone" aria-label="About the residence">
      <p class="eyebrow"><b>(01)</b>&nbsp;&nbsp;The residence</p>
      <p class="lead story__lead" data-split>${r.lead}</p>
      <div class="story__cols" data-reveal>
        <div>${story.slice(0, half).map((p) => `<p>${p}</p>`).join("")}</div>
        <div>${story.slice(half).map((p) => `<p>${p}</p>`).join("")}</div>
      </div>
      <blockquote class="story__quote" data-reveal>“${r.quote.text}”<cite>${r.quote.by}</cite></blockquote>
    </section>

    <section class="gallery" data-header="bone" aria-labelledby="g-title">
      <div class="gallery__head">
        <h2 id="g-title" class="display" data-split>Gallery<sup class="tabular" style="font-family:var(--f-body);font-size:.2em;font-weight:400;vertical-align:top;margin-left:.4em">(${pad(r.images.length)})</sup></h2>
        <div class="gallery__nav">
          <button class="icon-btn" type="button" data-g="prev" aria-label="Previous image"><svg viewBox="0 0 16 16"><path d="M15 8H1M6 3L1 8l5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></button>
          <button class="icon-btn" type="button" data-g="next" aria-label="Next image"><svg viewBox="0 0 16 16"><path d="M1 8h14M10 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></button>
        </div>
      </div>
      <div class="gallery__track" data-drag data-cursor="Drag">
        ${r.images.map((im, j) => `
          <figure class="gallery__item">
            <button type="button" data-open="${j}" aria-label="Open image ${j + 1}: ${im.cap}">
              <img src="${src(im.src)}" srcset="${srcset(im.src)}" sizes="(max-width: 820px) 90vw, 70vw" alt="${im.cap}" loading="lazy" decoding="async" draggable="false">
            </button>
            <figcaption>${pad(j + 1)} — ${im.cap}</figcaption>
          </figure>`).join("")}
      </div>
    </section>

    <section class="section" data-header="bone" aria-labelledby="plan-title">
      <div class="wrap plan">
        <div class="plan__info">
          <p class="eyebrow"><b>(02)</b>&nbsp;&nbsp;Plan</p>
          <h2 id="plan-title" class="display" data-split>The layout</h2>
          <p data-reveal>Indicative plan of ${r.interior.toLocaleString("en-US")} m² across ${levels.length === 1 ? "a single level" : levels.length + " levels"}. Full drawings are shared after a first conversation.</p>
          ${levels.length > 1 ? `<div class="plan__tabs" role="tablist">${levels.map((l, j) => `<button class="fchip" type="button" role="tab" aria-selected="${j === 0}" aria-pressed="${j === 0}" data-level="${j}">${l.name}</button>`).join("")}</div>` : ""}
          <ul class="plan__rooms" data-rooms></ul>
        </div>
        <div class="plan__drawing" data-plan><span class="plan__north">N ↑</span></div>
      </div>
    </section>

    <section class="section" data-header="bone" aria-labelledby="amen-title" style="padding-top:0">
      <div class="wrap amen">
        <p class="eyebrow" id="amen-title"><b>(03)</b>&nbsp;&nbsp;Amenities</p>
        <ul>${r.amenities.map((a, j) => `<li data-reveal><span>${pad(j + 1)}</span>${a}</li>`).join("")}</ul>
      </div>
    </section>

    <section class="section section--paper" data-header="ink" aria-labelledby="loc-title" style="color:var(--ink)">
      <div class="wrap locate">
        <div class="locate__map" data-img-reveal>${mapSvg()}<span class="locate__pin" aria-hidden="true"></span><span class="locate__coords">${r.coords}</span></div>
        <div class="locate__info">
          <p class="eyebrow"><b>(04)</b>&nbsp;&nbsp;Location</p>
          <h2 id="loc-title" class="display" data-split>${r.city}</h2>
          <ul class="dist" style="border-top:1px solid var(--line-ink)">${r.distances.map(([a, b]) => `<li style="border-color:var(--line-ink)"><span>${a}</span><span style="color:var(--mute-ink)">${b}</span></li>`).join("")}</ul>
          <p style="margin-top:22px;font-size:var(--fs-sm);color:var(--mute-ink)">Local time <span data-clock="${r.tz}"><time>--:--</time></span>. Exact address shared on request.</p>
        </div>
      </div>
    </section>

    ${price ? `
    <section class="section section--paper" data-header="ink" aria-labelledby="calc-title" style="padding-top:0">
      <div class="wrap calc">
        <p class="eyebrow" id="calc-title"><b>(05)</b>&nbsp;&nbsp;Financing, indicative</p>
        <form class="calc__form" data-calc data-cur="${price.cur}" data-price="${price.value}" onsubmit="return false">
          <div class="field-range"><label for="dep"><span>Deposit</span><output for="dep" data-o="dep">40%</output></label><input id="dep" type="range" min="20" max="80" step="5" value="40"></div>
          <div class="field-range"><label for="rate"><span>Interest rate</span><output for="rate" data-o="rate">4.2%</output></label><input id="rate" type="range" min="2" max="7.5" step="0.1" value="4.2"></div>
          <div class="field-range"><label for="term"><span>Term</span><output for="term" data-o="term">25 years</output></label><input id="term" type="range" min="10" max="30" step="5" value="25"></div>
        </form>
        <dl class="calc__out">
          <dt>Monthly, indicative</dt><dd class="tabular" data-monthly>—</dd>
          <dt>Loan amount</dt><dd class="tabular" style="font-size:1.4rem;margin-bottom:18px" data-loan>—</dd>
          <small>Illustration only, before fees and taxes. Our advisory team works with private banks in each market.</small>
        </dl>
      </div>
    </section>` : ""}

    <section class="section" id="enquire" data-header="bone" aria-labelledby="enq-title">
      <div class="wrap enquire">
        <div class="enquire__intro">
          <p class="eyebrow"><b>●</b>&nbsp;&nbsp;Private viewing</p>
          <h2 id="enq-title" class="display" data-split>See it in person.</h2>
          <p data-reveal>Viewings are hosted by a partner, usually with the architect. Choose a day and we will confirm a time.</p>
        </div>
        <div class="enquire__form">
          <form class="form" data-form novalidate>
            <fieldset class="fieldset" data-reveal>
              <legend>Preferred day</legend>
              <div class="dates">${days.map((d, j) => `<label class="date"><input type="radio" name="date" value="${d.toISOString().slice(0, 10)}" ${j === 0 ? "checked" : ""}><span>${d.toLocaleDateString("en-GB", { weekday: "short" })}<b>${d.getDate()}</b>${d.toLocaleDateString("en-GB", { month: "short" })}</span></label>`).join("")}</div>
            </fieldset>
            <div class="form__row" data-reveal>
              <div class="field"><input id="v-name" name="name" type="text" placeholder=" " autocomplete="name" required><label for="v-name">Full name</label><span class="err">Required</span></div>
              <div class="field"><input id="v-email" name="email" type="email" placeholder=" " autocomplete="email" required><label for="v-email">Email</label><span class="err">Check this email</span></div>
            </div>
            <div class="field" data-reveal><textarea id="v-msg" name="message" placeholder=" " rows="3"></textarea><label for="v-msg">Questions for the partner (optional)</label></div>
            <div class="form__actions" data-reveal>
              <p class="form__note">Concept site: this form is not connected and nothing is sent.</p>
              <button class="btn btn--solid" type="submit" data-magnetic="0.2"><span class="roll"><span>Request viewing</span><span aria-hidden="true">Request viewing</span></span></button>
            </div>
          </form>
          <div class="form-success" role="status" aria-live="polite">
            <p class="eyebrow"><b>●</b>&nbsp;&nbsp;Requested</p>
            <h3 class="display" style="margin-top:18px">Thank you.</h3>
            <p>A partner would now confirm your viewing of ${r.name}. On this concept site, nothing has been sent.</p>
          </div>
        </div>
      </div>
    </section>

    <a class="next" href="residence.html?id=${next.id}" data-header="bone" data-cursor="Next">
      ${img(next.cover, "", "100vw")}
      <div class="next__inner">
        <span class="eyebrow" style="color:var(--bone)">Next residence — ${next.city}</span>
        <h2 class="display">${next.name}</h2>
      </div>
    </a>`;

  document.body.insertAdjacentHTML("beforeend", `
    <div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" aria-hidden="true">
      <div class="lightbox__top"><span class="tabular" data-lb-count></span><button class="icon-btn" type="button" data-lb="close" aria-label="Close viewer"><svg viewBox="0 0 16 16"><path d="M2 2l12 12M14 2L2 14" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></button></div>
      <div class="lightbox__stage"><img alt=""></div>
      <div class="lightbox__bottom"><span data-lb-cap></span><span style="display:flex;gap:8px"><button class="icon-btn" type="button" data-lb="prev" aria-label="Previous image"><svg viewBox="0 0 16 16"><path d="M15 8H1M6 3L1 8l5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></button><button class="icon-btn" type="button" data-lb="next" aria-label="Next image"><svg viewBox="0 0 16 16"><path d="M1 8h14M10 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></button></span></div>
    </div>`);

  // floor plan state for init()
  render.levels = levels;
  render.k = k;
}

// ---------------------------------------------------------------- behaviour

function hero() {
  const title = $(".r-hero__title");
  title.classList.add("is-split");
  if (reduced) return;
  const split = SplitText.create(title, { type: "lines, chars", mask: "lines" });
  gsap.timeline({ delay: 0.15 })
    .from(".r-hero__img img", { scale: 1.2, duration: 2.4, ease: "oriel" }, 0)
    .from(split.chars, { yPercent: 115, duration: 1.3, stagger: 0.03 }, 0.2)
    .from([".r-hero__loc", "[data-hero-side]", ".r-hero__back"], { opacity: 0, y: 24, duration: 1.1, stagger: 0.1 }, 0.6);
  gsap.timeline({ scrollTrigger: { trigger: ".r-hero", start: "top top", end: "bottom top", scrub: true } })
    .to(".r-hero__img", { yPercent: 25, ease: "none" }, 0)
    .to(".r-hero__content", { yPercent: -40, opacity: 0, ease: "none" }, 0);
}

function gallery() {
  const track = $(".gallery__track");
  const items = $$(".gallery__item", track);
  dragScroll(track);
  const step = (dir) => {
    const x = track.scrollLeft;
    const target = items.map((it) => it.offsetLeft - track.offsetLeft).find((o) => (dir > 0 ? o > x + 10 : false)) ?? null;
    if (dir > 0) track.scrollTo({ left: target ?? track.scrollWidth, behavior: "smooth" });
    else {
      const prev = items.map((it) => it.offsetLeft - track.offsetLeft).filter((o) => o < x - 10).pop() ?? 0;
      track.scrollTo({ left: prev, behavior: "smooth" });
    }
  };
  $("[data-g=prev]").addEventListener("click", () => step(-1));
  $("[data-g=next]").addEventListener("click", () => step(1));
  if (!reduced) {
    gsap.from(items, { x: 160, opacity: 0, duration: 1.4, stagger: 0.1, scrollTrigger: { trigger: track, start: "top 85%", once: true } });
  }

  // lightbox
  const lb = $(".lightbox");
  const lbImg = $(".lightbox__stage img", lb);
  const cap = $("[data-lb-cap]", lb);
  const count = $("[data-lb-count]", lb);
  let at = 0, opener = null;
  const show = (j) => {
    at = (j + r.images.length) % r.images.length;
    const im = r.images[at];
    lbImg.src = src(im.src, 2200);
    lbImg.alt = im.cap;
    cap.textContent = im.cap;
    count.textContent = `${pad(at + 1)} / ${pad(r.images.length)}`;
    if (!reduced) gsap.fromTo(lbImg, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.8 });
  };
  const open = (j, from) => {
    opener = from;
    show(j);
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    lockScroll(true);
    $("[data-lb=close]", lb).focus();
  };
  const close = () => {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    lockScroll(false);
    opener?.focus({ preventScroll: true });
  };
  $$("[data-open]", track).forEach((b) => b.addEventListener("click", () => open(Number(b.dataset.open), b)));
  $("[data-lb=close]", lb).addEventListener("click", close);
  $("[data-lb=prev]", lb).addEventListener("click", () => show(at - 1));
  $("[data-lb=next]", lb).addEventListener("click", () => show(at + 1));
  lb.addEventListener("click", (e) => e.target === lb || e.target.classList.contains("lightbox__stage") ? close() : null);
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(at + 1);
    if (e.key === "ArrowLeft") show(at - 1);
    if (e.key === "Tab") {
      const f = $$("button", lb);
      const idx = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
}

function plan() {
  const host = $("[data-plan]");
  const list = $("[data-rooms]");
  const tabs = $$("[data-level]");
  const draw = (j) => {
    const level = render.levels[j];
    $("svg", host)?.remove();
    host.insertAdjacentHTML("beforeend", planSvg(level, render.k));
    list.innerHTML = level.rooms.map((x, n) => `<li data-room="${n}"><span>${x.n}</span><span class="tabular">${Math.round(x.w * x.h * render.k)} m²</span></li>`).join("");
    const shapes = $$(".wall, .room", host);
    if (!reduced) {
      shapes.forEach((s) => {
        const len = s.getTotalLength ? s.getTotalLength() : 400;
        gsap.fromTo(s, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", delay: Math.random() * 0.4, onComplete: () => s.hasAttribute("stroke-dasharray") || gsap.set(s, { clearProps: "strokeDasharray" }) });
      });
      gsap.from($$("text", host), { opacity: 0, duration: 0.8, stagger: 0.02, delay: 0.6 });
    }
    const hot = (n, on) => {
      $(`.room-g[data-room="${n}"] .room`, host)?.classList.toggle("is-hot", on);
      $(`li[data-room="${n}"]`, list)?.classList.toggle("is-hot", on);
    };
    $$("li", list).forEach((li) => {
      li.addEventListener("pointerenter", () => hot(li.dataset.room, true));
      li.addEventListener("pointerleave", () => hot(li.dataset.room, false));
    });
    $$(".room-g", host).forEach((g) => {
      g.addEventListener("pointerenter", () => hot(g.dataset.room, true));
      g.addEventListener("pointerleave", () => hot(g.dataset.room, false));
    });
  };
  let drawn = false;
  ScrollTrigger.create({ trigger: host, start: "top 80%", once: true, onEnter: () => { drawn = true; draw(0); } });
  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((o) => { o.setAttribute("aria-selected", String(o === t)); o.setAttribute("aria-pressed", String(o === t)); });
    if (drawn) draw(Number(t.dataset.level));
  }));
}

function calc() {
  const form = $("[data-calc]");
  if (!form) return;
  const cur = form.dataset.cur;
  const price = Number(form.dataset.price);
  const out = { monthly: $("[data-monthly]"), loan: $("[data-loan]") };
  const shown = { m: 0, l: 0 };
  const update = () => {
    const dep = Number($("#dep").value) / 100;
    const rate = Number($("#rate").value) / 100 / 12;
    const n = Number($("#term").value) * 12;
    const loan = price * (1 - dep);
    const m = (loan * rate) / (1 - Math.pow(1 + rate, -n));
    $("[data-o=dep]").textContent = Math.round(dep * 100) + "%";
    $("[data-o=rate]").textContent = Number($("#rate").value).toFixed(1) + "%";
    $("[data-o=term]").textContent = $("#term").value + " years";
    $$("input[type=range]", form).forEach((el) => el.style.setProperty("--fill", ((el.value - el.min) / (el.max - el.min)) * 100 + "%"));
    gsap.to(shown, {
      m, l: loan, duration: reduced ? 0 : 0.8, ease: "power3.out", overwrite: true,
      onUpdate: () => { out.monthly.textContent = money(cur, shown.m); out.loan.textContent = money(cur, shown.l); },
    });
  };
  form.addEventListener("input", update);
  update();
}

boot(() => {
  hero();
  gallery();
  plan();
  calc();
}, render);
