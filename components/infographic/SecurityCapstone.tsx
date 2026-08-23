import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security Foundations — Lesson 10: capstone "The inspection walk".
 * Through-line: one walk around the AI house — every room is a component
 * from the course, every room gets its lock question. The whole course on
 * one street.
 */
export function SecurityCapstone() {
  const Room = ({
    icon,
    room,
    risk,
    lock,
  }: {
    icon: string;
    room: string;
    risk: string;
    lock: string;
  }) => (
    <MotionChild>
      <div className="flex h-full flex-col gap-1.5 rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <p className="text-xs font-bold text-ink">{room}</p>
        </div>
        <p className="text-[10px] font-medium text-ink-soft">risk: {risk}</p>
        <p className="mt-auto rounded-lg bg-brand-wash px-2 py-1 text-[10px] font-semibold text-ink">lock: {lock}</p>
      </div>
    </MotionChild>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="The inspection walk"
        subtitle="One lap around the AI house — every room, every lock"
      />

      {/* SCENE 1 — the house */}
      <Scene caption="① The AI house: four rooms you now know">
        <div className="mx-auto max-w-md rounded-2xl border-2 border-ink bg-surface-elevated p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col items-center rounded-xl border border-ash p-2.5 text-center">
              <span className="text-xl">💬</span>
              <p className="mt-1 text-[11px] font-bold text-ink">the chat room</p>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-ash p-2.5 text-center">
              <span className="text-xl">🧠</span>
              <p className="mt-1 text-[11px] font-bold text-ink">the model room</p>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-ash p-2.5 text-center">
              <span className="text-xl">📚</span>
              <p className="mt-1 text-[11px] font-bold text-ink">the library (documents)</p>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-ash p-2.5 text-center">
              <span className="text-xl">🔑</span>
              <p className="mt-1 text-[11px] font-bold text-ink">the errand room (tools & actions)</p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Every AI app is some arrangement of these rooms — the doors differ, the rooms don&apos;t.
        </p>
      </Scene>

      {/* SCENE 2 — the lock questions */}
      <Scene caption="② Each room gets its lock question">
        <Stagger className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Room icon="💬" room="the chat room" risk="hidden instructions, jailbreaks, leaks" lock="mark outside text as data; guardrails in and out; don't feed secrets" />
          <Room icon="🧠" room="the model room" risk="unknown bakery, surprises baked in" lock="named sources, sealed boxes, taste-test before serving" />
          <Room icon="📚" room="the library" risk="poisoned pages, pages the reader shouldn't see" lock="check who shelved each page; every reader shows their pass" />
          <Room icon="🔑" room="the errand room" risk="the master-key intern" lock="one key per errand; humans sign at the vault; log every use" />
        </Stagger>
      </Scene>

      {/* SCENE 3 — the walk itself */}
      <Scene caption="③ The walk, in order">
        <div className="mx-auto max-w-md space-y-2">
          {[
            "Map the doors — name every way in and out",
            "Rank by damage — vaults before jokes",
            "Lock by rank — layers, not one big lock",
            "Re-walk monthly — every new feature adds a door",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-wash text-[11px] font-bold text-ink">
                {i + 1}
              </span>
              <p className="text-xs font-semibold text-ink">{step}</p>
            </div>
          ))}
        </div>
      </Scene>

      {/* SCENE 4 — the street sign */}
      <Scene caption="④ What you now carry">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            You can walk into any AI product and ask the{" "}
            <span className="font-bold">four room questions</span> — and know the first three fixes to demand.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            Next stop: build the defenses with your own hands — AI Security in Practice.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Map the doors, rank the damage,{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">lock by rank, re-walk monthly</span> —
          the whole course on one street.
        </p>
      </Card>
    </Infographic>
  );
}
