/**
 * Small drawn icons for the decision-tree lessons (tennis "play?" example).
 *
 * Drawn as inline SVG rather than emoji so the lessons stay picture-led and
 * consistent with the car/bike vocabulary's hand-drawn feel. Brand-blue only,
 * matching the rest of the Layman course.
 */

const SUN = "#e7a765"; // warm — reuse the brand warm token for the sun
const CLOUD = "#c9d7eb"; // brand-muted
const RAIN = "#6f91c5"; // brand
const INK = "#171713";

/** A bright sun. */
export function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`h-8 w-8 ${className}`} aria-hidden="true">
      <circle cx="24" cy="24" r="9" fill={SUN} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 24 + Math.cos(a) * 13;
        const y1 = 24 + Math.sin(a) * 13;
        const x2 = 24 + Math.cos(a) * 18;
        const y2 = 24 + Math.sin(a) * 18;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SUN} strokeWidth="2.5" strokeLinecap="round" />
        );
      })}
    </svg>
  );
}

/** A grey cloud covering the sun (overcast). */
export function OvercastIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`h-8 w-8 ${className}`} aria-hidden="true">
      <circle cx="18" cy="18" r="7" fill={SUN} opacity="0.5" />
      <path d="M12 32 Q10 22 20 22 Q24 16 32 20 Q42 18 42 28 Q44 36 34 36 L16 36 Q8 36 12 32 Z" fill={CLOUD} stroke={RAIN} strokeWidth="1.5" />
    </svg>
  );
}

/** A rain cloud with drops. */
export function RainIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`h-8 w-8 ${className}`} aria-hidden="true">
      <path d="M12 26 Q10 16 20 16 Q24 10 32 14 Q42 12 42 22 Q44 30 34 30 L16 30 Q8 30 12 26 Z" fill={CLOUD} stroke={RAIN} strokeWidth="1.5" />
      <line x1="18" y1="34" x2="16" y2="40" stroke={RAIN} strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="34" x2="24" y2="40" stroke={RAIN} strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="34" x2="32" y2="40" stroke={RAIN} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** A tennis racket — the "play" outcome. */
export function PlayMark({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-good px-3 py-1.5 text-xs font-bold text-white ${className}`}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="9" cy="9" r="6" />
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`v${i}`} x1={9} y1={3 + i * 2.4} x2={9} y2={3.6 + i * 2.4} opacity="0.5" />
        ))}
        <line x1="13" y1="13" x2="20" y2="20" />
      </svg>
      play
    </div>
  );
}

/** A crossed-out racket — the "no play" outcome. */
export function NoPlayMark({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-bad px-3 py-1.5 text-xs font-bold text-white ${className}`}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
      no play
    </div>
  );
}

/** Map an outlook name to its icon. */
export function OutlookIcon({ outlook, className = "" }: { outlook: "sunny" | "overcast" | "rain"; className?: string }) {
  if (outlook === "sunny") return <SunIcon className={className} />;
  if (outlook === "overcast") return <OvercastIcon className={className} />;
  return <RainIcon className={className} />;
}
