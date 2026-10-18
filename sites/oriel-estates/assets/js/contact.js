import { boot, $ } from "./core.js";

boot(() => {
  const range = $("[data-budget]");
  const out = $("[data-budget-out]");
  const update = () => {
    const v = Number(range.value);
    out.textContent = v >= Number(range.max) ? `$${v}M+` : `$${v}M`;
    range.style.setProperty("--fill", ((v - range.min) / (range.max - range.min)) * 100 + "%");
  };
  range.addEventListener("input", update);
  update();
});
