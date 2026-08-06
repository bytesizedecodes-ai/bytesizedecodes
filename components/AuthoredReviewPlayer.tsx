"use client";

import Link from "next/link";
import { useState } from "react";
import { RewardBanner } from "@/components/RewardBanner";
import type { ResolvedAuthoredReview } from "@/content/review";
import { useGradeReview, useToday } from "@/lib/data/provider";
import type { AttemptResult, AuthoredReviewCard } from "@/lib/data/types";
import type { SrsGrade } from "@/lib/srs";
import { capabilityForTopic } from "@/lib/capabilityLabels";

export function AuthoredReviewPlayer({
  card,
  resolved,
  onDone,
}: {
  card: AuthoredReviewCard;
  resolved: ResolvedAuthoredReview;
  onDone: () => void;
}) {
  const today = useToday();
  const gradeReview = useGradeReview();
  const [selection, setSelection] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [reward, setReward] = useState<AttemptResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const correct = selection === resolved.question.answer;

  async function submitGrade(grade: SrsGrade) {
    if (!revealed || pending || reward) return;
    setPending(true);
    setError(null);
    try {
      const result = await gradeReview({
        itemKey: card.itemKey,
        topic: card.topic,
        mode: "review",
        correct,
        msTaken: Date.now() - startedAt,
        today,
        grade,
      });
      setReward(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save this review.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="card animate-pop space-y-5 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-brand-wash px-2.5 py-1 text-[11px] font-semibold text-brand-deep">
          From {resolved.sourceTitle}
        </span>
        <Link href={resolved.sourceHref} className="text-xs text-ink-faint hover:text-brand-deep">
          Revisit lesson
        </Link>
      </div>

      <h2 className="text-base font-semibold leading-relaxed text-ink">
        {resolved.question.prompt}
      </h2>

      <div className="space-y-2">
        {resolved.question.choices.map((choice) => {
          const selected = selection === choice.id;
          let tone = "border-ash hover:border-brand/50";
          if (revealed) {
            if (choice.id === resolved.question.answer) tone = "border-good bg-good-wash";
            else if (selected) tone = "border-bad bg-bad-wash";
            else tone = "border-ash opacity-60";
          } else if (selected) {
            tone = "border-brand bg-brand-wash";
          }
          return (
            <button
              key={choice.id}
              type="button"
              disabled={revealed}
              onClick={() => setSelection(choice.id)}
              className={`focus-ring flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${tone}`}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-semibold uppercase">
                {choice.id}
              </span>
              <span>{choice.label}</span>
            </button>
          );
        })}
      </div>

      {!revealed && (
        <button
          type="button"
          disabled={!selection}
          onClick={() => setRevealed(true)}
          className="focus-ring w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-canvas disabled:opacity-40"
        >
          Reveal answer
        </button>
      )}

      {revealed && (
        <div className="space-y-4">
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              correct ? "border-good/30 bg-good-wash" : "border-bad/30 bg-bad-wash"
            }`}
          >
            <p className="font-semibold">{correct ? "Correct" : "Not quite"}</p>
            <p className="mt-1 leading-relaxed text-ink-soft">{resolved.question.explanation}</p>
          </div>

          {!reward && (
            <div>
              <p className="text-xs font-semibold text-ink">How hard was that to remember?</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["again", "hard", "good", "easy"] as const).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    disabled={pending || (!correct && grade !== "again")}
                    onClick={() => void submitGrade(grade)}
                    className="focus-ring rounded-xl border border-ash bg-surface-elevated px-3 py-2.5 text-xs font-semibold capitalize text-ink hover:border-brand disabled:opacity-35"
                  >
                    {grade}
                  </button>
                ))}
              </div>
              {!correct && (
                <p className="mt-2 text-[11px] text-ink-faint">
                  Incorrect answers return soon, so this review is graded Again.
                </p>
              )}
            </div>
          )}

          {error && <p className="rounded-xl bg-bad-wash px-3 py-2 text-xs text-bad">{error}</p>}
          {reward && (
            <>
              <RewardBanner
                result={reward}
                capability={capabilityForTopic(card.topic)}
              />
              <button
                type="button"
                onClick={onDone}
                className="focus-ring w-full rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-sm font-semibold text-ink hover:bg-ash/40"
              >
                Next review
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
