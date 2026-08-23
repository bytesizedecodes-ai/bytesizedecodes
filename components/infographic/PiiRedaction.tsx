import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security in Practice — Lesson 4: "PII redaction".
 * Case artifact: the redaction pass between ticket and everything downstream
 * — model, logs, analytics. Mask at the boundary, keep a re-identification
 * map under lock.
 */
export function PiiRedaction() {
  return (
    <Infographic>
      <InfographicHeader
        title="PII redaction"
        subtitle="PaisaShield's mask pass — scrub at the boundary, not at the end"
      />

      {/* SCENE 1 — the raw ticket */}
      <Scene caption="① Scenario: real tickets look like this">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <p className="rounded-lg bg-ash px-3 py-2 font-mono text-[11px] leading-relaxed text-ink">
            “Card 4539 8832 1104 9951 was charged twice! Aadhaar 2341 8890 4412. Call me 98••••••••.
            Order 8814. Please refund to my other account.”
          </p>
          <p className="mt-2 text-xs font-medium text-ink">
            Three PII classes on line one — and every downstream system (model, logs, vendor analytics)
            just inherited them.
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — the mask pass */}
      <Scene caption="② The pass: detect → mask → map">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🔍</span>
              <p className="mt-1 text-[11px] font-bold text-ink">Detect</p>
              <p className="text-[10px] font-medium text-ink-soft">pattern + checksum classes: cards, IDs, phones</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🎭</span>
              <p className="mt-1 text-[11px] font-bold text-ink">Mask</p>
              <p className="text-[10px] font-medium text-ink-soft">replace with stable tokens: [CARD_1], [AADHAAR_1]</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🗺️</span>
              <p className="mt-1 text-[11px] font-bold text-ink">Map (locked)</p>
              <p className="text-[10px] font-medium text-ink-soft">token → original lives in one vault, few readers</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 3 — after the pass */}
      <Scene caption="③ What the model — and the logs — actually see">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <p className="rounded-lg bg-ash px-3 py-2 font-mono text-[11px] leading-relaxed text-ink">
            “Card [CARD_1] was charged twice! Aadhaar [AADHAAR_1]. Call me [PHONE_1]. Order 8814. Please refund to
            my other account.”
          </p>
          <p className="mt-2 text-xs font-medium text-ink">
            Same task, same answer quality — the refund flow never needed the digits, only{" "}
            <span className="font-bold">which card</span>. Stable tokens keep sentences coherent for the model.
          </p>
        </div>
      </Scene>

      {/* SCENE 4 — the boundary rule */}
      <Scene caption="④ The two rules that survive review">
        <div className="mx-auto max-w-md space-y-2">
          <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
            <p className="text-xs font-semibold text-ink">
              Rule 1: mask at the <span className="font-bold">entry boundary</span> — redacting logs later means
              every intermediate copy already leaked.
            </p>
          </div>
          <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
            <p className="text-xs font-semibold text-ink">
              Rule 2: patterns miss <span className="font-bold">names and free-text</span> — pair the pattern pass
              with a detector model for prose PII, and audit samples weekly.
            </p>
          </div>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Scrub at the boundary with{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">stable tokens under a locked map</span> —
          everything downstream stays clean by construction.
        </p>
      </Card>
    </Infographic>
  );
}
