import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}

export const queries = {
  tablet: "(min-width: 640px)",
  desktop: "(min-width: 1024px)",
  // A real mouse on a desktop-width screen: the custom cursor and cursor-scrubbed video.
  finePointer: "(hover: hover) and (pointer: fine)",
  customCursor: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
};
