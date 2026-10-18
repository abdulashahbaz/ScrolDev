import { boot, $ } from "./core.js";
import { residences } from "./data.js";

// arriving from the shortlist: name the residences in the message
function prefill() {
  const ids = (new URLSearchParams(location.search).get("about") || "").split(",");
  const names = ids.map((id) => residences.find((r) => r.id === id)?.name).filter(Boolean);
  if (!names.length) return;
  const list = names.length === 1 ? names[0] : names.slice(0, -1).join(", ") + " and " + names.at(-1);
  $("#c-msg").value = `I would like to know more about ${list}.`;
}

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
}, prefill);
