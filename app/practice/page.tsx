"use client";

import { useMemo, useState } from "react";
import { DrillPlayer } from "@/components/DrillPlayer";
import { Shell } from "@/components/Shell";
import { GENERATORS, type Difficulty } from "@/lib/drills";
import { useToday } from "@/lib/data/provider";

export default function PracticePage() {
  const today = useToday();
  const [generatorId, setGeneratorId] = useState(GENERATORS[0]!.id);
  const [difficulty, setDifficulty] = useState<Difficulty>(2);
  const [nudge, setNudge] = useState(0);

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
                    setGeneratorId(g.id);
                    setNudge(0);
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    g.id === generatorId
                      ? "bg-ink text-white"
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
                    setDifficulty(d);
                    setNudge(0);
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
    </Shell>
  );
}
