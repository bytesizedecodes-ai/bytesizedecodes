import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Security in Practice — Lesson 1: "Threat-model an app".
 * Case: PaisaShield's one-page threat model. Assets, adversaries, doors,
 * ranked — the page every later lesson annotates.
 */
export function ThreatModelAnApp() {
  return (
    <Infographic>
      <InfographicHeader
        title="Threat-model an app"
        subtitle="PaisaShield, page one: what's worth stealing, who wants it, through which door"
      />

      {/* SCENE 1 — the case */}
      <Scene caption="① The case: PaisaShield">
        <div className="mx-auto max-w-lg rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-ink">
            <span className="rounded-full bg-brand-wash px-2.5 py-1">reads support tickets</span>
            <span className="rounded-full bg-ash px-2.5 py-1">retrieves policy wiki</span>
            <span className="rounded-full bg-ash px-2.5 py-1">drafts replies</span>
            <span className="rounded-full bg-brand-wash px-2.5 py-1">refunds up to ₹5,000</span>
          </div>
          <p className="mt-3 text-center text-xs font-medium text-ink-soft">
            A fintech chat assistant. Ten lessons from now it will have a full defense stack —
            page one is the threat model.
          </p>
        </div>
      </Scene>

      {/* SCENE 2 — assets and adversaries */}
      <Scene caption="② The two columns every threat model opens with">
        <Stagger className="mx-auto grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
              <p className="text-xs font-bold text-ink">Assets — what hurts when taken</p>
              <ul className="mt-1.5 space-y-1 text-[11px] font-medium text-ink-soft">
                <li>• card numbers &amp; customer PII in tickets</li>
                <li>• refund money (₹5,000 per shot)</li>
                <li>• company voice (replies go out as us)</li>
              </ul>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="h-full rounded-xl border border-ash bg-surface-elevated p-3 shadow-sm">
              <p className="text-xs font-bold text-ink">Adversaries — who wants them</p>
              <ul className="mt-1.5 space-y-1 text-[11px] font-medium text-ink-soft">
                <li>• fraud rings (money, via crafted tickets)</li>
                <li>• data scrapers (PII, via any door that leaks)</li>
                <li>• pranksters / researchers (everything, for the story)</li>
              </ul>
            </div>
          </MotionChild>
        </Stagger>
      </Scene>

      {/* SCENE 3 — doors × damage grid */}
      <Scene caption="③ Doors ranked by damage × reachability">
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl border border-ash bg-surface-elevated shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 border-b border-ash bg-ash/60 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
            <span>door</span><span>damage</span><span>rank</span>
          </div>
          {[
            ["ticket text → assistant (injection)", "high", 1],
            ["refund tool (money moves)", "high", 2],
            ["replies sent as the company", "high", 3],
            ["policy wiki writes (poisoning)", "med", 4],
            ["logs (PII memory)", "med", 5],
          ].map(([door, dmg, rank]) => (
            <div key={door as string} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 px-3 py-1.5 text-[11px] font-medium text-ink">
              <span>{door}</span>
              <span className="text-ink-soft">{dmg}</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-wash text-[10px] font-bold text-ink">{rank}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          Rank <span className="font-bold">before</span> building: rows 1–3 are where every defense hour goes.
        </p>
      </Scene>

      {/* SCENE 4 — the ladder's ground */}
      <Scene caption="④ Why this page beats a checklist">
        <div className="mx-auto max-w-md rounded-xl border border-ash bg-surface-elevated p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-ink">
            A checklist asks “do I have X?” A threat model asks{" "}
            <span className="font-bold">“who is coming through which door, for what?”</span>
          </p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            The answer changes when the product does — date it, revisit it, annotate it every lesson.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          Assets × adversaries × doors, ranked by damage —{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">one page</span> that decides
          where every defense hour goes.
        </p>
      </Card>
    </Infographic>
  );
}
