(() => {
const { boot, $, dragScroll } = window.Oriel;

boot(() => {
  dragScroll($("[data-drag]"));
});
})();
