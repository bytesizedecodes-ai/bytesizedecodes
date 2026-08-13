import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, BulletList } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Observability — Lesson 12: "Cost and speed — the two big bills".
 *
 * Beginner calibration: every AI feature pays two bills — cost (tokens used)
 * and latency (time taken) — just like a taxi meter charges for distance and
 * time. Scene 1 introduces the two bills via the taxi-meter analogy. Scene 2
 * shows they trade off (bigger call → more of both; smaller call → less).
 * Scene 3 explains why each matters to a business. Brand accent only.
 */
export function CostAndSpeed() {
  return (
    <Infographic>
      <InfographicHeader
        title="Cost and speed: the two big bills"
        subtitle="Every AI feature pays in tokens and in time"
      />

      {/* ① The taxi meter: distance + time */}
      <Scene caption="① Like a taxi meter, two things tick at once">
        <div className="flex justify-center">
          <TaxiMeter />
        </div>
        <div className="mx-auto mt-3 grid max-w-sm grid-cols-2 gap-3">
          <BillCard icon="tokens" label="Cost" body="Tokens read and written — like distance travelled." />
          <BillCard icon="clock" label="Latency" body="Time to a full answer — like minutes on the road." />
        </div>
      </Scene>

      {/* ② They trade off */}
      <Scene caption="② They rise and fall together">
        <div className="flex items-center justify-center gap-3 py-2">
          <span className="rounded-xl border border-ash bg-surface-elevated px-3 py-2 text-center">
            <span className="block text-xs font-bold text-ink-soft">small call</span>
            <span className="block text-sm font-bold text-brand">cheap · fast</span>
          </span>
          <span className="text-2xl font-bold text-ink">⇄</span>
          <span className="rounded-xl border border-ash bg-surface-elevated px-3 py-2 text-center">
            <span className="block text-xs font-bold text-ink-soft">big call</span>
            <span className="block text-sm font-bold text-brand">pricey · slow</span>
          </span>
        </div>
        <p className="mt-2 text-center text-xs font-medium text-ink-soft">
          A bigger, more capable answer tends to cost more <em>and</em> take longer. The two travel together.
        </p>
      </Scene>

      {/* ③ Why each matters to a business */}
      <Scene caption="③ Why a business cares about both">
        <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MotionChild>
            <ReasonCard title="Cost eats margin" body="Every token costs money. Unwatched, a chatty feature can wipe out your profit." />
          </MotionChild>
          <MotionChild>
            <ReasonCard title="Latency loses users" body="People abandon slow apps. An extra second of waiting quietly drives customers away." />
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Cost and latency are the two bills every AI feature pays — and
          watching them is a business decision, not just a technical one.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function TaxiMeter() {
  return (
    <svg viewBox="0 0 150 70" className="h-20 w-auto text-brand" aria-hidden="true">
      {/* meter body */}
      <rect x="20" y="10" width="110" height="48" rx="6" fill="var(--color-surface-elevated)" stroke="currentColor" strokeWidth="2.5" />
      {/* screen */}
      <rect x="28" y="18" width="94" height="32" rx="3" fill="var(--screen)" opacity="0.85" />
      {/* distance + time readouts */}
      <text x="36" y="34" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="bold" fill="var(--color-brand)">DIST 4.2</text>
      <text x="36" y="46" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="bold" fill="var(--color-brand)">TIME 0.9</text>
      {/* taxi sign on top */}
      <rect x="62" y="3" width="26" height="8" rx="2" fill="currentColor" />
    </svg>
  );
}

function BillCard({ icon, label, body }: { icon: "tokens" | "clock"; label: string; body: string }) {
  return (
    <div className="flex h-full items-start gap-2 rounded-xl border border-ash bg-surface-elevated px-3 py-2 text-left">
      <span className="mt-0.5 text-brand">
        {icon === "tokens" ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 3 L12 6 M12 18 L12 21 M3 12 L6 12 M18 12 L21 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12,7 12,12 15,14" />
          </svg>
        )}
      </span>
      <div>
        <div className="text-sm font-bold text-ink">{label}</div>
        <div className="text-xs font-medium text-ink-soft">{body}</div>
      </div>
    </div>
  );
}

function ReasonCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex h-full flex-col gap-1.5 rounded-xl border border-ash bg-surface-elevated px-4 py-3">
      <CardTitle icon="✦">{title}</CardTitle>
      <BulletList items={[body]} />
    </div>
  );
}
