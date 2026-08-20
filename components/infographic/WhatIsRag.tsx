import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene, PersonFigure, MachineFigure, SpeechBubble } from "./scenes";
import { Reveal } from "./motion";

/**
 * RAG Engineering Foundations — Lesson 1: "What is RAG?"
 *
 * The open-book-exam anchor: closed-book, the model answers from memory
 * (confident, dated, no sources); open-book, the same model gets the right
 * page handed to it before answering — Retrieval + Augmented + Generation,
 * decomposed as the scene's reveal. This anchor carries the whole course.
 * Beginner density, one accent (brand), bad marks the confident guess once.
 */
export function WhatIsRag() {
  return (
    <Infographic>
      <InfographicHeader
        title="The closed-book and the open-book assistant"
        subtitle="Same brilliant student. One exam lets notes in — and it changes everything."
      />

      {/* Scene 1 — closed book: guessing from memory */}
      <Scene caption="① Closed book: answer from memory only">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <PersonFigure label="Customer" />
          <SpeechBubble side="right" className="max-w-[15rem] text-center">
            What&apos;s your refund policy?
          </SpeechBubble>
          <MachineFigure confused label="Model, from memory" />
        </div>
        <div className="mx-auto mt-4 max-w-md rounded-xl border border-[var(--color-bad)] bg-surface-elevated px-4 py-3 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            &ldquo;Refunds are available within 30 days… I think…&rdquo;
          </p>
          <p className="mt-1 text-[11px] font-medium text-[var(--color-bad)]">
            confident — and mixed up with some other company&apos;s policy it read once
          </p>
        </div>
      </Scene>

      {/* Scene 2 — open book: the page arrives first */}
      <Scene caption="② Open book: hand it the right page first">
        <Reveal>
          <div className="mx-auto max-w-lg rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center shadow-sm">
            <div className="flex items-center justify-center gap-3">
              <span className="rounded-full border border-brand bg-surface-elevated px-3 py-1 text-[11px] font-bold text-brand-deep">
                📄 policy-refunds.md · page 2
              </span>
              <span aria-hidden="true" className="text-ink-soft">→</span>
              <MachineFigure label="Same model" />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">
              &ldquo;Full refunds within 14 days of delivery; store credit up to 30 days —
              from your refund policy, section 2.&rdquo;
            </p>
            <p className="mt-1 text-[11px] font-medium text-ink-soft">
              exact, current, and traceable to a real page
            </p>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — the name, decomposed */}
      <Scene caption="③ What the letters actually say">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <LetterCard letter="R" word="Retrieval" note="find the right page for this question" />
            <LetterCard letter="A" word="Augmented" note="put that page in front of the model" accent />
            <LetterCard letter="G" word="Generation" note="answer from the page — and say which one" />
          </div>
        </Reveal>
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
