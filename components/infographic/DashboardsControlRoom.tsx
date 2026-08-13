import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { PersonFigure, Scene } from "./scenes";

/**
 * AI Observability — Lesson 11: "Dashboards — the control room".
 *
 * Beginner calibration: a dashboard is the one screen you glance at to know if a
 * system is healthy — like an airplane cockpit. The aha is that a good
 * dashboard shows the FEW numbers that matter, big and clear, not everything at
 * once. Scene 2 contrasts a cluttered dashboard (many tiny readings — a glance
 * tells you nothing) with a clear one (three big readings). Brand accent only.
 */
export function DashboardsControlRoom() {
  return (
    <Infographic>
      <InfographicHeader
        title="Dashboards: the control room"
        subtitle="One screen you can glance at and know: are we healthy?"
      />

      {/* ① The cockpit idea */}
      <Scene caption="① A dashboard is the one screen you glance at">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <PersonFigure label="on call" />
          <div className="rounded-xl border border-ash bg-canvas px-4 py-3">
            <div className="grid grid-cols-3 gap-3">
              <BigGauge label="Latency" value="1.4s" />
              <BigGauge label="Errors" value="0.3%" />
              <BigGauge label="Cost/d" value="$48" />
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Like a cockpit: every reading earns its place, and a single glance is enough.
        </p>
      </Scene>

      {/* ② Good vs bad */}
      <Scene caption="② Show the few things that matter — not everything">
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

      <Card tone="brand" rotate={0}>
        <Takeaway>
          A good dashboard isn’t ‘show everything’ — it’s ‘show the right few
          things, big and clear, so one glance tells you if you’re healthy’.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function BigGauge({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-surface-elevated px-2 py-1.5">
      <span className={`font-bold text-ink ${small ? "text-sm" : "text-lg"}`}>{value}</span>
      <span className="text-[9px] font-bold uppercase tracking-wide text-ink-soft">{label}</span>
    </div>
  );
}
