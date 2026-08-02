"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BlockList } from "@/components/BlockList";
import { RewardBanner } from "@/components/RewardBanner";
import {
  useGradeReview,
  useSubmitAttempt,
  useToday,
} from "@/lib/data/provider";
import type { AttemptResult } from "@/lib/data/types";
import {
  drillItemKey,
  generateQuestion,
  gradeAnswer,
  type Difficulty,
  type GeneratedQuestion,
} from "@/lib/drills";
import type { SrsGrade } from "@/lib/srs";

type Mode = "practice" | "review";

export function DrillPlayer({
  generatorId,
  difficulty,
  seed,
  mode = "practice",
  onDone,
}: {
  generatorId: string;
  difficulty: Difficulty;
  seed: number;
  mode?: Mode;
  onDone?: () => void;
}) {
  const question = useMemo(
    () => generateQuestion(generatorId, seed, difficulty),
    [generatorId, seed, difficulty],
  );

  return (
    <QuestionCard
      key={`${generatorId}-${difficulty}-${seed}`}
      question={question}
      mode={mode}
      onDone={onDone}
    />
  );
}

function QuestionCard({
  question,
  mode,
  onDone,
}: {
  question: GeneratedQuestion;
  mode: Mode;
  onDone?: () => void;
}) {
  const today = useToday();
  const submit = useSubmitAttempt();
  const gradeReview = useGradeReview();

  const [selection, setSelection] = useState<string>("");
  const [startedAt] = useState(() => Date.now());
  const [result, setResult] = useState<{
    correct: boolean;
    misconception: string | null;
    correctLabel: string;
  } | null>(null);
  const [reward, setReward] = useState<AttemptResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function check() {
    if (!selection || pending) return;
    setPending(true);
    setError(null);
    try {
      const graded = gradeAnswer(question, selection);
      setResult(graded);

      const itemKey = drillItemKey(question.generatorId, question.difficulty);
      const msTaken = Date.now() - startedAt;
      const base = {
        itemKey,
        topic: question.topic,
        correct: graded.correct,
        msTaken,
        today,
        difficulty: question.difficulty,
      };

      if (mode === "practice") {
        const rewardResult = await submit({ ...base, mode: "practice" });
        setReward(rewardResult);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  async function submitReviewGrade(grade: SrsGrade) {
    if (mode !== "review" || !result || pending || reward) return;
    setPending(true);
    setError(null);
    try {
      const rewardResult = await gradeReview({
        itemKey: drillItemKey(question.generatorId, question.difficulty),
        topic: question.topic,
        correct: result.correct,
        msTaken: Date.now() - startedAt,
        today,
        difficulty: question.difficulty,
        mode: "review",
        grade,
      });
      setReward(rewardResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save this review");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="card animate-pop space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
        <span className="rounded-full bg-ash px-2 py-0.5">{question.topic}</span>
        <span className="rounded-full bg-ash px-2 py-0.5">D{question.difficulty}</span>
        <span className="rounded-full bg-ash px-2 py-0.5">~{question.estimatedSeconds}s</span>
      </div>

      <BlockList blocks={question.prompt} />

      {(() => {
        const answer = question.answer;
        if (answer.kind !== "mcq") {
          return (
            <NumericInput
              disabled={!!result || pending}
              value={selection}
              onChange={setSelection}
              onSubmit={check}
              unit={answer.unit}
            />
          );
        }
        return (
          <div className="space-y-2">
            {answer.choices.map((c) => {
              const selected = selection === c.id;
              let tone = "border-ash hover:border-brand/50";
              if (result) {
                if (c.id === answer.correctId) tone = "border-good bg-good-wash";
                else if (selected) tone = "border-bad bg-bad-wash";
                else tone = "border-ash opacity-60";
              } else if (selected) {
                tone = "border-brand bg-brand-wash";
              }
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={!!result || pending}
                  onClick={() => setSelection(c.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${tone}`}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-semibold uppercase">
                    {c.id}
                  </span>
                  <span className="text-ink">{c.label}</span>
                </button>
              );
            })}
          </div>
        );
      })()}

      {!result && (
        <button
          type="button"
          disabled={!selection || pending}
          onClick={check}
          className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-canvas disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Checking…" : "Check answer"}
        </button>
      )}

      {error && (
        <p className="rounded-xl border border-bad/30 bg-bad-wash px-4 py-3 text-sm text-bad">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-3">
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              result.correct
                ? "border-good/30 bg-good-wash text-ink"
                : "border-bad/30 bg-bad-wash text-ink"
            }`}
          >
            <p className="font-semibold">{result.correct ? "Correct" : "Not quite"}</p>
            {!result.correct && (
              <p className="mt-1 text-ink-soft">
                Right answer: <strong>{result.correctLabel}</strong>
              </p>
            )}
            {result.misconception && (
              <p className="mt-2 text-ink-soft">{result.misconception}</p>
            )}
          </div>

          <details className="rounded-xl border border-ash px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-ink">
              Worked solution
            </summary>
            <div className="mt-3">
              <BlockList blocks={question.explanation} />
            </div>
          </details>

          {!result.correct && question.relatedBytes.length > 0 && (
            <div className="rounded-xl border border-brand-muted bg-brand-wash px-4 py-3">
              <p className="text-xs font-semibold text-ink">Repair this idea</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {question.relatedBytes.map((slug) => (
                  <Link
                    key={slug}
                    href={`/bytes/${slug}`}
                    className="rounded-full bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-brand-deep hover:underline"
                  >
                    Revisit {slug.replaceAll("-", " ")}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {mode === "review" && !reward && (
            <div>
              <p className="text-xs font-semibold text-ink">How hard was that to remember?</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["again", "hard", "good", "easy"] as const).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    disabled={pending || (!result.correct && grade !== "again")}
                    onClick={() => void submitReviewGrade(grade)}
                    className="focus-ring rounded-xl border border-ash bg-surface-elevated px-3 py-2.5 text-xs font-semibold capitalize text-ink hover:border-brand disabled:opacity-35"
                  >
                    {grade}
                  </button>
                ))}
              </div>
              {!result.correct && (
                <p className="mt-2 text-[11px] text-ink-faint">
                  Incorrect answers return soon, so this review is graded Again.
                </p>
              )}
            </div>
          )}

          {reward && <RewardBanner result={reward} />}

          {onDone && (mode === "practice" || reward) && (
            <button
              type="button"
              onClick={onDone}
              className="w-full rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-sm font-semibold text-ink hover:bg-ash/40"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function NumericInput({
  value,
  onChange,
  onSubmit,
  disabled,
  unit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  unit?: string;
}) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        inputMode="decimal"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
        placeholder="Your answer"
        className="flex-1 rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-sm outline-none focus:border-brand"
      />
      {unit && (
        <span className="flex items-center px-2 text-sm text-ink-faint">{unit}</span>
      )}
    </div>
  );
}
