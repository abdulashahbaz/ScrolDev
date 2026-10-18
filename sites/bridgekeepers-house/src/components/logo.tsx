/** The Old Bridge's arch over a line of river. */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
      <path d="M3 25h34" />
      <path d="M7 25V21c0-7.5 5.8-13 13-13s13 5.5 13 13v4" />
      <path d="M11.5 25v-3.5c0-4.9 3.8-8.7 8.5-8.7s8.5 3.8 8.5 8.7V25" />
      <path d="M8 31c2.4 0 2.4 1.4 4.8 1.4s2.4-1.4 4.8-1.4 2.4 1.4 4.8 1.4 2.4-1.4 4.8-1.4 2.4 1.4 4.8 1.4" strokeLinecap="round" />
    </svg>
  );
}
