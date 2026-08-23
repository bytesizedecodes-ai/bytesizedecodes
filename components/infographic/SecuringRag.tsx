import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security in Practice — Lesson 5: "Securing RAG".
 * Case artifact: the policy wiki's intake gate + per-reader pass — provenance
 * on the shelf, permissions at retrieval time.
 */
export function SecuringRag() {
  return (
    <Infographic>
      <InfographicHeader
        title="Securing RAG"
        subtitle="PaisaShield's policy wiki — check who shelved each page, check who's reading"
      />

      {/* SCENE 1 — the wiki and the two failure families */}
      <Scene caption="① The case's retrieval layer — and its two failure families">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-2">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
              <p className="text-xs font-bold text-ink">Wrong pages</p>
              <p className="mt-1 text-[10px] font-medium text-ink-soft">
                a vendor “helpfully” uploads a refund page with a hidden instruction — every retrieval that touches it
                serves the attacker&apos;s words
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
              <p className="text-xs font-bold text-ink">Right pages, wrong reader</p>
              <p className="mt-1 text-[10px] font-medium text-ink-soft">
                a support agent asks a routine question; retrieval happily quotes the settlements playbook marked
                “finance only”
              </p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Corruption at <span className="font-bold">ingestion</span>, leakage at <span className="font-bold">retrieval</span> —
          two different locks.
        </p>
      </Scene>

      {/* SCENE 2 — intake gate */}
      <Scene caption="② Lock one: the intake gate (provenance + inspection)">
        <div className="mx-auto max-w-lg space-y-2">
          {[
            ["who shelved this?", "named author or trusted pipeline only — no anonymous uploads"],
            ["what's inside?", "content inspection for instruction-like lines before indexing"],
            ["did it change?", "diffs on every edit — silent edits are the classic poisoning move"],
          ].map(([q, a]) => (
            <div key={q} className="flex items-start gap-3 rounded-xl border border-ash bg-surface-elevated px-3 py-2 shadow-sm">
              <span className="rounded-full bg-brand-wash px-2 py-0.5 text-[10px] font-bold text-ink">{q}</span>
              <span className="flex-1 text-[11px] font-medium text-ink">{a}</span>
            </div>
          ))}
        </div>
      </Scene>

      {/* SCENE 3 — retrieval-time ACL */}
      <Scene caption="③ Lock two: the reader's pass checked at retrieval, not indexing">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2 rounded-full bg-ash px-3 py-1.5">
              <span className="text-sm">🪪</span>
              <p className="text-[11px] font-bold text-ink">query ticket: role = support · customer = C-8814</p>
            </div>
            <span className="text-lg">↓</span>
            <p className="text-[11px] font-semibold text-ink">
              Filter the shelf <span className="font-bold">before</span> ranking: public ✓ · support ✓ · finance-only ✗ ·
              C-8814-only ✓
            </p>
            <p className="text-[10px] font-medium text-ink-soft">
              The filter runs pre-retrieval on the index — not as a post-filter the model can be talked around.
            </p>
          </div>
        </div>
      </Scene>

      {/* SCENE 4 — the boundary rule */}
      <Scene caption="④ The rule that fails in the wild">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Retrieved pages are <span className="font-bold">data, not staff</span>: treat every snippet as untrusted
            input — the injection lesson, now arriving from your own wiki.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            A poisoned page is just prompt injection with a shelf number. Same defenses, layered again.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Provenance at <span className="underline decoration-brand-deep decoration-2 underline-offset-2">intake</span>,
          permissions at{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">retrieval</span> — and every
          retrieved page treated as data, never staff.
        </p>
      </Card>
    </Infographic>
  );
}
