import { boot, gsap, Flip, ScrollTrigger, reduced, fine, $, $$ } from "./core.js";
import { residences, img } from "./data.js";

const pad = (n) => String(n).padStart(2, "0");
const statusChip = (s) => `<span class="chip ${s === "Under offer" ? "chip--offer" : s === "Private" ? "chip--private" : ""}"><i></i>${s}</span>`;

function render() {
  const host = $("[data-cards]");
  host.innerHTML = residences.map((r, i) => {
    const alt = r.images[1];
    return `
      <article class="card" data-region="${r.region}" data-usd="${r.usd}" data-built="${r.year}" data-order="${i}" data-img="${`assets/img/${r.cover}-800.webp`}">
        <a class="card__img" href="residence.html?id=${r.id}" data-cursor="View" aria-label="${r.name}, ${r.city}">
          ${img(r.cover, `${r.name}, ${r.city}`, "(max-width: 820px) 100vw, 50vw")}
          ${alt ? img(alt.src, "", "(max-width: 820px) 100vw, 50vw", 'class="alt"') : ""}
          ${statusChip(r.status)}
        </a>
        <div class="card__body">
          <span class="card__no tabular">${pad(i + 1)}</span>
          <h2 class="card__name"><a href="residence.html?id=${r.id}">${r.name}</a></h2>
          <span class="card__price">${r.price}</span>
          <span class="card__loc">${r.city}, ${r.country}</span>
          <span class="card__type">${r.region}</span>
          <span class="card__specs">${r.beds} bd · ${r.baths} ba · ${r.interior.toLocaleString("en-US")} m²</span>
        </div>
      </article>`;
  }).join("");
}

function layout(cards) {
  let k = 0;
  cards.forEach((c) => {
    c.classList.remove("l1", "l2", "l3", "l4");
    if (!c.classList.contains("is-hidden")) c.classList.add("l" + ((k++ % 4) + 1));
  });
}

function init() {
  const host = $("[data-cards]");
  const cards = $$(".card", host);
  const chips = $$("[data-filter]");
  const sort = $("[data-sort]");
  const views = $$("[data-view]");
  const empty = $(".empty-note");
  let filter = "all";
  let order = "featured";
  layout(cards);

  // entrance
  if (!reduced) {
    cards.forEach((c) => {
      gsap.from(c, { y: 80, opacity: 0, duration: 1.4, scrollTrigger: { trigger: c, start: "top 92%", once: true } });
      const im = $(".card__img img", c);
      if (im) gsap.from(im, { scale: 1.25, duration: 1.8, scrollTrigger: { trigger: c, start: "top 92%", once: true } });
    });
  }

  const apply = (animate = true) => {
    const state = Flip.getState(cards, { props: "opacity" });
    const sorted = [...cards].sort((a, b) => {
      if (order === "price-desc") return b.dataset.usd - a.dataset.usd;
      if (order === "price-asc") return a.dataset.usd - b.dataset.usd;
      if (order === "year") return b.dataset.built - a.dataset.built;
      return a.dataset.order - b.dataset.order;
    });
    sorted.forEach((c) => host.appendChild(c));
    let shown = 0;
    cards.forEach((c) => {
      const hide = filter !== "all" && c.dataset.region !== filter;
      c.classList.toggle("is-hidden", hide);
      if (!hide) shown++;
    });
    layout(sorted);
    empty.classList.toggle("is-shown", shown === 0);
    if (!animate || reduced) return ScrollTrigger.refresh();
    Flip.from(state, {
      duration: 1.1,
      ease: "oriel",
      absolute: true,
      stagger: 0.04,
      nested: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.5 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  };

  chips.forEach((b) => b.addEventListener("click", () => {
    filter = b.dataset.filter;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    apply();
  }));
  sort.addEventListener("change", () => { order = sort.value; apply(); });
  views.forEach((b) => b.addEventListener("click", () => {
    const list = b.dataset.view === "list";
    if (host.classList.contains("cards--list") === list) return;
    views.forEach((v) => v.setAttribute("aria-pressed", String(v === b)));
    const state = Flip.getState(cards);
    host.classList.toggle("cards--list", list);
    if (reduced) return ScrollTrigger.refresh();
    Flip.from(state, { duration: 0.9, ease: "oriel", stagger: 0.03, onComplete: () => ScrollTrigger.refresh() });
  }));

  // list view: an image follows the pointer
  if (fine) {
    const box = document.createElement("div");
    box.className = "float-img";
    box.setAttribute("aria-hidden", "true");
    document.body.appendChild(box);
    cards.forEach((c) => {
      const im = new Image();
      im.src = c.dataset.img;
      im.alt = "";
      box.appendChild(im);
      c._img = im;
    });
    const xTo = gsap.quickTo(box, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(box, "y", { duration: 0.7, ease: "power3" });
    host.addEventListener("pointermove", (e) => {
      if (!host.classList.contains("cards--list")) return;
      xTo(e.clientX + 30);
      yTo(e.clientY - box.offsetHeight / 2);
    });
    cards.forEach((c) => c.addEventListener("pointerenter", () => {
      if (!host.classList.contains("cards--list")) return;
      cards.forEach((o) => o._img.classList.toggle("is-active", o === c));
      gsap.to(box, { opacity: 1, scale: 1, duration: 0.5, overwrite: "auto" });
    }));
    host.addEventListener("pointerleave", () => gsap.to(box, { opacity: 0, scale: 0.8, duration: 0.4, overwrite: "auto" }));
  }

  // whole-row click in list view
  host.addEventListener("click", (e) => {
    if (!host.classList.contains("cards--list") || e.target.closest("a")) return;
    const card = e.target.closest(".card");
    card?.querySelector("a")?.click();
  });
}

boot(init, render);
