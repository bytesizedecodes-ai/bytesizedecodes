import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security Foundations — Lesson 2: "The OWASP LLM Top Ten".
 * Through-line: the fire-safety checklist on the shop wall. A published
 * top-ten of the ways AI apps most often break — walk it, rank it, fix it.
 */
export function OwaspLlmTopTen() {
  const ChecklistRow = ({ n, name, plain }: { n: number; name: string; plain: string }) => (
    <MotionChild>
      <div className="flex items-center gap-3 rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-wash text-xs font-bold text-ink">
          {n}
        </span>
        <div>
          <p className="text-xs font-bold text-ink">{name}</p>
          <p className="text-[11px] font-medium text-ink-soft">{plain}</p>
        </div>
      </div>
    </MotionChild>
  );

  return (
    <Infographic>
      <InfographicHeader
        title="The OWASP LLM Top Ten"
        subtitle="The fire-safety checklist every AI shop hangs on its wall"
      />

      {/* SCENE 1 — inspectors publish a list */}
      <Scene caption="① The inspectors walked thousands of broken AI shops">
        <div className="mx-auto max-w-sm rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <span className="text-3xl">📋</span>
          <p className="mt-2 text-sm font-semibold text-ink">
            They wrote down the <span className="font-bold">ten most common ways</span> AI apps
            get hurt — the same failures, again and again.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">Updated every couple of years. Free to read.</p>
        </div>
      </Scene>

      {/* SCENE 2 — a few rows, plainly */}
      <Scene caption="② A few rows from the checklist, in plain words">
        <Stagger className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <ChecklistRow n={1} name="Hidden instructions" plain="the app obeys text from strangers (prompt injection)" />
          <ChecklistRow n={2} name="Sensitive info leaks" plain="private data walks out through answers or logs" />
          <ChecklistRow n={3} name="Over-powered helpers" plain="AI assistants given far more keys than their job needs" />
          <ChecklistRow n={4} name="Untrusted output" plain="whatever the model writes gets believed and run" />
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Six more rows — same idea: the doors from lesson one, ranked by how often they fail.
        </p>
      </Scene>

      {/* SCENE 3 — how teams use it */}
      <Scene caption="③ How a real team uses a checklist">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🚶</span>
              <p className="mt-1 text-[11px] font-semibold text-ink">Walk every row against your own app</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">📊</span>
              <p className="mt-1 text-[11px] font-semibold text-ink">Rank what you find by damage it could do</p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="rounded-xl border border-ash bg-surface-elevated p-3 text-center shadow-sm">
              <span className="text-xl">🔧</span>
              <p className="mt-1 text-[11px] font-semibold text-ink">Fix the top rows first — not all ten at once</p>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 4 — the boundary */}
      <Scene caption="④ What a checklist is not">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            A list <span className="font-bold">names</span> risks. It doesn&apos;t fix them —
            and it can&apos;t know <span className="font-bold">your</span> shop&apos;s quirks.
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            Your job: read it, then walk your own doors. The list is the starting whistle, not the race.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          The Top Ten is the industry&apos;s{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">shared map of broken doors</span> —
          walk it against your app, then fix by rank.
        </p>
      </Card>
    </Infographic>
  );
}
