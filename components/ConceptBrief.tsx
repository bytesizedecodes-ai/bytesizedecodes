import { Inline } from "@/components/Inline";
import type { ConceptBrief as ConceptBriefData } from "@/content/courses";

/**
 * The anchor-led explanation that opens a lesson (v6 authoring contract):
 * Anchor (everyday metaphor) / What / Why / Where / When NOT. Sharp,
 * scannable, explanation-first — the learner meets the idea here, as
 * something they already touch, before any quiz or interactive check.
 * Text supports **bold** and `code` via the shared Inline formatter.
 */
function BriefRow({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "brand" | "gold" | "anchor";
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide sm:w-20 sm:text-center ${
          tone === "brand"
            ? "bg-brand-wash text-brand-deep"
            : tone === "gold"
              ? "bg-gold/20 text-ink-soft"
              : "bg-ink text-canvas"
        }`}
      >
        {label}
      </span>
      <div
        className={`min-w-0 leading-relaxed sm:text-[15px] ${
          tone === "anchor"
            ? "text-[15px] font-medium text-ink italic"
            : "text-[14px] text-ink-soft"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function ConceptBrief({ brief }: { brief: ConceptBriefData }) {
  return (
    <section
      aria-label="Concept brief"
      className="rounded-2xl border border-ash bg-surface-elevated px-5 py-5 shadow-sm sm:px-6"
    >
      <div className="space-y-4">
        <BriefRow label="Anchor" tone="anchor">
          <Inline text={brief.anchor} />
        </BriefRow>
        <BriefRow label="What" tone="brand">
          <Inline text={brief.what} />
        </BriefRow>
        <BriefRow label="Why" tone="brand">
          <Inline text={brief.why} />
        </BriefRow>
        <BriefRow label="Where" tone="brand">
          <ul className="space-y-1">
            {brief.where.map((item) => (
              <li key={item} className="relative pl-5">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.15em] text-xs text-ink"
                >
                  ✦
                </span>
                <Inline text={item} />
              </li>
            ))}
          </ul>
        </BriefRow>
        <BriefRow label="When not" tone="gold">
          <Inline text={brief.whenNot} />
        </BriefRow>
      </div>
    </section>
  );
}
