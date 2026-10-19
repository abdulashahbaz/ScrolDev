(() => {
const { boot, gsap, ScrollTrigger, SplitText, reduced, $, $$, lockScroll, plusIcon, residences, img, src, srcset, planFor } = window.Oriel;

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
      const wob = 1 + 0.12 * Math.sin(t * 2 + ph) + 0.06 * Math.sin(t * 3 + ph * 2) + 0.025 * Math.sin(t * 5 + k * 0.7);
      pts.push(`${(400 + Math.cos(t) * rad * wob * 1.25).toFixed(1)},${(300 + Math.sin(t) * rad * wob).toFixed(1)}`);
    }
    paths += `<polyline points="${pts.join(" ")}" fill="none" stroke="rgba(236,230,220,${k % 5 === 0 ? 0.28 : 0.11})" stroke-width="${k % 5 === 0 ? 1.2 : 0.8}"/>`;
  }
  const road = () => {
    const base = 120 + rnd() * 360;
    const tilt = (rnd() - 0.5) * 0.5;
    const y = (x) => base + tilt * x + Math.sin(x / 140 + base) * 26;
    let d = `M-20 ${y(-20).toFixed(1)}`;
    for (let x = 20; x <= 840; x += 40) d += ` L${x} ${y(x).toFixed(1)}`;
    return `<path d="${d}" fill="none" stroke="rgba(236,230,220,0.32)" stroke-width="1.6" stroke-linejoin="round"/>`;
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

// Editorial mosaic: pair images row by row (portrait with landscape, two
// landscapes with alternating weights); a leftover image runs full width.
function galleryRows() {
  const imgs = r.images;
  const rows = [];
  for (let i = 0, k = 0; i < imgs.length; k++) {
    const a = imgs[i], b = imgs[i + 1];
    if (!b) { rows.push([[i, 12]]); i += 1; continue; }
    if (a.p && !b.p) rows.push([[i, 4], [i + 1, 8]]);
    else if (!a.p && b.p) rows.push([[i, 8], [i + 1, 4]]);
    else rows.push(k % 2 ? [[i, 5], [i + 1, 7]] : [[i, 7], [i + 1, 5]]);
    i += 2;
  }
  const tile = ([j, span]) => {
    const im = imgs[j];
    return `<figure class="gal__item${im.p ? " is-p" : ""}" style="--span:${span}" data-img-reveal>
      <button type="button" data-open="${j}" data-cursor="View" aria-label="Open image ${j + 1} of ${imgs.length}: ${im.cap}">
        <span class="gal__media"><img src="${src(im.src)}" srcset="${srcset(im.src)}" sizes="(max-width: 820px) 100vw, ${Math.round((span / 12) * 100)}vw" alt="${im.cap}" loading="lazy" decoding="async" draggable="false"></span>
      </button>
      <figcaption><span class="tabular">${pad(j + 1)}</span>${im.cap}</figcaption>
    </figure>`;
  };
  return rows.map((row) => `<div class="gal__row${row.length === 1 ? " gal__row--wide" : ""}">${row.map(tile).join("")}</div>`).join("");
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
          <h1 class="display r-hero__title${r.name.length > 13 ? " is-long" : ""}" data-split="manual">${r.name}</h1>
        </div>
        <div class="r-hero__side" data-hero-side>
          <span class="eyebrow">${price ? "Guide price" : "Offered privately"}</span>
          <span class="r-hero__price">${r.price}</span>
          <div style="display:flex;gap:10px;justify-content:inherit;margin-top:18px">
            <a class="btn" href="#enquire" data-magnetic="0.25"><span class="roll"><span>Arrange a viewing</span><span aria-hidden="true">Arrange a viewing</span></span>${arrow}</a>
            <button class="save save--inline" type="button" data-save="${r.id}" data-name="${r.name}" aria-pressed="false">${plusIcon}</button>
          </div>
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

    <section class="section story wrap" data-header="bone" aria-label="About the residence">
      <p class="eyebrow"><b>(01)</b>&nbsp;&nbsp;The residence</p>
      <p class="lead story__lead" data-split>${r.lead}</p>
      <div class="story__cols" data-reveal>
        <div>${story.slice(0, half).map((p) => `<p>${p}</p>`).join("")}</div>
        <div>${story.slice(half).map((p) => `<p>${p}</p>`).join("")}</div>
      </div>
      <blockquote class="story__quote" data-reveal>“${r.quote.text}”<cite>${r.quote.by}</cite></blockquote>
    </section>

    <section class="section gal" data-header="bone" aria-labelledby="g-title">
      <div class="wrap gal__head">
        <p class="eyebrow"><b>(02)</b>&nbsp;&nbsp;Gallery</p>
        <h2 id="g-title" class="headline" data-split>Every room, <em>in its own light.</em></h2>
        <button class="btn" type="button" data-open="0" data-magnetic="0.25"><span class="roll"><span>View all ${pad(r.images.length)}</span><span aria-hidden="true">View all ${pad(r.images.length)}</span></span></button>
      </div>
      <div class="wrap gal__grid">${galleryRows()}</div>
    </section>

    <section class="section" data-header="bone" aria-labelledby="plan-title">
      <div class="wrap plan">
        <div class="plan__info">
          <p class="eyebrow"><b>(03)</b>&nbsp;&nbsp;Plan</p>
          <h2 id="plan-title" class="headline" data-split>The <em>layout</em></h2>
          <p data-reveal>Indicative plan of ${r.interior.toLocaleString("en-US")} m² across ${levels.length === 1 ? "a single level" : levels.length + " levels"}. Full drawings are shared after a first conversation.</p>
          ${levels.length > 1 ? `<div class="plan__tabs" role="tablist">${levels.map((l, j) => `<button class="fchip" type="button" role="tab" aria-selected="${j === 0}" data-level="${j}">${l.name}</button>`).join("")}</div>` : ""}
          <ul class="plan__rooms" data-rooms></ul>
        </div>
        <div class="plan__drawing" data-plan><span class="plan__north">N ↑</span></div>
      </div>
    </section>

    <section class="section" data-header="bone" aria-labelledby="amen-title" style="padding-top:0">
      <div class="wrap amen">
        <p class="eyebrow" id="amen-title"><b>(04)</b>&nbsp;&nbsp;Amenities</p>
        <ul>${r.amenities.map((a, j) => `<li data-reveal><span>${pad(j + 1)}</span>${a}</li>`).join("")}</ul>
      </div>
    </section>

    <section class="section section--paper" data-header="ink" aria-labelledby="loc-title" style="color:var(--ink)">
      <div class="wrap locate">
        <div class="locate__map" data-img-reveal>${mapSvg()}<span class="locate__pin" aria-hidden="true"></span><span class="locate__coords">${r.coords}</span></div>
        <div class="locate__info">
          <p class="eyebrow"><b>(05)</b>&nbsp;&nbsp;Location</p>
          <h2 id="loc-title" class="display" data-split>${r.city}</h2>
          <ul class="dist" style="border-top:1px solid var(--line-ink)">${r.distances.map(([a, b]) => `<li style="border-color:var(--line-ink)"><span>${a}</span><span style="color:var(--mute-ink)">${b}</span></li>`).join("")}</ul>
          <p style="margin-top:22px;font-size:var(--fs-sm);color:var(--mute-ink)">Local time <span data-clock="${r.tz}"><time>--:--</time></span>. Exact address shared on request.</p>
        </div>
      </div>
    </section>

    ${price ? `
    <section class="section section--paper" data-header="ink" aria-labelledby="calc-title" style="padding-top:0">
      <div class="wrap calc">
        <p class="eyebrow" id="calc-title"><b>(06)</b>&nbsp;&nbsp;Financing, indicative</p>
        <form class="calc__form" data-calc data-cur="${price.cur}" data-price="${price.value}" onsubmit="return false">
          <div class="field-range"><label for="dep"><span>Deposit</span><output for="dep" data-o="dep">40%</output></label><input id="dep" type="range" min="20" max="80" step="5" value="40"></div>
          <div class="field-range"><label for="rate"><span>Interest rate</span><output for="rate" data-o="rate">4.2%</output></label><input id="rate" type="range" min="2" max="7.5" step="0.1" value="4.2"></div>
          <div class="field-range"><label for="term"><span>Term</span><output for="term" data-o="term">25 years</output></label><input id="term" type="range" min="10" max="30" step="5" value="25"></div>
        </form>
        <div class="calc__out">
          <dl>
            <dt>Monthly, indicative</dt><dd class="tabular" data-monthly>—</dd>
            <dt>Loan amount</dt><dd class="tabular" style="font-size:1.4rem;margin-bottom:18px" data-loan>—</dd>
          </dl>
          <small>Illustration only, before fees and taxes. Our advisory team works with private banks in each market.</small>
        </div>
      </div>
    </section>` : ""}

    <section class="section" id="enquire" data-header="bone" aria-labelledby="enq-title">
      <div class="wrap enquire">
        <div class="enquire__intro">
          <p class="eyebrow"><b>●</b>&nbsp;&nbsp;Private viewing</p>
          <h2 id="enq-title" class="headline" data-split>See it <em>in person.</em></h2>
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
    <div class="lb" role="dialog" aria-modal="true" aria-label="${r.name} gallery" aria-hidden="true">
      <div class="lb__bg"></div>
      <div class="lb__top">
        <span class="lb__title">${r.name}</span>
        <span class="lb__count tabular"></span>
        <button class="icon-btn lb__close" type="button" data-lb="close" aria-label="Close gallery"><svg viewBox="0 0 16 16"><path d="M2 2l12 12M14 2L2 14" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></button>
      </div>
      <div class="lb__stage">
        <div class="lb__frame"><img class="lb__img" alt="" draggable="false"></div>
        <button class="lb__zone lb__zone--prev" type="button" data-lb="prev" data-cursor="Prev" aria-label="Previous image"></button>
        <button class="lb__zone lb__zone--next" type="button" data-lb="next" data-cursor="Next" aria-label="Next image"></button>
      </div>
      <div class="lb__bottom">
        <p class="lb__cap" aria-live="polite"></p>
        <div class="lb__thumbs">${r.images.map((im, j) => `<button class="lb__thumb" type="button" data-lb-go="${j}" aria-label="Image ${j + 1}: ${im.cap}"><img src="${src(im.src, 800)}" alt="" loading="lazy" draggable="false"></button>`).join("")}</div>
      </div>
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
  const split = SplitText.create(title, { type: "lines, words, chars", mask: "lines" });
  gsap.timeline({ delay: 0.15 })
    .from(".r-hero__img img", { scale: 1.2, duration: 2.4, ease: "oriel" }, 0)
    .from(split.chars, { yPercent: 115, duration: 1.3, stagger: 0.03 }, 0.2)
    .from([".r-hero__loc", "[data-hero-side]", ".r-hero__back"], { opacity: 0, y: 24, duration: 1.1, stagger: 0.1 }, 0.6);
  gsap.timeline({ scrollTrigger: { trigger: ".r-hero", start: "top top", end: "bottom top", scrub: true } })
    .to(".r-hero__img", { yPercent: 25, ease: "none" }, 0)
    .to(".r-hero__content", { yPercent: -40, opacity: 0, ease: "none" }, 0);
}

function gallery() {
  if (reduced) return;
  // gentle parallax inside each tile
  $$(".gal__media img").forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6, ease: "none",
      scrollTrigger: { trigger: img.closest(".gal__item"), start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}

// Full-screen viewer: opens out of the tile you clicked, thumbnails, swipe,
// click-to-zoom, arrow keys, adjacent images preloaded.
function viewer() {
  const n = r.images.length;
  const lb = $(".lb");
  const bg = $(".lb__bg", lb);
  const stage = $(".lb__stage", lb);
  const pic = $(".lb__img", lb);
  const cap = $(".lb__cap", lb);
  const count = $(".lb__count", lb);
  const thumbs = $$(".lb__thumb", lb);
  const chrome = [$(".lb__top", lb), $(".lb__bottom", lb)];
  let at = 0, isOpen = false, busy = false, zoomed = false, opener = null;

  const big = (j) => src(r.images[j].src, 2200);
  const wrap = (j) => (j + n) % n;
  const loaded = new Map();
  const preload = (j) => {
    j = wrap(j);
    if (!loaded.has(j)) {
      const im = new Image();
      im.src = big(j);
      loaded.set(j, (im.decode ? im.decode() : Promise.resolve()).catch(() => {}));
    }
    return loaded.get(j);
  };
  const meta = () => {
    cap.textContent = r.images[at].cap;
    count.textContent = `${pad(at + 1)} / ${pad(n)}`;
    thumbs.forEach((t, j) => t.setAttribute("aria-current", String(j === at)));
    thumbs[at]?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
  };
  const unzoom = () => {
    if (!zoomed) return;
    zoomed = false;
    lb.classList.remove("is-zoomed");
    gsap.to(pic, { scale: 1, x: 0, y: 0, duration: 0.5, ease: "oriel" });
  };
  const go = async (j, dir) => {
    j = wrap(j);
    if (busy || j === at) return;
    busy = true;
    unzoom();
    dir = dir || (j > at ? 1 : -1);
    await gsap.to(pic, { opacity: 0, x: -dir * 60, duration: reduced ? 0 : 0.28, ease: "power2.in" });
    at = j;
    await preload(at);
    pic.src = big(at);
    pic.alt = r.images[at].cap;
    meta();
    await gsap.fromTo(pic, { opacity: 0, x: dir * 60 }, { opacity: 1, x: 0, duration: reduced ? 0 : 0.7, ease: "oriel" });
    preload(at + 1); preload(at - 1);
    busy = false;
  };
  const visible = (el) => {
    const b = el.getBoundingClientRect();
    return b.bottom > 0 && b.top < innerHeight && b.width > 0;
  };
  const fly = (fromRect, toRect, srcUrl, radius) => {
    const f = document.createElement("img");
    f.className = "lb__fly";
    f.src = srcUrl;
    f.alt = "";
    document.body.appendChild(f);
    gsap.set(f, { left: fromRect.left, top: fromRect.top, width: fromRect.width, height: fromRect.height, borderRadius: radius[0] });
    return gsap.to(f, { left: toRect.left, top: toRect.top, width: toRect.width, height: toRect.height, borderRadius: radius[1], duration: 0.9, ease: "oriel-io" })
      .then(() => f.remove());
  };

  const open = async (j, from) => {
    if (isOpen) return;
    isOpen = true;
    opener = from;
    at = wrap(j);
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    lockScroll(true);
    meta();
    await preload(at);
    pic.src = big(at);
    pic.alt = r.images[at].cap;
    const tile = from?.closest(".gal__item")?.querySelector("button");
    gsap.fromTo(chrome, { opacity: 0, y: (k) => (k ? 20 : -20) }, { opacity: 1, y: 0, duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.2 });
    if (!reduced && tile && visible(tile)) {
      gsap.set(pic, { opacity: 0 });
      gsap.to(bg, { opacity: 1, duration: 0.6 });
      await new Promise((res) => requestAnimationFrame(res));
      await fly(tile.getBoundingClientRect(), pic.getBoundingClientRect(), pic.src, [6, 3]);
      gsap.set(pic, { opacity: 1 });
    } else {
      gsap.to(bg, { opacity: 1, duration: reduced ? 0 : 0.5 });
      gsap.fromTo(pic, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: reduced ? 0 : 0.8 });
    }
    preload(at + 1); preload(at - 1);
    $(".lb__close", lb).focus();
  };

  const close = async () => {
    if (!isOpen || busy) return;
    busy = true;
    unzoom();
    const tile = $(`.gal__item [data-open="${at}"]`);
    gsap.to(chrome, { opacity: 0, duration: reduced ? 0 : 0.3 });
    if (!reduced && tile && visible(tile)) {
      const from = pic.getBoundingClientRect();
      gsap.set(pic, { opacity: 0 });
      gsap.to(bg, { opacity: 0, duration: 0.7, delay: 0.15 });
      await fly(from, tile.getBoundingClientRect(), pic.src, [3, 6]);
    } else {
      await gsap.to([bg, pic], { opacity: 0, duration: reduced ? 0 : 0.4 });
    }
    gsap.set(pic, { opacity: 1, x: 0 });
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    lockScroll(false);
    isOpen = false;
    busy = false;
    (tile || opener)?.focus({ preventScroll: true });
  };

  $$("[data-open]").forEach((b) => b.addEventListener("click", () => open(Number(b.dataset.open), b)));
  $(".lb__close", lb).addEventListener("click", close);
  $("[data-lb=prev]", lb).addEventListener("click", () => go(at - 1, -1));
  $("[data-lb=next]", lb).addEventListener("click", () => go(at + 1, 1));
  thumbs.forEach((t) => t.addEventListener("click", () => go(Number(t.dataset.lbGo))));

  // click the picture to zoom; move the pointer to look around
  pic.addEventListener("click", (e) => {
    if (zoomed) return unzoom();
    zoomed = true;
    lb.classList.add("is-zoomed");
    const b = pic.getBoundingClientRect();
    gsap.to(pic, { scale: 2.2, x: (b.left + b.width / 2 - e.clientX) * 1.2, y: (b.top + b.height / 2 - e.clientY) * 1.2, duration: 0.7, ease: "oriel" });
  });
  stage.addEventListener("pointermove", (e) => {
    if (!zoomed || e.pointerType !== "mouse") return;
    const s = stage.getBoundingClientRect();
    const nx = (e.clientX - s.left) / s.width - 0.5;
    const ny = (e.clientY - s.top) / s.height - 0.5;
    gsap.to(pic, { x: -nx * pic.offsetWidth * 1.2, y: -ny * pic.offsetHeight * 1.2, duration: 0.6, ease: "power3", overwrite: "auto" });
  });

  // swipe
  let sx = null, sy = null;
  stage.addEventListener("pointerdown", (e) => { if (!zoomed) { sx = e.clientX; sy = e.clientY; } });
  stage.addEventListener("pointerup", (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = sy = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(at + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") go(at + 1, 1);
    else if (e.key === "ArrowLeft") go(at - 1, -1);
    else if (e.key === "Tab") {
      const f = $$("button", lb).filter((b) => b.offsetParent !== null);
      const k = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
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
    tabs.forEach((o) => o.setAttribute("aria-selected", String(o === t)));
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
  viewer();
  plan();
  calc();
}, render);
})();
