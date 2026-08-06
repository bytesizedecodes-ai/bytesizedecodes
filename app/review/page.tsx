"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthoredReviewPlayer } from "@/components/AuthoredReviewPlayer";
import { DrillPlayer } from "@/components/DrillPlayer";
import { ProUpsell } from "@/components/ProUpsell";
import { Shell } from "@/components/Shell";
import { resolveAuthoredReview } from "@/content/review";
import {
  estimateMasteryMinutes,
  MASTERY_CHALLENGE_CAP,
} from "@/lib/capabilityLabels";
import { useReviewQueue, useToday } from "@/lib/data/provider";
import type { ReviewCard } from "@/lib/data/types";

export default function ReviewPage() {
  const today = useToday();
  const queue = useReviewQueue(today);
  const [sessionCards, setSessionCards] = useState<ReviewCard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (queue && sessionCards === null) {
      // Mastery Challenge: soft session size (remainder stays due for later)
      setSessionCards(queue.slice(0, MASTERY_CHALLENGE_CAP));
    }
  }, [queue, sessionCards]);

  if (queue === undefined) {
    return (
      <Shell active="/review">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="h-8 w-40 animate-pulse rounded bg-ash/60" />
          <div className="card h-64 animate-pulse bg-ash/40" />
        </div>
      </Shell>
    );
  }

  const cards = sessionCards ?? [];
  const totalDue = queue.length;
  const sessionTotal = cards.length;
  const leftover = Math.max(0, totalDue - sessionTotal);

  if (sessionTotal === 0 || completed) {
    return (
      <Shell active="/review">
        <div className="mx-auto max-w-md space-y-5 py-12 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
            Mastery Challenge
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {completed ? "Challenge complete" : "Inbox zero"}
          </h1>
          <p className="text-sm text-ink-soft">
            {completed
              ? leftover > 0
                ? `Nice work. ${leftover} more card${leftover === 1 ? "" : "s"} still due later — come back when you have a few minutes.`
                : "You brought every due idea back to mind. The scheduler will choose when each one returns."
              : "Nothing is due. Learn a unit or do a drill—correct answers create cards that return later."}
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link
              href={completed ? "/today" : "/practice"}
              className="inline-block rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-canvas"
            >
              {completed ? "Back to Today" : "Go practise"}
            </Link>
            {completed && leftover > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSessionCards(queue.slice(0, MASTERY_CHALLENGE_CAP));
                  setIndex(0);
                  setCompleted(false);
                }}
                className="text-sm font-semibold text-brand-deep hover:underline"
              >
                Start another Mastery Challenge
              </button>
            )}
          </div>
          {completed && (
            <div className="pt-4 text-left">
              <ProUpsell variant="banner" />
            </div>
          )}
        </div>
      </Shell>
    );
  }

  const card = cards[Math.min(index, cards.length - 1)]!;
  const remaining = cards.length - index;
  const mins = estimateMasteryMinutes(sessionTotal);
  const onDone = () => {
    if (index + 1 >= cards.length) setCompleted(true);
    else setIndex((current) => current + 1);
  };

  return (
    <Shell active="/review">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
              Mastery Challenge
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Spaced review</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {remaining} skill check{remaining === 1 ? "" : "s"} left · ~{Math.ceil(mins)} min
              session
              {leftover > 0 ? ` · ${leftover} more due after this` : ""}
            </p>
          </div>
          <p className="text-sm tabular-nums text-ink-faint">
            {Math.min(index + 1, cards.length)} / {cards.length}
          </p>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-ash">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{
              width: `${Math.round((index / Math.max(1, cards.length)) * 100)}%`,
            }}
          />
        </div>

        {card.kind === "generator" ? (
          <DrillPlayer
            key={card.itemKey + String(card.seed)}
            generatorId={card.generatorId}
            difficulty={card.difficulty}
            seed={card.seed}
            mode="review"
            topic={card.topic}
            onDone={onDone}
          />
        ) : (
          <AuthoredReview key={card.itemKey} card={card} onDone={onDone} />
        )}
      </div>
    </Shell>
  );
}

function AuthoredReview({
  card,
  onDone,
}: {
  card: Extract<ReviewCard, { kind: "authored" }>;
  onDone: () => void;
}) {
  const resolved = resolveAuthoredReview(card);
  if (!resolved) {
    return (
      <div className="card p-5">
        <h2 className="font-semibold text-ink">This lesson changed</h2>
        <p className="mt-2 text-sm text-ink-soft">
          The original question is no longer in the catalog, so it will be skipped safely.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-4 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-canvas"
        >
          Skip
        </button>
      </div>
    );
  }

  return (
    <AuthoredReviewPlayer resolved={resolved} card={card} onDone={onDone} />
  );
}
