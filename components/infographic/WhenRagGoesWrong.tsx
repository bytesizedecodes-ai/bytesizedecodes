import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene, StoryMap, MachineFigure } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * RAG Engineering Foundations — Lesson 6: "When RAG Gets It Wrong"
 * (v2 Thread retrofit)
 *
 * Through-line stage: ZapKart's assistant at its desk. One concrete wrong
 * answer (30 days; the page said 14) opens the story; the receipt lands
 * BESIDE the dimmed assistant and the struck-through wrong answer (the
 * "before" ghosts on); the third scene generalizes into the three suspects —
 * each postcard badged with exactly one of wrong / stale / ignored, the other
 * badges dimmed; the reveal is the diagnostic split. Bad marks the failure
 * once per card; fixes stay neutral.
 */
export function WhenRagGoesWrong() {
  return (
    <Infographic>
      <InfographicHeader
        title="Three ways a good answer goes missing"
        subtitle="Before blaming the model, ask the one question that splits every RAG failure."
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">😬</span>, label: "A wrong answer" },
          { icon: <span aria-hidden="true">🧾</span>, label: "Check the receipt" },
          { icon: <span aria-hidden="true">🔍</span>, label: "Three suspects" },
          { icon: <span aria-hidden="true">🎯</span>, label: "Retrieval or grounding" },
        ]}
      />

      {/* Hook — the wrong answer on the desk */}
      <Scene caption="So a ZapKart answer comes back wrong — fluent, confident, wrong.">
        <div className="flex flex-col items-center gap-3">
          <MachineFigure label="ZapKart's assistant" />
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated px-4 py-3 text-center shadow-sm">
            <p className="text-sm font-semibold text-ink">
              &ldquo;Refunds take up to 30 days.&rdquo;
            </p>
            <p className="mt-1 text-[11px] font-medium text-[var(--color-bad)]">
              the team reaches for the model&apos;s settings — but hold on
            </p>
          </div>
        </div>
      </Scene>

      {/* Tension — the receipt lands beside the dimmed desk; the wrong answer ghosts */}
      <Scene variant="continue" caption="But before blaming the model, check the receipt — which page actually arrived?">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <div className="flex flex-col items-center gap-1.5 opacity-60">
            <MachineFigure label="still at its desk" />
            <span className="rounded-lg border border-dashed border-ash bg-canvas px-2.5 py-1 text-[11px] font-bold text-ink-faint line-through decoration-dotted">
              &ldquo;…up to 30 days&rdquo;
            </span>
          </div>
          <div className="max-w-md rounded-xl border border-brand bg-brand-wash px-4 py-3 text-center shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
              retrieved for this question
            </div>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
              <span className="rounded-full border border-brand bg-surface-elevated px-2.5 py-1 font-mono text-[10px] font-bold text-ink">
                policy-refunds p2
              </span>
              <span className="rounded-full border border-ash bg-surface-elevated px-2.5 py-1 font-mono text-[10px] font-bold text-ink">
                faq-returns p1
              </span>
            </div>
            <p className="mt-2 text-[11px] font-medium leading-relaxed text-ink">
              the page says <span className="font-bold">14 days</span> — the right page was in
              the window all along. So the model is not the first suspect.
            </p>
          </div>
        </div>
      </Scene>

      {/* Generalize — the three suspects, one badge each */}
      <Scene variant="continue" caption="Then open the receipt on any bad answer — one of three suspects appears.">
        <Stagger className="flex flex-col gap-3">
          <MotionChild>
            <Postcard
              kind="wrong"
              failure="The receipt shows the wholesale-returns page won the ranking — the answer is about a different policy, fluently"
              fix="the ranking needs help: which pages count as &ldquo;close&rdquo; is course-two work"
            />
          </MotionChild>
          <MotionChild>
            <Postcard
              kind="stale"
              failure="The receipt shows the right page — but it was last year's policy, still indexed after the source changed"
              fix="the index must track its sources — updates and deletions, not just additions"
            />
          </MotionChild>
          <MotionChild>
            <Postcard
              kind="ignored"
              failure="The receipt shows the right, current page — and the model answered from memory anyway: the page said 14, the answer said 30"
              fix="the answer must be grounded: only what the pages say, or &ldquo;the docs don't say&rdquo;"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Reveal — the split */}
      <Scene variant="continue" caption="That's why one question splits every failure — was the right page in the window?">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-bold text-ink sm:text-base">
            When the answer is wrong, ask: <span className="text-brand-deep">was the right page in the window?</span>
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <div className="text-xs font-bold text-ink">No → retrieval problem</div>
              <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">
                the search missed — the fix lives in the index, not in the model
              </p>
            </div>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <div className="text-xs font-bold text-ink">Yes → grounding problem</div>
              <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">
                the pages were fine — change how the answer must use them
              </p>
            </div>
          </div>
          <p className="mt-2 text-[10.5px] font-medium text-ink-soft">
            an old version of the right page → the stale-index suspect, third card above
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          A RAG system fails in one of two places: the wrong pages retrieved, or the right
          pages ignored. Diagnose which before touching anything.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

const SUSPECTS = { wrong: "wrong page", stale: "stale page", ignored: "ignored page" } as const;
type Suspect = keyof typeof SUSPECTS;

/** One suspect postcard: exactly one badge lit, the other two dimmed. */
function Postcard({ kind, failure, fix }: { kind: Suspect; failure: string; fix: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        {(Object.keys(SUSPECTS) as Suspect[]).map((s) =>
          s === kind ? (
            <span
              key={s}
              className="rounded-full bg-[var(--color-bad)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-canvas"
            >
              {SUSPECTS[s]}
            </span>
          ) : (
            <span
              key={s}
              className="rounded-full border border-dashed border-ash px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-faint"
            >
              {SUSPECTS[s]}
            </span>
          ),
        )}
      </div>
      <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink">{failure}</p>
      <p className="mt-2 border-t border-dashed border-ash pt-2 text-[10.5px] font-medium leading-relaxed text-ink-soft">
        <span className="font-bold text-ink">Fix direction:</span> {fix}
      </p>
    </div>
  );
}
