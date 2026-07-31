"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthoredReviewPlayer } from "@/components/AuthoredReviewPlayer";
import { DrillPlayer } from "@/components/DrillPlayer";
import { Shell } from "@/components/Shell";
import { resolveAuthoredReview } from "@/content/review";
import { useReviewQueue, useToday } from "@/lib/data/provider";
import type { ReviewCard } from "@/lib/data/types";

export default function ReviewPage() {
  const today = useToday();
  const queue = useReviewQueue(today);
  const [sessionCards, setSessionCards] = useState<ReviewCard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (queue && sessionCards === null) setSessionCards(queue);
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

  const cards = sessionCards ?? queue;

  if (cards.length === 0 || completed) {
    return (
      <Shell active="/review">
        <div className="mx-auto max-w-md space-y-4 py-16 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {completed ? "Review complete" : "Inbox zero"}
          </h1>
          <p className="text-sm text-ink-soft">
            {completed
              ? "You brought every due idea back to mind. The scheduler will choose when each one returns."
              : "Nothing is due. Learn a unit or do a drill—correct answers create cards that return later."}
          </p>
          <Link
            href={completed ? "/today" : "/practice"}
            className="inline-block rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            {completed ? "Back to Today" : "Go practise"}
          </Link>
        </div>
      </Shell>
    );
  }

  const card = cards[Math.min(index, cards.length - 1)]!;
  const remaining = cards.length - index;
  const onDone = () => {
    if (index + 1 >= cards.length) setCompleted(true);
    else setIndex((current) => current + 1);
  };

  return (
    <Shell active="/review">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {remaining} card{remaining === 1 ? "" : "s"} in this session
            </p>
          </div>
          <p className="text-sm text-ink-faint">
            {Math.min(index + 1, cards.length)} / {cards.length}
          </p>
        </div>

        {card.kind === "generator" ? (
          <DrillPlayer
            key={card.itemKey + String(card.seed)}
            generatorId={card.generatorId}
            difficulty={card.difficulty}
            seed={card.seed}
            mode="review"
            onDone={onDone}
          />
        ) : (
          <AuthoredReview
            key={card.itemKey}
            card={card}
            onDone={onDone}
          />
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
          className="mt-4 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white"
        >
          Next review
        </button>
      </div>
    );
  }
  return <AuthoredReviewPlayer card={card} resolved={resolved} onDone={onDone} />;
}
