"use client";

import { useState } from "react";
import type { ByteQuestion } from "@/content";

/** Pre-visual “guess first” check — local only, does not write progress. */
export function PredictionCard({ question }: { question: ByteQuestion }) {
  const [picked, setPicked] = useState<string | null>(null);
  const revealed = picked !== null;
  const correct = picked === question.answer;

  return (
    <section className="rounded-2xl border border-brand-muted bg-brand-wash/60 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-deep">
        Predict before you look
      </p>
      <p className="mt-2 text-sm font-medium text-ink">{question.prompt}</p>
      <ul className="mt-4 space-y-2">
        {question.choices.map((choice) => {
          const selected = picked === choice.id;
          let tone = "border-ash bg-white hover:border-brand-muted";
          if (revealed && choice.id === question.answer) {
            tone = "border-good bg-good-wash";
          } else if (revealed && selected && !correct) {
            tone = "border-bad bg-bad-wash";
          } else if (selected) {
            tone = "border-brand bg-white";
          }
          return (
            <li key={choice.id}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => setPicked(choice.id)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm text-ink ${tone}`}
              >
                {choice.label}
              </button>
            </li>
          );
        })}
      </ul>
      {revealed && (
        <p className="mt-3 text-sm text-ink-soft" role="status">
          {correct ? "Nice — that matches the idea ahead." : "Not quite — "}
          {question.explanation}
        </p>
      )}
    </section>
  );
}
