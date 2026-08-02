"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DrillPlayer } from "@/components/DrillPlayer";
import { RequireOnboarding } from "@/components/RequireOnboarding";
import { Shell } from "@/components/Shell";
import { GENERATORS, type Difficulty } from "@/lib/drills";
import { useToday } from "@/lib/data/provider";

export default function PracticePage() {
  return (
    <Suspense fallback={<PracticeSkeleton />}>
      <PracticeContent />
    </Suspense>
  );
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const today = useToday();
  const [nudge, setNudge] = useState(0);
  const requestedTopic = searchParams.get("topic");
  const requestedDifficulty = Number(searchParams.get("difficulty"));
  const selectedGenerator =
    GENERATORS.find(
      (generator) =>
        generator.id === requestedTopic || generator.topic === requestedTopic,
    ) ?? GENERATORS[0]!;
  const generatorId = selectedGenerator.id;
  const difficulty = selectedGenerator.supportedDifficulties.includes(
    requestedDifficulty as Difficulty,
  )
    ? (requestedDifficulty as Difficulty)
    : 2;

  function updateSelection(nextGeneratorId: string, nextDifficulty: Difficulty) {
    const generator = GENERATORS.find((item) => item.id === nextGeneratorId)!;
    router.replace(
      `/practice?topic=${encodeURIComponent(generator.topic)}&difficulty=${nextDifficulty}`,
      { scroll: false },
    );
    setNudge(0);
  }

  const seed = useMemo(() => {
    let h = 2166136261;
    const s = `${today}:${generatorId}:${difficulty}:${nudge}`;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) % 2_147_483_647 || 1;
  }, [today, generatorId, difficulty, nudge]);

  const gen = GENERATORS.find((g) => g.id === generatorId)!;

  return (
    <Shell active="/practice">
      <RequireOnboarding>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Practice</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Unlimited interview drills. Wrong answers name the misconception.
          </p>
        </div>

        <div className="card space-y-4 p-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
              Topic
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {GENERATORS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    updateSelection(g.id, difficulty);
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    g.id === generatorId
                      ? "bg-ink text-canvas"
                      : "bg-ash/70 text-ink-soft hover:bg-ash"
                  }`}
                >
                  {g.title}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-ink-soft">{gen.blurb}</p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
              Difficulty
            </p>
            <div className="mt-2 flex gap-2">
              {gen.supportedDifficulties.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    updateSelection(generatorId, d);
                  }}
                  className={`h-9 w-9 rounded-full text-sm font-semibold ${
                    d === difficulty
                      ? "bg-brand text-ink"
                      : "bg-ash/70 text-ink-soft hover:bg-ash"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DrillPlayer
          generatorId={generatorId}
          difficulty={difficulty}
          seed={seed}
          mode="practice"
          onDone={() => setNudge((n) => n + 1)}
        />
      </div>
      </RequireOnboarding>
    </Shell>
  );
}

function PracticeSkeleton() {
  return (
    <Shell active="/practice">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="h-16 w-64 animate-pulse rounded-xl bg-ash/70" />
        <div className="h-40 animate-pulse rounded-[18px] bg-ash/70" />
        <div className="h-80 animate-pulse rounded-[18px] bg-ash/70" />
      </div>
    </Shell>
  );
}
