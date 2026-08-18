"use client";

import { useState } from "react";
import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Reveal } from "./motion";

/**
 * AI Observability: Reliability — Lesson 12: "Agent and tool-use observability".
 *
 * Click-to-elaborate (CER): the agent-specific signals a plain LLM trace misses —
 * tool-call success, loop/retry depth, budget exhaustion, state transitions, MCP
 * spans, and trace-graph anomalies. Reduced-motion-safe.
 */
type SigId = "task" | "tool" | "loop" | "budget" | "mcp" | "graph";

interface Sig {
  id: SigId;
  name: string;
  watch: string;
}

const SIGS: readonly Sig[] = [
  { id: "task", name: "Task / agent span", watch: "One span per agent goal, parenting its tool and LLM children — the unit you attribute cost and failure to." },
  { id: "tool", name: "Tool-call success", watch: "Per tool: call count, success rate, latency, arg validity. A tool that 502s looks like a bad model without this." },
  { id: "loop", name: "Loop / retry depth", watch: "How many times the agent retried before succeeding. Climbing retry depth is the leading indicator of a stuck agent." },
  { id: "budget", name: "Budget exhaustion", watch: "Token, step, and time budgets per task. Hitting the ceiling mid-task produces truncated, low-quality outputs." },
  { id: "mcp", name: "MCP spans", watch: "Model Context Protocol tool calls across servers — attribute each to its server and trace the handoff, not just the call." },
  { id: "graph", name: "Trace-graph anomalies", watch: "The agent's call graph shape (fan-out, cycles) is itself a signal — a novel cycle is often a bug before it's a failure." },
];

export function AgentToolObservability() {
  const [sel, setSel] = useState<SigId>("loop");
  const s = SIGS.find((x) => x.id === sel)!;

  return (
    <Infographic>
      <InfographicHeader
        title="Agent and tool-use observability"
        subtitle="Click each signal a plain LLM trace misses."
      />
      <Reveal>
        <div className="rounded-2xl border border-ash bg-surface-elevated px-4 py-4 shadow-sm sm:px-6 sm:py-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SIGS.map((x) => {
              const on = x.id === sel;
              return (
                <button key={x.id} type="button" onClick={() => setSel(x.id)} aria-pressed={on}
                  className={`focus-ring rounded-lg border px-2 py-2 text-left transition-colors ${on ? "border-brand bg-brand-wash" : "border-ash bg-canvas hover:border-ash"}`}>
                  <span className={`text-[11px] font-bold leading-tight ${on ? "text-brand" : "text-ink"}`}>{x.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-ash bg-canvas px-3 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{s.name} · what to watch</span>
            <p className="mt-1 text-xs font-medium text-ink">{s.watch}</p>
          </div>
        </div>
      </Reveal>
      <Card tone="brand" rotate={0}>
        <Takeaway>
          An agent isn't one LLM call — it's a graph of tool calls, loops, and
          budgets. Observe the graph, or you'll debug a node and miss the cycle.
        </Takeaway>
      </Card>
    </Infographic>
  );
}
