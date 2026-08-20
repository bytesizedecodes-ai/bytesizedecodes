import { Infographic, InfographicHeader, Card, CardTitle, Takeaway, Tag } from "./primitives";
import { Scene } from "./scenes";
import { Reveal } from "./motion";

/**
 * Harness Engineering: In Practice — Lesson 2: "Designing Tools Models Use Well".
 *
 * Course case: Relay's tool menu. Two surfaces side by side — the sprawling
 * 20-tool menu the model chooses badly from, vs the sharp 3-tool surface with
 * a real description and an error message that teaches. The third beat shows
 * the error-message-as-feedback idea (a bad arg message that corrects the next
 * call). Comparison grid reveals as one block. Brand accent on the sharp side;
 * no semantic colors needed — sprawl is the villain, drawn in neutrals.
 */
export function ToolDesign() {
  return (
    <Infographic>
      <InfographicHeader
        title="A menu the model can actually read"
        subtitle="Same model. Twenty tools or three — watch the choice quality flip."
      />

      {/* Scene 1 — the two surfaces */}
      <Scene caption="① Relay's tool menu, before and after the redesign">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 shadow-sm">
              <Tag tone="neutral">v1 · 20 tools</Tag>
              <ul className="mt-2 space-y-1 font-mono text-[11px] leading-relaxed text-ink-soft">
                <li>search_database · get_data · find_records</li>
                <li>lookup_order · order_info · get_order_v2</li>
                <li>refund · do_refund · process_refund</li>
                <li>policy_search · search_policy · faq · …8 more</li>
              </ul>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-ink-soft">
                Three tools do the same job; descriptions say &ldquo;gets data&rdquo;. The model
                guesses — and guesses wrong 1 call in 8.
              </p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 shadow-sm">
              <Tag tone="brand" dot>v2 · 3 tools</Tag>
              <ul className="mt-2 space-y-1.5 text-[11px] font-medium leading-relaxed text-ink">
                <li>
                  <span className="font-mono font-bold">lookup_order(order_id)</span>
                  <span className="block text-ink-soft">
                    &ldquo;Fetch one order&apos;s status, items, and delivery dates.&rdquo;
                  </span>
                </li>
                <li>
                  <span className="font-mono font-bold">issue_refund(order_id, amount, reason)</span>
                  <span className="block text-ink-soft">
                    &ldquo;Refund under €200. Above that, returns a needs_approval result.&rdquo;
                  </span>
                </li>
                <li>
                  <span className="font-mono font-bold">policy_lookup(topic)</span>
                  <span className="block text-ink-soft">
                    &ldquo;Get the current refund/delivery policy clause for a topic.&rdquo;
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </Scene>

      {/* Scene 2 — what actually changed */}
      <Scene caption="② The three upgrades hiding in that redesign">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Upgrade title="One job per name" note="No near-synonyms to arbitrate — the model picks by purpose, not by vibe." />
            <Upgrade title="Descriptions that decide" note="Say what it returns and when to use it — the model reads these every single call." accent />
            <Upgrade title="Constraints in the open" note="The €200 limit lives in the description — the model learns the rule before breaking it." />
          </div>
        </Reveal>
      </Scene>

      {/* Scene 3 — the error message that teaches */}
      <Scene caption="③ The most under-designed string in your harness">
        <Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl border border-ash bg-surface-elevated p-4 font-mono text-[11px] leading-relaxed shadow-sm">
              <div className="font-bold text-ink-soft">error: invalid argument</div>
              <p className="mt-1 text-ink-faint">// says nothing. the model retries</p>
              <p className="text-ink-faint">// the same wrong call. loop.</p>
            </div>
            <div className="rounded-xl border border-brand bg-brand-wash p-4 font-mono text-[11px] leading-relaxed shadow-sm">
              <div className="font-bold text-ink">error: order_id must be 4 digits + #</div>
              <p className="mt-1 text-ink-soft">{`you passed "482" — try "#4821"`}</p>
              <p className="mt-1 text-[10px] font-medium text-ink">
                // the next call comes back correct. the error taught it.
              </p>
            </div>
          </div>
        </Reveal>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The takeaway</CardTitle>
        <Takeaway>
          Tool design is interface design for a model: one job per name, deciding
          descriptions, and error messages that teach the next call.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One upgrade card from the redesign. */
function Upgrade({
  title,
  note,
  accent = false,
}: {
  title: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        accent ? "border-brand bg-brand-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-sm font-bold text-ink">{title}</div>
      <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}
