import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security at Scale — Lesson 4: "Secure-by-design reviews".
 * Case evidence: Setu's design-review gate — the threat-model delta as a
 * required section of every design doc.
 */
export function SecureByDesignReviews() {
  return (
    <Infographic>
      <InfographicHeader
        title="Secure-by-design reviews"
        subtitle="The threat-model delta as a required design-doc section — reviews that age well"
      />

      {/* SCENE 1 — problem: security review as late gate */}
      <Scene caption="① The failure mode: security as the last checklist">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="space-y-1.5 text-[11px] font-medium text-ink">
            <p>• feature built for a quarter → security review in week 12 → findings arrive as rework</p>
            <p>• the review asks “is this secure?” — unfalsifiable, so it performs confidence</p>
            <p>• the threat model from launch is 9 months stale and nobody re-reads it</p>
          </div>
          <p className="mt-2 text-xs font-semibold text-ink">
            Late gates buy <span className="font-bold">ceremony</span>; the cheap place to move security is the design doc.
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — the delta section */}
      <Scene caption="② The design: the delta section, five questions">
        <div className="mx-auto max-w-lg space-y-1.5">
          {[
            ["new doors?", "every new input, action, data path this change creates"],
            ["widened doors?", "existing paths whose blast radius grows (new tool, new audience)"],
            ["which ranked rows move?", "the threat-model rows this delta reorders — with new ranks"],
            ["which layers cover them?", "the specific existing layers, and the gaps"],
            ["what's accepted?", "residual risk with owner + revisit date, written here, not discovered at incident time"],
          ].map(([q, a]) => (
            <MotionChild key={q}>
              <div className="flex flex-col gap-0.5 rounded-xl border border-ash bg-surface-elevated px-3 py-2 shadow-sm sm:flex-row sm:items-center sm:gap-3">
                <span className="w-36 shrink-0 rounded-full bg-brand-wash px-2 py-0.5 text-[10px] font-bold text-ink">{q}</span>
                <span className="flex-1 text-[11px] font-medium text-ink">{a}</span>
              </div>
            </MotionChild>
          ))}
        </div>
      </Scene>

      {/* SCENE 3 — the review meeting itself */}
      <Scene caption="③ What the reviewer actually does">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🔍</span>
              <p className="mt-1 text-[10px] font-semibold text-ink">Attack the delta — walk the new doors as an adversary would</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">📐</span>
              <p className="mt-1 text-[10px] font-semibold text-ink">Check layer fit — does an existing layer cover it, or is a new one earned?</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">✍️</span>
              <p className="mt-1 text-[10px] font-semibold text-ink">Sign the register — accepted risks get owners and dates, in the doc</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 4 — boundary */}
      <Scene caption="④ Boundary: reviews rot without a trigger">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            The gate lives or dies by its <span className="font-bold">trigger</span>: review fires on every design doc
            that changes an input, action, or data path — enforced by the template, not by memory. Miss the trigger and
            the whole apparatus is a well-organized archive of stale deltas.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Security review = the{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">threat-model delta</span>,
          five questions, signed in the design doc — before code, not after.
        </p>
      </Card>
    </Infographic>
  );
}
