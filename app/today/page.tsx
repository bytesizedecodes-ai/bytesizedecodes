"use client";

import Link from "next/link";
import { Shell } from "@/components/Shell";
import { StatsHud } from "@/components/StatsHud";
import { BYTES } from "@/content";
import {
  useAllByteProgress,
  useCurrentUser,
  useDayProgress,
  useRecentXp,
  useReviewQueue,
  useToday,
} from "@/lib/data/provider";

export default function TodayPage() {
  const today = useToday();
  const profile = useCurrentUser();
  const day = useDayProgress(today);
  const queue = useReviewQueue(today);
  const bytes = useAllByteProgress();
  const recent = useRecentXp(7, today);

  const nextByte = BYTES.find((b) => bytes?.[b.slug]?.status !== "completed") ?? BYTES[0];
  const completedCount = BYTES.filter((b) => bytes?.[b.slug]?.status === "completed").length;

  return (
    <Shell active="/today">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
          <p className="mt-1 text-sm text-ink-soft">
            A short session. Drills, review, or a byte — any of them counts.
          </p>
        </div>

        <StatsHud profile={profile} dueCount={queue?.length} />

        {day && day.practised && (
          <div className="rounded-xl border border-good/30 bg-good-wash px-4 py-3 text-sm text-ink">
            Practised today · {day.itemsCorrect}/{day.itemsAnswered} correct · +{day.xpEarned} XP
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <Action
            href="/practice"
            eyebrow="Unlimited"
            title="Do a drill"
            body="Interview-shaped questions, generated and auto-graded."
          />
          <Action
            href="/review"
            eyebrow={queue === undefined ? "…" : `${queue.length} due`}
            title="Review"
            body="Spaced repetition of what you've already seen."
            disabled={queue !== undefined && queue.length === 0}
          />
          <Action
            href={nextByte ? `/bytes/${nextByte.slug}` : "/bytes"}
            eyebrow={`${completedCount}/${BYTES.length} done`}
            title={nextByte ? nextByte.title : "All bytes done"}
            body={nextByte ? "Next bite-sized lesson." : "Come back when Season 1 grows."}
          />
        </div>

        {recent && (
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Last 7 days</h2>
            <div className="mt-4 flex items-end gap-1.5">
              {recent.map((d) => {
                const height = d.xp === 0 ? 4 : Math.min(64, 8 + d.xp / 2);
                return (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t ${d.practised ? "bg-brand" : "bg-ash"}`}
                      style={{ height }}
                      title={`${d.day}: ${d.xp} XP`}
                    />
                    <span className="text-[10px] text-ink-faint">{d.day.slice(8)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Action({
  href,
  eyebrow,
  title,
  body,
  disabled,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  disabled?: boolean;
}) {
  const className = `card block p-5 transition ${
    disabled ? "opacity-50 pointer-events-none" : "hover:border-brand/40"
  }`;
  return (
    <Link href={href} className={className} aria-disabled={disabled}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-brand-deep">{eyebrow}</p>
      <h3 className="mt-1 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{body}</p>
    </Link>
  );
}
