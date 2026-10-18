import { useId } from "react";

// A unique id that is safe inside SVG url(#...) references.
export function useSvgId(prefix = "s") {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}
