import { Infographic, InfographicHeader, Card, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild } from "./motion";

/**
 * AI Observability — Lesson 14: "A day in the life" (capstone).
 *
 * Beginner calibration: a single narrative ties the whole course together.
 * Four beats — launch → alert → investigate → fix — show how logs, metrics,
 * traces, dashboards, and alerts combine into one loop. The lesson earns the
 * capstone application prompt. Brand marks healthy states; red marks the single
 * problem beat (the alert), consistent with the rest of the course.
 */
export function DayInTheLife() {
  return (
    <Infographic>
      <InfographicHeader
        title="A day in the life of an AI team"
        subtitle="Everything from this course, in one story"
      />

      <Scene caption="One loop: watch → alert → trace → log → fix">
        <Stagger className="flex flex-col gap-3">
          <MotionChild>
            <Beat n={1} title="Launch" tone="brand" body="A team ships an AI feature. Logs, metrics, and traces flow; the dashboard reads healthy." icon="launch" />
          </MotionChild>
          <MotionChild>
            <Beat n={2} title="Alert" tone="bad" body="Weeks later, an alert fires: the error rate has climbed past the threshold." icon="bell" />
          </MotionChild>
          <MotionChild>
            <Beat n={3} title="Investigate" tone="brand" body="A trace pinpoints the failing step. The logs reveal why — a knowledge source quietly changed." icon="trace" />
          </MotionChild>
          <MotionChild>
            <Beat n={4} title="Fix" tone="brand" body="They fix the cause and watch the metric recover on the dashboard. The loop begins again." icon="tick" />
          </MotionChild>
        </Stagger>
      </Scene>

      <Card tone="brand" rotate={0}>
        <Takeaway>
          Observability isn’t one tool — it’s a loop: keep watching, let alerts
          catch the quiet problems, trace and log to find the cause, fix, repeat.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

function Beat({
  n,
  title,
  body,
  tone,
  icon,
}: {
  n: number;
  title: string;
  body: string;
  tone: "brand" | "bad";
  icon: "launch" | "bell" | "trace" | "tick";
}) {
  const accent = tone === "bad" ? "text-[var(--color-bad)]" : "text-brand";
  return (
    <div className="flex items-start gap-3 rounded-xl border border-ash bg-surface-elevated px-4 py-3">
      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-bold ${accent}`}>
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={accent}><BeatIcon name={icon} /></span>
          <span className="text-sm font-bold text-ink">{title}</span>
        </div>
        <p className="mt-0.5 text-xs font-medium leading-relaxed text-ink-soft">{body}</p>
      </div>
    </div>
  );
}

function BeatIcon({ name }: { name: "launch" | "bell" | "trace" | "tick" }) {
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
  switch (name) {
    case "launch":
      return (
        <svg {...common}>
          <path d="M12 3 C16 7 17 12 17 16 L7 16 C7 12 8 7 12 3 Z" />
          <circle cx="12" cy="11" r="1.6" />
          <path d="M9 19 L8 21 M15 19 L16 21" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path d="M6 16 V11 a6 6 0 0 1 12 0 V16 l2 3 H4 Z" />
          <path d="M10 20 a2 2 0 0 0 4 0" />
        </svg>
      );
    case "trace":
      return (
        <svg {...common}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="13" y2="12" />
          <line x1="4" y1="18" x2="17" y2="18" />
        </svg>
      );
    case "tick":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="8,12 11,15 16,9" />
        </svg>
      );
  }
}
