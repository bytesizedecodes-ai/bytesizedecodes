"use client";

import { useEffect, useState } from "react";
import { CodeCell } from "@/components/CodeCell";
import { RewardBanner } from "@/components/RewardBanner";
import type { ByteQuestion, CodeExercise } from "@/content";
import {
  useByteProgress,
  useCompleteByte,
  useStartByte,
  useSubmitAttempt,
  useToday,
} from "@/lib/data/provider";
import type { AttemptResult } from "@/lib/data/types";
import type { DayKey } from "@/lib/day";

/**
 * The interactive "byte" body: MCQ self-check questions, an optional runnable
 * code cell, and the mark-complete → XP reward flow.
 *
 * Extracted from `app/bytes/[slug]/ByteRunner.tsx` so the same machinery serves
 * both `/bytes/[slug]` and course lessons at `/courses/[course]/[lesson]`.
 * Behaviour is identical to the original ByteRunner.
 *
 * Two keys are used because the data layer uses them for different things:
 *  - `progressSlug` keys the byte progress row (`start`/`complete`/`progress`).
 *    Bytes pass the raw slug; course lessons pass `course:${course}:${lesson}`.
 *  - `attemptPrefix` prefixes each question's attempt itemKey (`${prefix}:${qid}`).
 *    Bytes pass `byte:${slug}` (preserving the original `byte:gradient-descent:q1`
 *    format); course lessons pass `course:${course}:${lesson}`.
 *
 * `today` is accepted as a prop rather than read via `useToday()` so a parent
 * server component can pass a stable value, but it falls back to the hook when
 * omitted (the original behaviour).
 */
export function ByteBody({
  progressSlug,
  attemptPrefix,
  topic,
  questions,
  exercise,
  today: todayProp,
}: {
  progressSlug: string;
  attemptPrefix: string;
  topic: string;
  questions: ByteQuestion[];
  exercise?: CodeExercise;
  today?: DayKey;
}) {
  const todayFromHook = useToday();
  const today = todayProp ?? todayFromHook;
  const progress = useByteProgress(progressSlug);
  const start = useStartByte();
  const complete = useCompleteByte();
  const submit = useSubmitAttempt();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [reward, setReward] = useState<AttemptResult | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (progress && progress.status === "unseen") {
      void start(progressSlug);
    }
  }, [progress, progressSlug, start]);

  const allCorrect = questions.every(
    (q) => checked[q.id] && answers[q.id] === q.answer,
  );

  async function checkQuestion(id: string) {
    const q = questions.find((x) => x.id === id);
    if (!q || !answers[id]) return;
    const correct = answers[id] === q.answer;
    setChecked((c) => ({ ...c, [id]: true }));
    await submit({
      itemKey: `${attemptPrefix}:${id}`,
      topic,
      mode: "byte",
      correct,
      msTaken: 0,
      today,
    });
  }

  async function finish() {
    if (!allCorrect || pending) return;
    setPending(true);
    try {
      const result = await complete(progressSlug, today);
      setReward(result);
    } finally {
      setPending(false);
    }
  }

  const alreadyDone = progress?.status === "completed";

  return (
    <div className="mt-12 space-y-8 border-t border-ash pt-10">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Check yourself</h2>
        {questions.map((q) => {
          const isChecked = !!checked[q.id];
          const isCorrect = answers[q.id] === q.answer;
          return (
            <div key={q.id} className="card space-y-3 p-5">
              <p className="text-sm font-medium text-ink">{q.prompt}</p>
              <div className="space-y-2">
                {q.choices.map((c) => {
                  let tone = "border-ash hover:border-brand/50";
                  if (isChecked) {
                    if (c.id === q.answer) tone = "border-good bg-good-wash";
                    else if (c.id === answers[q.id]) tone = "border-bad bg-bad-wash";
                    else tone = "border-ash opacity-60";
                  } else if (answers[q.id] === c.id) {
                    tone = "border-brand bg-brand-wash";
                  }
                  return (
                    <button
                      key={c.id}
                      type="button"
                      disabled={isChecked}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: c.id }))}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm ${tone}`}
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-semibold uppercase">
                        {c.id}
                      </span>
                      {c.label}
                    </button>
                  );
                })}
              </div>
              {!isChecked ? (
                <button
                  type="button"
                  disabled={!answers[q.id]}
                  onClick={() => void checkQuestion(q.id)}
                  className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Check
                </button>
              ) : (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    isCorrect
                      ? "border-good/30 bg-good-wash"
                      : "border-bad/30 bg-bad-wash"
                  }`}
                >
                  <p className="font-semibold">{isCorrect ? "Correct" : "Not quite"}</p>
                  <p className="mt-1 text-ink-soft">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {exercise && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">{exercise.title}</h2>
          <p className="text-sm text-ink-soft">{exercise.prompt}</p>
          <CodeCell title="Python" starterCode={exercise.starterCode} testCode={exercise.testCode} />
        </section>
      )}

      <section className="space-y-3">
        {alreadyDone || reward ? (
          <div className="rounded-xl border border-good/30 bg-good-wash px-4 py-3 text-sm">
            Byte complete
            {reward && reward.xpAwarded > 0 ? ` · +${reward.xpAwarded} XP` : ""}
          </div>
        ) : (
          <button
            type="button"
            disabled={!allCorrect || pending}
            onClick={() => void finish()}
            className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            {allCorrect ? (pending ? "Saving…" : "Mark complete") : "Answer all questions to finish"}
          </button>
        )}
        {reward && <RewardBanner result={reward} />}
      </section>
    </div>
  );
}
