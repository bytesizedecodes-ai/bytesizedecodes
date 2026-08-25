"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { PersonFigure, Scene, StoryMap } from "./scenes";

/**
 * AI Observability — Lesson 11: "Dashboards — the control room"
 * (v2 Thread retrofit)
 *
 * Through-line stage: the SAME three Mitra tiles (latency, errors, cost/day),
 * the same spot, three states — healthy and glanceable (hook), crowded out by
 * forty tiny readings then slimmed back (compare, cluttered side acting as
 * the ghosted before), and finally one tile turned bad for Nisha to call
 * (interaction). The aha: fewer numbers, bigger and louder, is the job.
 * Brand accent only, plus one semantic bad tile that teaches "this is the
 * reading that shouts".
 */
type Verdict = "healthy" | "attention" | null;

export function DashboardsControlRoom() {
  const [verdict, setVerdict] = useState<Verdict>(null);

  return (
    <Infographic>
      <InfographicHeader
        title="Dashboards: the control room"
        subtitle="One screen you can glance at and know: are we healthy?"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">👁️</span>, label: "One glance is enough" },
          { icon: <span aria-hidden="true">🧹</span>, label: "Few, big, clear" },
          { icon: <span aria-hidden="true">🚨</span>, label: "Make the glance call" },
        ]}
      />

      {/* Anchor — the cockpit idea */}
      <Scene caption="So Nisha’s dashboard is the one screen she glances at — one glance is enough.">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <PersonFigure label="Nisha, on call" />
          <div className="rounded-xl border border-ash bg-canvas px-4 py-3">
            <div className="grid grid-cols-3 gap-3">
              <BigGauge label="Latency" value="1.4s" />
              <BigGauge label="Errors" value="0.3%" />
              <BigGauge label="Cost/d" value="$48" />
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Like a cockpit: every reading earns its place — it’s Mitra’s health at a glance.
        </p>
      </Scene>

      {/* Compare — few and big beats everything at once; cluttered = the ghosted before */}
      <Scene variant="continue" caption="But the common mistake is cramming — few, big, clear beats forty tiny.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-ash bg-canvas px-3 py-3">
            <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-ink-soft">
              cluttered
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="flex h-6 items-center justify-center rounded bg-ash font-mono text-[8px] text-ink-soft">
                  ··
                </span>
              ))}
            </div>
            <p className="mt-2 text-center text-[11px] font-medium text-ink-soft">too much — a glance says nothing</p>
          </div>
          <div className="rounded-xl border border-brand bg-brand-wash px-3 py-3">
            <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-brand">
              clear
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <BigGauge label="Latency" value="1.4s" small />
              <BigGauge label="Errors" value="0.3%" small />
              <BigGauge label="Cost/d" value="$48" small />
            </div>
            <p className="mt-2 text-center text-[11px] font-medium text-ink-soft">the few that matter — a glance is enough</p>
          </div>
        </div>
      </Scene>

      {/* Interaction — make the glance call yourself */}
      <Scene variant="continue" caption="Then make the glance call yourself — one tile is shouting.">
        <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wide text-brand-deep">
          Glance once, then pick a verdict
        </p>
        <div className="mx-auto w-fit rounded-xl border border-ash bg-canvas px-4 py-3">
          <div className="grid grid-cols-3 gap-3">
            <BigGauge label="Latency" value="1.5s" />
            <BigGauge label="Errors" value="3.1%" tone="bad" />
            <BigGauge label="Cost/d" value="$51" />
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {(
            [
              ["healthy", "Healthy — all good"],
              ["attention", "Something needs attention"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setVerdict(value)}
              aria-pressed={verdict === value}
              className={`focus-ring rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                verdict === value
                  ? "bg-brand text-ink"
                  : "border border-ash bg-surface-elevated text-ink-soft hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {verdict && (
          <p
            className={`mt-3 text-center text-xs font-medium ${
              verdict === "attention" ? "text-ink" : "text-ink-soft"
            }`}
          >
            {verdict === "attention" ? (
              <>Right — <strong>Errors 3.1%</strong> is ten times the usual 0.3%. Latency
              and cost look normal; the glance worked because the one reading that
              shouts is big and impossible to miss.</>
            ) : (
              <>Look again at <strong>Errors: 3.1%</strong> — ten times the usual 0.3%.
              Latency and cost are fine, but one tile is shouting. That&rsquo;s the
              reading that earned your attention.</>
            )}
          </p>
        )}
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          A good dashboard isn’t ‘show everything’ — it’s ‘show the right few
          things, big and clear, so one glance tells you if you’re healthy’.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function BigGauge({
  label,
  value,
  small = false,
  tone = "neutral",
}: {
  label: string;
  value: string;
  small?: boolean;
  tone?: "neutral" | "bad";
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg px-2 py-1.5 ${
        tone === "bad" ? "bg-bad-wash" : "bg-surface-elevated"
      }`}
    >
      <span
        className={`font-bold ${small ? "text-sm" : "text-lg"} ${
          tone === "bad" ? "text-bad" : "text-ink"
        }`}
      >
        {value}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-wide text-ink-soft">{label}</span>
    </div>
  );
}
