const PATHS = {
  fort: "M3 20h18M5 20V10h14v10M8 10V6h8v4M13 6V3h3v3M8 14h2M14 14h2M11 20v-3h2v3",
  tower: "M4 20h16M8 20V9l4-5 4 5v11M11 13h2M10.5 20v-3h3v3",
  sunrise: "M2 18h20M6.5 18a5.5 5.5 0 0 1 11 0M12 5V2M4.9 10.9 3.5 9.5M19.1 10.9l1.4-1.4M5 21h14",
  wave: "M2 8.5c2.5-2.5 4.5-2.5 6.7 0s4.5 2.5 6.6 0 4.2-2.5 6.7 0M2 13.5c2.5-2.5 4.5-2.5 6.7 0s4.5 2.5 6.6 0 4.2-2.5 6.7 0M2 18.5c2.5-2.5 4.5-2.5 6.7 0s4.5 2.5 6.6 0 4.2-2.5 6.7 0",
  bridge: "M2 7c4.5 6.5 15.5 6.5 20 0M2 12.5c4.5 5.5 15.5 5.5 20 0M5.5 9.6v5.4M9 11.4v5M12 12v5M15 11.4v5M18.5 9.6v5.4",
  spires: "M2 20 6.5 9l2 5L12 3l3 10 2-4.5L22 20H2Z",
  lake: "M3 16c3-2.5 6 2.5 9 0s6 2.5 9 0M4 12l4-6 3 4 2-2.5 4 4.5",
  road: "M7.5 21 11 3M16.5 21 13 3M12 7v1.5M12 11.5V13M12 16.5V18",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 6l-6 6 6 6",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 24, strokeWidth = 1.6, className }: { name: IconName; size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
