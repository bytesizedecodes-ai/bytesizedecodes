import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene, StoryMap, PersonFigure, MachineFigure, SpeechBubble } from "./scenes";

/**
 * RAG Engineering Foundations — Lesson 1: "What is RAG?" (v2 Thread retrofit)
 *
 * Through-line stage: ZapKart's assistant at center, Ravi's question held
 * above it all lesson — the only thing that changes is WHERE the assistant
 * answers from (memory, ghosted, vs the handed-in page, accented). Beats:
 * hook (Ravi asks) → tension (memory guess, bad) → reveal (the page arrives,
 * memory stays as a ghost) → resolution + fade (R-A-G names what happened).
 * Course cast introduced here: ZapKart the store, Ravi the customer, and the
 * doc set (policy-refunds.md and friends) that every lesson reuses.
 */
export function WhatIsRag() {
  return (
    <Infographic>
      <InfographicHeader
        title="The closed-book and the open-book assistant"
        subtitle="Same assistant, same question — the only change is the page in front of it."
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🛒</span>, label: "Ravi asks ZapKart" },
          { icon: <span aria-hidden="true">🤖</span>, label: "It guesses" },
          { icon: <span aria-hidden="true">📄</span>, label: "Hand it the page" },
          { icon: <span aria-hidden="true">🔤</span>, label: "Name the trick: R-A-G" },
        ]}
      />

      {/* Hook — the stage and the cast, one question in the air */}
      <Scene caption="So Ravi asks ZapKart's assistant: what's the refund policy?">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <PersonFigure label="Ravi" />
          <SpeechBubble side="right" className="max-w-[15rem] text-center">
            What&apos;s your refund policy?
          </SpeechBubble>
          <MachineFigure label="ZapKart's assistant" />
        </div>
      </Scene>

      {/* Tension — answering from memory, the guess card is the ONE change */}
      <Scene variant="continue" caption="But from memory alone, it guesses — fluently.">
        <div className="mx-auto max-w-md">
          <p className="mb-2 text-center text-[11px] font-semibold text-ink-faint">
            💬 &ldquo;What&apos;s your refund policy?&rdquo; — Ravi, still waiting
          </p>
          <div className="mb-2 flex justify-center">
            <MachineFigure label="answering from memory" />
          </div>
          <div className="rounded-xl border border-[var(--color-bad)] bg-surface-elevated px-4 py-3 text-center shadow-sm">
            <p className="text-sm font-semibold text-ink">
              &ldquo;Refunds are available within 30 days… I think…&rdquo;
            </p>
            <p className="mt-1 text-[11px] font-medium text-[var(--color-bad)]">
              confident — and mixed up with another store&apos;s policy it once read
            </p>
          </div>
        </div>
      </Scene>

      {/* Reveal — the page arrives; memory stays visible as a ghost */}
      <Scene variant="continue" caption="Then hand the same assistant the right page first — and it answers with a source.">
        <div className="mx-auto max-w-lg rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center shadow-sm">
          <p className="mb-2 text-[11px] font-semibold text-ink-faint">
            💬 &ldquo;What&apos;s your refund policy?&rdquo; — Ravi, still waiting
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-dashed border-ash bg-canvas px-3 py-1 text-[11px] font-bold text-ink-faint line-through">
              memory
            </span>
            <span aria-hidden="true" className="text-ink-soft">→</span>
            <span className="rounded-full border border-brand bg-surface-elevated px-3 py-1 text-[11px] font-bold text-brand-deep">
              📄 policy-refunds.md · page 2
            </span>
            <span aria-hidden="true" className="text-ink-soft">→</span>
            <MachineFigure label="Same assistant" />
          </div>
          <p className="mt-3 text-sm font-semibold text-ink">
            &ldquo;Full refunds within 14 days of delivery; store credit up to 30 days —
            from your refund policy, section 2.&rdquo;
          </p>
          <p className="mt-1 text-[11px] font-medium text-ink-soft">
            exact, current, and traceable to a real page
          </p>
        </div>
      </Scene>

      {/* Resolution + fade — the letters name what just happened */}
      <Scene caption="That's why the name says Retrieve, Augment, Generate.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <LetterCard letter="R" word="Retrieval" note="find the right page for this question — like the page that just arrived" />
          <LetterCard letter="A" word="Augmented" note="put that page in front of the model before it answers" accent />
          <LetterCard letter="G" word="Generation" note="answer from the page — and say which one" />
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          RAG is an open-book setup: retrieve the right page, put it in front of the model,
          and the same model answers from evidence instead of memory.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One letter of R-A-G. */
function LetterCard({
  letter,
  word,
  note,
  accent = false,
}: {
  letter: string;
  word: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <span className="text-2xl font-bold text-brand" aria-hidden="true">{letter}</span>
      <div className="text-sm font-bold text-ink">{word}</div>
      <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
