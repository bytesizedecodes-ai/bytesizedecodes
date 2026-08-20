import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, Tag } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * RAG Engineering Foundations — Lesson 2: "Why Not Just Paste Everything?"
 *
 * The backpack anchor: hauling the whole library versus taking the one book
 * you need. The compare grid (reveals as one block — it's a grid, not a
 * sequence) makes the four costs visible: space, cost, speed, and the
 * skipped-middle failure. Bad marks the stuffed backpack once. Beginner
 * density; no numbers beyond "every word costs".
 */
export function WhyNotPasteEverything() {
  return (
    <Infographic>
      <InfographicHeader
        title="Why not carry the whole library?"
        subtitle="The obvious fix — paste in every document — works until you count what it costs."
      />

      {/* Scene 1 — the two travelers */}
      <Scene caption="① Two ways to be prepared for any question">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 text-center shadow-sm">
              <div className="text-4xl" aria-hidden="true">🎒</div>
              <div className="mt-1 text-sm font-bold text-ink">The whole library</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                every document you own, pasted into every single request — just in case
              </p>
              <ul className="mt-2 space-y-1 text-left">
                <CostRow bad>the window runs out of room</CostRow>
                <CostRow bad>every word costs, on every request</CostRow>
                <CostRow bad>slow — and the model skips the middle of the pile</CostRow>
              </ul>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 text-center shadow-sm">
              <div className="text-4xl" aria-hidden="true">📖</div>
              <div className="mt-1 text-sm font-bold text-ink">The one right book</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                fetch the few pages this question needs — then answer from them
              </p>
              <ul className="mt-2 space-y-1 text-left">
                <CostRow good>fits the window with room to spare</CostRow>
                <CostRow good>a few pages cost a few pennies</CostRow>
                <CostRow good>fast — and nothing important hides mid-pile</CostRow>
              </ul>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 2 — the skipped middle, felt */}
      <Scene caption="② Even when it all fits, big piles get skimmed">
        <Reveal>
          <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm">
            <Tag tone="neutral">the pile of pages</Tag>
            <div className="mt-3 space-y-1">
              <PileRow label="page 1" attention="high" />
              <PileRow label="pages 2–38" attention="low" note="skimmed — attention fades in the middle" />
              <PileRow label="page 39" attention="high" />
            </div>
            <p className="mt-3 text-center text-[11px] font-medium leading-relaxed text-ink-soft">
              buried your refund policy at page 20? models read the ends far better than the
              middle — <span className="font-bold text-ink">the right page, near the top, beats every page at once</span>.
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — fade to the rule */}
      <Scene caption="③ The trade in one line">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            Retrieval is how a small window behaves like a big one: you don&apos;t pay for the
            library — <span className="font-bold">just for the pages you actually open</span>.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Pasting everything spends window space, money, and speed on pages the question
          never needed. Retrieval buys the few that matter.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One cost row in the backpack comparison. */
function CostRow({ bad = false, good = false, children }: { bad?: boolean; good?: boolean; children: React.ReactNode }) {
  const mark = bad ? "text-[var(--color-bad)]" : good ? "text-good" : "text-ink";
  return (
    <li className={`flex items-start gap-2 text-[11px] font-medium leading-relaxed text-ink ${mark}`}>
      <span aria-hidden="true" className={mark}>{bad ? "✗" : "✓"}</span>
      {children}
    </li>
  );
}

/** One row of the page pile with its attention level. */
function PileRow({ label, attention, note }: { label: string; attention: "high" | "low"; note?: string }) {
  const isHigh = attention === "high";
  return (
    <div
      className={`rounded-lg border px-3 py-1.5 ${
        isHigh ? "border-brand bg-brand-wash" : "border-dashed border-ash bg-canvas"
      }`}
    >
      <span className={`text-[11px] font-bold ${isHigh ? "text-brand-deep" : "text-ink-faint"}`}>
        {label}
      </span>
      {note && <span className="ml-2 text-[10px] font-medium text-ink-faint">{note}</span>}
    </div>
  );
}
