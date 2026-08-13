import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Observability — Lesson 13: "The observability toolkit".
 *
 * Beginner calibration: you don’t build observability from scratch — you bolt
 * on a tool that collects the signals for you (like wearing a fitness tracker
 * rather than building a heart-rate monitor). A friendly tour of common tools,
 * one line each — no deep dives. Names are accurate but deliberately general;
 * the message is “pick one when you’re ready”. Brand accent only.
 */
type ToolCategory = "trace" | "log" | "gauge" | "chart" | "grid";

const TOOLS: { name: string; category: ToolCategory; job: string }[] = [
  { name: "Langfuse", category: "trace", job: "Traces and evaluates LLM apps (open source)." },
  { name: "Phoenix (Arize)", category: "trace", job: "Traces and evals for AI, with a friendly UI." },
  { name: "Helicone", category: "log", job: "Logs every LLM call — and its cost — as it passes through." },
  { name: "Datadog", category: "gauge", job: "Metrics, logs, and alerts for any software, AI included." },
  { name: "Weights & Biases", category: "chart", job: "Tracks ML experiments and model-training metrics." },
  { name: "Grafana", category: "grid", job: "Turns your metrics into dashboards." },
];

export function ObservabilityToolkit() {
  return (
    <Infographic>
      <InfographicHeader
        title="The observability toolkit"
        subtitle="You don’t build this from scratch — you bolt on a tool"
      />

      {/* ① The idea: fit a tracker, don't build one */}
      <Scene caption="① Like wearing a fitness tracker, not building one">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <TrackerIcon />
          <span className="max-w-xs text-center text-sm font-medium text-ink-soft">
            A tool collects the logs, metrics, and traces for you. Your job is to read them, not build the instruments.
          </span>
        </div>
      </Scene>

      {/* ② A friendly tour */}
      <Scene caption="② Common tools, one job each">
        <Stagger className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <MotionChild key={t.name}>
              <ToolCard name={t.name} category={t.category} job={t.job} />
            </MotionChild>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink-soft">
          Don’t memorise the list. The point is: a tool already exists for the job you need.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Pick one tool that fits your stack, start simple, and let it collect
          the signals — you can always refine or switch later.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function TrackerIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 text-brand" aria-hidden="true">
      {/* watch body */}
      <rect x="18" y="16" width="28" height="32" rx="7" fill="var(--color-surface-elevated)" stroke="currentColor" strokeWidth="2.5" />
      {/* straps */}
      <rect x="24" y="6" width="16" height="10" rx="2" fill="currentColor" opacity="0.6" />
      <rect x="24" y="48" width="16" height="10" rx="2" fill="currentColor" opacity="0.6" />
      {/* little heartbeat line on the face */}
      <polyline points="22,33 28,33 31,26 35,40 38,33 42,33" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToolCard({ name, category, job }: { name: string; category: ToolCategory; job: string }) {
  return (
    <div className="flex h-full items-start gap-3 rounded-xl border border-ash bg-surface-elevated px-4 py-3 text-left">
      <span className="mt-0.5 shrink-0 text-brand">
        <CategoryIcon category={category} />
      </span>
      <div>
        <div className="text-sm font-bold text-ink">{name}</div>
        <div className="text-xs font-medium text-ink-soft">{job}</div>
      </div>
    </div>
  );
}

function CategoryIcon({ category }: { category: ToolCategory }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (category) {
    case "trace":
      return (
        <svg {...common}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="14" y2="12" />
          <line x1="4" y1="18" x2="18" y2="18" />
        </svg>
      );
    case "log":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      );
    case "gauge":
      return (
        <svg {...common}>
          <path d="M4 16 A8 8 0 0 1 20 16" />
          <line x1="12" y1="16" x2="16" y2="11" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <polyline points="4,18 9,12 13,15 20,6" />
          <line x1="4" y1="20" x2="20" y2="20" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="6" height="6" />
          <rect x="14" y="4" width="6" height="6" />
          <rect x="4" y="14" width="6" height="6" />
          <rect x="14" y="14" width="6" height="6" />
        </svg>
      );
  }
}
