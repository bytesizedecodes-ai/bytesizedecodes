import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, BulletList } from "./primitives";
import { MachineFigure, SpeechBubble, Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Observability — Lesson 8: "Hallucination — when AI makes things up".
 *
 * Beginner calibration: a hallucination is a confident-but-wrong answer that
 * looks identical to a correct one. Scene 1 shows the phenomenon (a wrong fact
 * stated with full confidence). Scene 2 explains why — the AI predicts what
 * sounds plausible rather than looking up what’s true. Scene 3 shows how
 * observability (logs + evaluation) catches a confident lie. Red is the single
 * semantic accent marking the falsehood; brand marks the AI itself.
 */
export function HallucinationMakesThingsUp() {
  return (
    <Infographic>
      <InfographicHeader
        title="Hallucination: confident, but wrong"
        subtitle="A wrong answer that looks exactly like a right one"
      />

      {/* ① The phenomenon */}
      <Scene caption="① It states a false fact with total confidence">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
          <MachineFigure label="AI" />
          <div className="flex flex-col items-center gap-2">
            <SpeechBubble side="left">“The capital of Australia is Sydney.”</SpeechBubble>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-bad)] bg-[var(--color-bad-wash)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-bad)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-bad)]" />
              false — it’s Canberra
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Nothing in the wording warns you. A hallucination reads just like a fact.
        </p>
      </Scene>

      {/* ② Why it happens */}
      <Scene caption="② It guesses what sounds right — it doesn’t look up what’s true">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <div className="flex flex-col items-center gap-2 opacity-60">
            <DatabaseIcon struck />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              not a database
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MachineFigure label="AI" />
            <span className="rounded-full bg-brand-wash px-2.5 py-0.5 text-[11px] font-semibold text-brand">
              predicts plausible words
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          It learned which words tend to follow others. Sometimes the most
          plausible-sounding line simply isn’t true.
        </p>
      </Scene>

      {/* ③ How observability catches it */}
      <Scene caption="③ How you catch a confident lie">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MotionChild>
            <CatchCard title="Logs" body="Re-read the answer later and check it against the truth." />
          </MotionChild>
          <MotionChild>
            <CatchCard title="Evaluation" body="A rubric asks ‘is this correct?’ — and flags the lie." />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          A confident answer isn’t a checked answer. Observability is what checks.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          A hallucination is a wrong answer said with confidence — invisible
          without logs and evaluation checking it against the truth.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function DatabaseIcon({ struck = false }: { struck?: boolean }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 48 48" className="h-12 w-12 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="24" cy="12" rx="14" ry="5" />
        <path d="M10 12 V24 Q10 29 24 29 Q38 29 38 24 V12" />
        <path d="M10 24 V36 Q10 41 24 41 Q38 41 38 36 V24" />
      </svg>
      {struck && (
        <svg viewBox="0 0 48 48" className="absolute inset-0 h-12 w-12 text-[var(--color-bad)]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <line x1="6" y1="6" x2="42" y2="42" />
        </svg>
      )}
    </div>
  );
}

function CatchCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex h-full flex-col gap-1.5 rounded-xl border border-ash bg-surface-elevated px-4 py-3">
      <CardTitle icon="✦">{title}</CardTitle>
      <BulletList items={[body]} />
    </div>
  );
}
