import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering Foundations — Lesson 6: "When RAG Gets It Wrong".
 *
 * Three failure postcards, each with its plain-language fix direction — and
 * the diagnostic question that splits every RAG failure in two: was the right
 * page retrieved? Bad marks each failure once; the fix rows stay neutral.
 * This split is the seed course 2's four-question eval formalizes.
 */
export function WhenRagGoesWrong() {
  return (
    <Infographic>
      <InfographicHeader
        title="Three ways a good answer goes missing"
        subtitle="Before blaming the model, ask the one question that splits every RAG failure."
      />

      {/* Beat 1-3 — the postcards */}
      <Scene caption="① Failure: the wrong page won the ranking">
        <Stagger className="flex flex-col gap-3">
          <MotionChild>
            <Postcard
              failure="Asked about damaged-box refunds; got the wholesale-returns page instead"
              symptom="answer is fluent — and about a different policy"
              fix="the ranking needs help: which pages count as &ldquo;close&rdquo; is course-two work"
            />
          </MotionChild>
          <MotionChild>
            <Postcard
              failure="The page was right — but it was last year's policy, still indexed"
              symptom="answer cites a real page that no longer matches reality"
              fix="the index must track its sources — updates and deletions, not just additions"
              stale
            />
          </MotionChild>
          <MotionChild>
            <Postcard
              failure="The right page sat in the window — and the model answered from memory anyway"
              symptom="the page said 14 days; the answer said 30"
              fix="the answer must be grounded: only what the pages say, or &ldquo;the docs don't say&rdquo;"
            />
          </MotionChild>
        </Stagger>
      </Scene>

      {/* Beat 4 — the diagnostic split */}
      <Scene caption="② The one question that finds the culprit">
        <Reveal>
          <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
            <p className="text-sm font-bold text-ink sm:text-base">
              When the answer is wrong, ask: <span className="text-brand-deep">was the right page in the window?</span>
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
                <div className="text-xs font-bold text-ink">No → retrieval problem</div>
                <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">
                  the search missed — fix the pages, the ranking, or the question-understanding
                </p>
              </div>
              <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
                <div className="text-xs font-bold text-ink">Yes → grounding problem</div>
                <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-ink-soft">
                  the pages were fine — fix how the answer uses them
                </p>
              </div>
            </div>
          </div>
        </Reveal>
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

/** One failure postcard with its fix direction. */
function Postcard({ failure, symptom, fix, stale = false }: { failure: string; symptom: string; fix: string; stale?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[var(--color-bad)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-canvas">
          {stale ? "stale page" : "wrong page"}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">ignored page</span>
      </div>
      <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink">{failure}</p>
      <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-[var(--color-bad)]">{symptom}</p>
      <p className="mt-2 border-t border-dashed border-ash pt-2 text-[10.5px] font-medium leading-relaxed text-ink-soft">
        <span className="font-bold text-ink">Fix direction:</span> {fix}
      </p>
    </div>
  );
}
