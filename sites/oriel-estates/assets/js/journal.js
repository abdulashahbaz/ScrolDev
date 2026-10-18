import { boot, $ } from "./core.js";
import { posts, img } from "./data.js";

const id = new URLSearchParams(location.search).get("id");
const post = posts.find((p) => p.id === id) || posts[0];

function render() {
  document.title = `${post.title} — Oriel Journal`;
  const others = posts.filter((p) => p !== post);
  $("[data-article]").outerHTML = `
    <article>
      <header class="article-head" data-header="bone">
        <p class="eyebrow"><span><b>●</b>&nbsp;&nbsp;${post.kind}</span><span>${post.date} · ${post.read}</span></p>
        <h1 class="display" data-split>${post.title}</h1>
      </header>
      <div class="article-hero" data-img-reveal data-header="bone">
        <img data-parallax="0.15" src="assets/img/${post.image}-1400.webp" srcset="assets/img/${post.image}-800.webp 800w, assets/img/${post.image}-1400.webp 1400w, assets/img/${post.image}-2200.webp 2200w" sizes="100vw" alt="">
      </div>
      <div class="article-body" data-header="bone">
        <a class="article-back" href="index.html#journal"><span aria-hidden="true">←</span> <span class="link-line">Journal</span></a>
        <div>${post.body.map((p) => `<p data-reveal>${p}</p>`).join("")}</div>
      </div>
    </article>
    <section class="more" data-header="bone" aria-labelledby="more-title">
      <hr class="rule" style="margin-bottom:clamp(60px,8vw,110px)">
      <h2 id="more-title" class="display" data-split>Keep reading</h2>
      <div class="posts">
        ${others.map((p) => `
          <a class="post" href="journal.html?id=${p.id}" data-cursor="Read">
            <div class="post__img" data-img-reveal>${img(p.image, "", "(max-width: 820px) 100vw, 50vw")}</div>
            <div class="post__meta"><span>${p.kind}</span><span>${p.read}</span></div>
            <h3>${p.title}</h3>
          </a>`).join("")}
      </div>
    </section>`;
}

boot(null, render);
