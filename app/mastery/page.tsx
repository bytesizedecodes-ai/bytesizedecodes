"use client";

import Link from "next/link";
import { Shell } from "@/components/Shell";
import { StatsHud } from "@/components/StatsHud";
import { MotionProvider, Reveal, Stagger, MotionChild } from "@/components/infographic/motion";
import { useCurrentUser, useReviewQueue, useTopicMastery, useToday } from "@/lib/data/provider";
import type { TopicMastery } from "@/lib/data/types";

/**
 * Mastery / skill-map page.
 *
 * Renders the per-topic mastery data (useTopicMastery) that was already computed
 * but had no UI consumer. Each topic is a card with a 0-100 bar; the bars rise
 * as the learner's review intervals grow (mastery is derived from SRS scheduling,
 * not lessons clicked). This turns the invisible review-queue investment into a
 * visible Reward of the Self — "what you can now do".
 *
 * Honest scope: mastery only covers topics drilled via the generators (currently
 * 4). Course lessons and bytes don't feed SRS, so they aren't reflected here.
 * The subtitle and empty state say so plainly.
 */

/** Human-readable labels for the drill topics. Raw slugs look unfinished. */
const TOPIC_LABELS: Record<string, string> = {
  evaluation: "Model evaluation",
  optimisation: "Gradient optimisation",
  "deep-learning": "Network output & loss",
  "deep-learning-fundamentals": "Tensors & shapes",
};

/** Where each topic is practised — turns a passive metric into an action. */
const TOPIC_HREF: Record<string, string> = {
  evaluation: "/practice?topic=evaluation",
  optimisation: "/practice?topic=optimisation",
  "deep-learning": "/practice?topic=deep-learning",
  "deep-learning-fundamentals": "/practice?topic=deep-learning-fundamentals",
};

export default function MasteryPage() {
  const today = useToday();
  const profile = useCurrentUser();
  const queue = useReviewQueue(today);
  const mastery = useTopicMastery(today);

  return (
    <Shell active="/mastery">
      <MotionProvider>
        <div className="space-y-6">
          <Reveal>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Mastery</h1>
              <p className="mt-1 text-sm text-ink-soft">
                How durable your knowledge is in each area. Bars rise as your
                review intervals grow — not from clicking lessons, but from
                remembering over time.
              </p>
            </div>
          </Reveal>

          <StatsHud profile={profile} dueCount={queue?.length} />

          {mastery === undefined ? (
            <MasterySkeleton />
          ) : mastery.length === 0 ? (
            <EmptyState />
          ) : (
            <MasteryList mastery={mastery} />
          )}
        </div>
      </MotionProvider>
    </Shell>
  );
}

/** The topic cards, staggered in. Each shows a 0-100 mastery bar. */
function MasteryList({ mastery }: { mastery: TopicMastery[] }) {
  const overall = weightedOverall(mastery);

  return (
    <>
      {/* Overall mastery — the headline number */}
      <Reveal>
        <div className="card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-ink">Overall mastery</h2>
            <span className="text-2xl font-semibold tracking-tight text-ink">
              {Math.round(overall * 100)}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ash">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${Math.round(overall * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-ink-soft">
            A weighted average across {mastery.length}{" "}
            {mastery.length === 1 ? "area" : "areas"} you&apos;ve practised.
          </p>
        </div>
      </Reveal>

      {/* Per-topic cards — stagger in so the list "builds" */}
      <Stagger className="grid gap-3 sm:grid-cols-2">
        {mastery.map((m) => (
          <MotionChild key={m.topic}>
            <TopicCard m={m} />
          </MotionChild>
        ))}
      </Stagger>
    </>
  );
}

/** A single topic's mastery card, with a progress bar and a "practise" CTA. */
function TopicCard({ m }: { m: TopicMastery }) {
  const pct = Math.round(m.mastery * 100);
  const label = TOPIC_LABELS[m.topic] ?? m.topic;
  const href = TOPIC_HREF[m.topic] ?? "/practice";
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-ink">{label}</h3>
          <p className="mt-0.5 text-[11px] text-ink-soft">
            {m.itemCount} {m.itemCount === 1 ? "card" : "cards"}
            {m.dueCount > 0 ? ` · ${m.dueCount} due` : ""}
          </p>
        </div>
        <span className="flex-shrink-0 text-lg font-semibold tracking-tight text-ink">
          {pct}%
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ash">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${pct}%` }}
        />
      </div>
      <Link
        href={href}
        className="mt-3 inline-block text-[12px] font-medium text-brand-deep hover:underline"
      >
        {m.dueCount > 0 ? `Review ${m.dueCount} due →` : "Practise more →"}
      </Link>
    </div>
  );
}

/** Honest empty state for a brand-new learner with no SRS items yet. */
function EmptyState() {
  return (
    <Reveal>
      <div className="card p-6 text-center">
        <div className="text-3xl" aria-hidden="true">🌱</div>
        <h2 className="mt-2 text-base font-semibold text-ink">
          Nothing to measure yet
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
          Mastery grows from spaced review. Do a few drills first — once
          they&apos;re in your review queue, this page will show how durable each
          area is becoming.
        </p>
        <Link
          href="/practice"
          className="mt-4 inline-block rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-deep"
        >
          Do a drill
        </Link>
      </div>
    </Reveal>
  );
}

/** Loading skeleton — mirrors StatsHud's pulse pattern. */
function MasterySkeleton() {
  return (
    <div className="space-y-3">
      <div className="card p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-ash/60" />
        <div className="mt-3 h-2 w-full animate-pulse rounded bg-ash/60" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card p-4">
            <div className="h-5 w-32 animate-pulse rounded bg-ash/60" />
            <div className="mt-3 h-1.5 w-full animate-pulse rounded bg-ash/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Weighted overall mastery: average weighted by itemCount, so a topic with 30
 * cards counts more than one with 2. Falls back to a simple mean if any topic
 * has no items (shouldn't happen, but stay defensive).
 */
function weightedOverall(mastery: TopicMastery[]): number {
  const totalItems = mastery.reduce((sum, m) => sum + m.itemCount, 0);
  if (totalItems === 0) {
    return mastery.reduce((sum, m) => sum + m.mastery, 0) / mastery.length;
  }
  return mastery.reduce((sum, m) => sum + m.mastery * m.itemCount, 0) / totalItems;
}
