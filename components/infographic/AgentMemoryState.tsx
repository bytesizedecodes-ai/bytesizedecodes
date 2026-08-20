import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * Harness Engineering: In Practice — Lesson 4: "Memory and State".
 *
 * Course case: Relay must remember ticket facts across a long conversation.
 * Beat 1: episodic (the raw transcript) vs semantic (the distilled facts) —
 * two stores, drawn as notebook vs archive card. Beat 2: compaction — the
 * history pile folded into a summary note that survives the window. Beat 3:
 * where state lives: in-window (re-sent), external (looked up), and the rule
 * for choosing. Intermediate density; brand accent only.
 */
export function AgentMemoryState() {
  return (
    <Infographic>
      <InfographicHeader
        title="Two kinds of remembering"
        subtitle="Relay can re-read the whole ticket — or carry a note that survives the window."
      />

      {/* Scene 1 — episodic vs semantic */}
      <Scene caption="① The transcript vs the facts">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">Episodic — the transcript</div>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-ink-soft">
                10:02 &ldquo;where is my order&rdquo; · 10:04 lookup · 10:09 &ldquo;the box was
                damaged&rdquo; · 10:15 photo sent · …
              </p>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-ink-soft">
                Perfect fidelity, heavy, and it <span className="font-bold text-ink">dies with the window</span> —
                old turns fall out mid-ticket.
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">Semantic — the facts</div>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-ink">
                order #4821 · damaged on arrival · photo on file · customer prefers email
              </p>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-ink-soft">
                Compact, durable, <span className="font-bold text-ink">re-pinned every turn</span> —
                40 tokens that outlive message 400.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 2 — compaction */}
      <Scene caption="② Compaction: folding the pile into the note">
        <Stagger className="flex flex-col items-center gap-2">
          <MotionChild>
            <div className="w-full max-w-md rounded-xl border border-ash bg-surface-elevated px-4 py-3 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                turns 1–30 · 3,200 tokens
              </div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                greeting · order question · lookup · damage report · photo · policy quote ·
                two escalations · …
              </p>
            </div>
          </MotionChild>
          <MotionChild>
            <div className="text-lg font-bold text-ink-soft" aria-hidden="true">↓ compact</div>
          </MotionChild>
          <MotionChild>
            <div className="w-full max-w-md rounded-xl border border-brand bg-brand-wash px-4 py-3 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wide text-brand">
                summary note · 45 tokens
              </div>
              <p className="mt-1 text-[11px] font-semibold leading-relaxed text-ink">
                Order #4821 arrived damaged (photo on file). Refund under €200 pre-approved
                by policy. Customer told a replacement ships this week.
              </p>
            </div>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium text-ink-soft">
          The pile leaves the window; <span className="font-bold text-ink">the promises stay</span>.
        </p>
      </Scene>

      {/* Scene 3 — where state lives */}
      <Scene caption="③ The rule: window for working, store for truth">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">In the window</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                What this turn needs: pinned facts, recent turns, live tool results.
                Fast, expensive per token, gone when the turn ends.
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <div className="text-sm font-bold text-ink">In an external store</div>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">
                What must survive: customer profile, order history, past tickets.
                Durable, cheap, fetched back through a tool when needed.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Memory is engineered: transcripts compact into facts, facts get pinned, and
          durable truth lives in a store — not in the window.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
