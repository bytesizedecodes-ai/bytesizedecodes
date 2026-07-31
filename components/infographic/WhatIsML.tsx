import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
  BulletList,
} from "./primitives";

/**
 * Lesson infographic: "What is Machine Learning?"
 *
 * The original was a hub-and-spoke: four cards around a central circle, plus a
 * horizontal pipeline. On phones the hub-and-spoke collapses to a centred hub
 * card above a single-column list; on >=lg the four ML-approach cards sit two
 * per row flanking the hub.
 */
export function WhatIsML() {
  return (
    <Infographic>
      <InfographicHeader
        title="What is Machine Learning?"
        subtitle="Teaching machines to learn from data — like humans learn from experience"
      />

      {/* Hub */}
      <div className="flex justify-center">
        <div className="flex w-full max-w-md flex-col items-center rounded-full bg-brand px-8 py-7 text-center shadow-md sm:py-8">
          <div className="mb-1 text-4xl" aria-hidden="true">🧠</div>
          <h3 className="text-xl font-extrabold leading-tight sm:text-2xl">
            Machine Learning
          </h3>
          <p className="mt-1 text-xs font-medium text-ink sm:text-sm">
            Data + Algorithm = Intelligence
          </p>
        </div>
      </div>

      {/* Definition */}
      <Card tone="brandWash" rotate={-0.3}>
        <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
          <strong className="font-bold">Machine Learning</strong> is a technique
          to implement AI that can{" "}
          <strong className="font-bold">learn from data by itself</strong> —
          without being explicitly programmed.
        </p>
      </Card>

      {/* Four ML approaches */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <Card tone="white" rotate={0.5}>
          <CardTitle icon="🔍">What ML Can Do</CardTitle>
          <BulletList
            items={[
              "Recognise objects (car vs bike)",
              "Predict future prices",
              "Understand language & grammar",
              "Recognise faces",
            ]}
          />
        </Card>
        <Card tone="ash" rotate={-0.5}>
          <CardTitle icon="📊">Supervised Learning</CardTitle>
          <BulletList
            items={[
              "Learns from labelled data",
              "Classification → categories",
              "Regression → numbers",
            ]}
          />
        </Card>
        <Card tone="white" rotate={-0.5}>
          <CardTitle icon="🔎">Unsupervised Learning</CardTitle>
          <BulletList
            items={[
              "No labels needed",
              "Finds hidden patterns",
              "Groups similar data",
            ]}
          />
        </Card>
        <Card tone="ash" rotate={0.5}>
          <CardTitle icon="🎯">Reinforcement Learning</CardTitle>
          <BulletList
            items={[
              "Learns by trial & error",
              "Reward for good actions",
              "Penalty for bad actions",
            ]}
          />
        </Card>
      </div>

      {/* Pipeline */}
      <Card tone="white" rotate={-0.3}>
        <h3 className="mb-3 text-center text-base font-bold sm:mb-4 sm:text-lg">
          ⚙️ How Machine Learning Works
        </h3>
        <ol className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-2">
          {[
            { icon: "📥", label: "Collect data" },
            { icon: "⚙️", label: "Run algorithm" },
            { icon: "🔍", label: "Find patterns" },
            { icon: "🧠", label: "Learn rules" },
            { icon: "✅", label: "Make decision", final: true },
          ].map((step, i, arr) => (
            <li key={step.label} className="contents">
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold sm:flex-col sm:gap-1 sm:py-4 ${
                  step.final
                    ? "bg-brand-deep text-canvas"
                    : "bg-brand text-ink"
                } ${step.final ? "sm:scale-105" : ""}`}
              >
                <span className="text-xl" aria-hidden="true">
                  {step.icon}
                </span>
                <span className="capitalize">{step.label}</span>
              </div>
              {i < arr.length - 1 && (
                <span
                  className="mx-auto text-xl font-bold text-ink sm:mx-0"
                  aria-hidden="true"
                >
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </Card>
    </Infographic>
  );
}
