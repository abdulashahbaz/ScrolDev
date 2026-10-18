import { boot, $, dragScroll } from "./core.js";

boot(() => {
  dragScroll($("[data-drag]"));
});
