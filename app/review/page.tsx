"use client";

import Link from "next/link";
import { useState } from "react";
import { DrillPlayer } from "@/components/DrillPlayer";
import { Shell } from "@/components/Shell";
import { useReviewQueue, useToday } from "@/lib/data/provider";

export default function ReviewPage() {
  const today = useToday();
  const queue = useReviewQueue(today);
  const [index, setIndex] = useState(0);

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

  if (queue.length === 0) {
    return (
      <Shell active="/review">
        <div className="mx-auto max-w-md space-y-4 py-16 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Inbox zero</h1>
          <p className="text-sm text-ink-soft">
            Nothing is due. Do a few drills first — each correct answer creates a review
            card that comes back later.
          </p>
          <Link
            href="/practice"
            className="inline-block rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Go practise
          </Link>
        </div>
      </Shell>
    );
  }

  const card = queue[Math.min(index, queue.length - 1)]!;
  const remaining = queue.length - index;

  return (
    <Shell active="/review">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {remaining} card{remaining === 1 ? "" : "s"} due · capped at 20 a day
            </p>
          </div>
          <p className="text-sm text-ink-faint">
            {Math.min(index + 1, queue.length)} / {queue.length}
          </p>
        </div>

        <DrillPlayer
          key={card.itemKey + String(card.seed)}
          generatorId={card.generatorId}
          difficulty={card.difficulty}
          seed={card.seed}
          mode="review"
          onDone={() => {
            if (index + 1 >= queue.length) {
              setIndex(0);
            } else {
              setIndex((i) => i + 1);
            }
          }}
        />
      </div>
    </Shell>
  );
}
