import type { ReactNode } from "react";

export type BadgeTone = "brand" | "warm" | "neutral" | "good";

export function Badge({
  children,
  tone = "brand",
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-wash text-brand-deep",
    warm: "bg-warm-wash text-warm",
    neutral: "bg-ash/70 text-ink-soft",
    good: "bg-good-wash text-good",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
