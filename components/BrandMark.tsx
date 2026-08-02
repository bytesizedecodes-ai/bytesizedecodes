/**
 * BSD brand mark — the three initials rendered as a tight, bold monogram in
 * the dark rounded square. Used in the header (`Shell`) and onboarding, and
 * echoed by `app/icon.tsx` for the favicon.
 *
 * `withAccent` toggles the warm dot (only the header has it historically).
 */
export function BrandMark({ withAccent = false }: { withAccent?: boolean }) {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-ink">
      <span
        aria-hidden
        className="select-none text-[11px] font-bold leading-none tracking-[-0.06em] text-canvas"
      >
        BSD
      </span>
      {withAccent ? (
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-warm" />
      ) : null}
    </span>
  );
}
