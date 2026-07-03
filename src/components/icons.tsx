/* — small inline icons (simple shapes only) — */
export function ArrowUR({ cls }: { cls?: string }) {
  return (
    <svg className={"arrow " + (cls || "")} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.5M10.5 3.5V9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDown() {
  return (
    <svg width="13" height="20" viewBox="0 0 13 20" fill="none" aria-hidden="true">
      <path d="M6.5 1V18M6.5 18L1.5 13M6.5 18L11.5 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1V9.5M7 9.5L3.2 5.7M7 9.5L10.8 5.7M1.5 12.5H12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M8 6.2L16 11L8 15.8V6.2Z" fill="currentColor" />
    </svg>
  );
}
