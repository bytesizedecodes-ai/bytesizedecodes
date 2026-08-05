"use client";

import { useEffect, useRef, useState } from "react";
import { CodeCell } from "@/components/CodeCell";
import { RewardBanner } from "@/components/RewardBanner";
import type { ByteQuestion, CodeExercise, SkillId } from "@/content";
import { useConvexAuth } from "convex/react";
import { AuthModal } from "@/components/AuthModal";
import {
  useByteProgress,
  useCompleteByte,
  useRecordCodeTestPass,
  useSaveLessonDraft,
  useStartByte,
  useSubmitAttempt,
  useToday,
} from "@/lib/data/provider";
import type { AttemptResult } from "@/lib/data/types";
import type { DayKey } from "@/lib/day";

/**
 * The interactive "byte" body: MCQ self-check questions, an optional runnable
 * code cell, and the mark-complete → XP reward flow.
 */
export function ByteBody({
  progressSlug,
  attemptPrefix,
  topic,
  questions,
  exercise,
  skillIds = [],
  today: todayProp,
}: {
  progressSlug: string;
  attemptPrefix: string;
  topic: string;
  questions: ByteQuestion[];
  exercise?: CodeExercise;
  skillIds?: readonly SkillId[];
  today?: DayKey;
}) {
  const todayFromHook = useToday();
  const today = todayProp ?? todayFromHook;
  const progress = useByteProgress(progressSlug);
  const start = useStartByte();
  const complete = useCompleteByte();
  const submit = useSubmitAttempt();
  const saveDraft = useSaveLessonDraft();
  const recordCodePass = useRecordCodeTestPass();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [code, setCode] = useState(exercise?.starterCode ?? "");
  const [exercisePassed, setExercisePassed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [reward, setReward] = useState<AttemptResult | null>(null);
  const [pending, setPending] = useState(false);
  const questionStartedAt = useRef<Record<string, number>>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Progress writes require a signed-in account. Guests can read; start only when authed
  // and we already have a real unseen progress row (not the guest placeholder).
  const { isAuthenticated } = useConvexAuth();
  useEffect(() => {
    if (!isAuthenticated) return;
    if (progress && progress.status === "unseen") {
      void start(progressSlug);
    }
  }, [isAuthenticated, progress, progressSlug, start]);

  useEffect(() => {
    if (!progress || hydrated) return;
    if (progress.draftAnswers) setAnswers(progress.draftAnswers);
    if (progress.draftChecked) {
      setChecked(
        Object.fromEntries(progress.draftChecked.map((id) => [id, true])),
      );
    }
    if (progress.draftCode) setCode(progress.draftCode);
    else if (exercise?.starterCode) setCode(exercise.starterCode);
    setExercisePassed(progress.exercisePassed);
    setHydrated(true);
  }, [progress, hydrated, exercise?.starterCode]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!hydrated || progress?.status === "completed") return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void saveDraft({
        slug: progressSlug,
        draftAnswers: answers,
        draftChecked: Object.keys(checked).filter((id) => checked[id]),
        draftCode: exercise ? code : undefined,
      });
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [
    isAuthenticated,
    answers,
    checked,
    code,
    exercise,
    hydrated,
    progress?.status,
    progressSlug,
    saveDraft,
  ]);

  const questionsDone =
    questions.length === 0 ||
    questions.every((q) => checked[q.id] && answers[q.id] === q.answer);
  const canComplete = questionsDone && (!exercise || exercisePassed);

  const [authOpen, setAuthOpen] = useState(false);

  async function checkQuestion(id: string) {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    const q = questions.find((x) => x.id === id);
    if (!q || !answers[id]) return;
    const correct = answers[id] === q.answer;
    const startedAt = questionStartedAt.current[id] ?? Date.now();
    setChecked((c) => ({ ...c, [id]: true }));
    await submit({
      itemKey: `${attemptPrefix}:${id}`,
      topic,
      mode: "byte",
      correct,
      msTaken: Math.max(0, Date.now() - startedAt),
      today,
    });
  }

  async function finish() {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    if (!canComplete || pending) return;
    setPending(true);
    try {
      const result = await complete(progressSlug, today, {
        requireExercise: Boolean(exercise),
      });
      setReward(result);
    } finally {
      setPending(false);
    }
  }

  const alreadyDone = progress?.status === "completed";

  return (
    <div className="mt-12 space-y-8 border-t border-ash pt-10">
      {!isAuthenticated && (
        <p className="rounded-xl border border-brand/30 bg-brand-wash px-4 py-3 text-sm text-ink-soft">
          Reading is free.{" "}
          <button
            type="button"
            className="font-semibold text-brand-deep hover:underline"
            onClick={() => setAuthOpen(true)}
          >
            Sign in
          </button>{" "}
          to save progress and earn XP.
        </p>
      )}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} redirectTo="/onboarding?next=/learn" />
      {questions.length > 0 && (
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
                        onClick={() => {
                          questionStartedAt.current[q.id] ??= Date.now();
                          setAnswers((a) => ({ ...a, [q.id]: c.id }));
                        }}
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
                    className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-canvas disabled:opacity-40"
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
                    {!isCorrect && (
                      <button
                        type="button"
                        className="mt-3 text-xs font-semibold text-brand-deep hover:underline"
                        onClick={() => {
                          questionStartedAt.current[q.id] = Date.now();
                          setChecked((current) => ({ ...current, [q.id]: false }));
                        }}
                      >
                        Try again
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {exercise && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">{exercise.title}</h2>
          <p className="text-sm text-ink-soft">{exercise.prompt}</p>
          <CodeCell
            title="Python"
            starterCode={code}
            testCode={exercise.testCode}
            onCodeChange={setCode}
            onTestResult={(ok) => {
              if (!ok) return;
              setExercisePassed(true);
              if (isAuthenticated) {
                void recordCodePass(progressSlug, today, [...skillIds]);
              }
            }}
          />
          {exercisePassed ? (
            <p className="text-xs font-medium text-good">Code checks passed.</p>
          ) : (
            <p className="text-xs text-ink-faint">Pass the hidden tests to unlock completion.</p>
          )}
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
            disabled={!canComplete || pending}
            onClick={() => void finish()}
            className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-canvas disabled:opacity-40"
          >
            {canComplete
              ? pending
                ? "Saving…"
                : "Mark complete"
              : exercise && !exercisePassed
                ? "Pass the code exercise to finish"
                : "Answer all questions to finish"}
          </button>
        )}
        {reward && <RewardBanner result={reward} />}
      </section>
    </div>
  );
}
