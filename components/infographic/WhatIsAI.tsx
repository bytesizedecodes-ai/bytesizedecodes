import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
  Tag,
} from "./primitives";

/**
 * Lesson infographic: "What is Artificial Intelligence?"
 *
 * Responsive rewrite of the original fixed-1200px HTML. On phones the
 * comparison stacks to a single column; on >=sm it sits side by side with a VS
 * badge in the gap.
 */
export function WhatIsAI() {
  return (
    <Infographic>
      <InfographicHeader
        title="What is Artificial Intelligence?"
        subtitle="The branch of CS that builds machines which can think"
      />

      {/* Definition */}
      <Card tone="brand" rotate={-0.3}>
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">🤖</span>
          <p className="text-base font-semibold leading-snug sm:text-lg">
            <strong className="font-extrabold">Artificial Intelligence</strong>{" "}
            is a branch of Computer Science concerned with building machines that
            are <strong className="font-extrabold">smart &amp; intelligent</strong>{" "}
            — ones that can reason, learn, and decide like a human would.
          </p>
        </div>
      </Card>

      {/* Comparison */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="relative">
          <Card tone="white" rotate={-0.5} className="h-full">
            <div className="-mx-5 -mt-4 mb-3 rounded-t-xl bg-ash px-5 py-3 text-center sm:-mx-6 sm:-mt-5">
              <h3 className="text-lg font-bold text-ink sm:text-xl">
                Non-intelligent Machines
              </h3>
              <p className="text-xs font-normal text-ink sm:text-sm">
                They follow instructions — nothing more
              </p>
            </div>
            <ul className="space-y-0">
              {[
                "Do only what they're programmed to",
                "Can't learn from new data on their own",
                "Same input → same output, always",
                "No understanding, no reasoning",
              ].map((t) => (
                <li
                  key={t}
                  className="relative border-b border-dot py-2.5 pl-6 text-sm font-medium leading-snug text-ink last:border-0 sm:text-[15px]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2.5 text-base font-extrabold text-ink"
                  >
                    ✕
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Tag>Calculator</Tag>
              <Tag>Washing machine</Tag>
              <Tag>Plain software</Tag>
            </div>
          </Card>
        </div>

        <div className="relative">
          <Card tone="white" rotate={0.5} className="h-full">
            <div className="-mx-5 -mt-4 mb-3 rounded-t-xl bg-brand px-5 py-3 text-center sm:-mx-6 sm:-mt-5">
              <h3 className="text-lg font-bold text-ink sm:text-xl">
                Intelligent Machines
              </h3>
              <p className="text-xs font-normal text-ink sm:text-sm">
                They think, learn, and adapt
              </p>
            </div>
            <ul className="space-y-0">
              {[
                "Learn from data & experience",
                "Reason and make decisions",
                "Understand language, images, speech",
                "Improve without being reprogrammed",
              ].map((t) => (
                <li
                  key={t}
                  className="relative border-b border-dot py-2.5 pl-6 text-sm font-medium leading-snug text-ink last:border-0 sm:text-[15px]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2.5 text-base font-extrabold text-ink"
                  >
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Tag>ChatGPT</Tag>
              <Tag>Face unlock</Tag>
              <Tag>Self-driving cars</Tag>
              <Tag>Recommendations</Tag>
            </div>
          </Card>

          {/* VS badge — only meaningful in the side-by-side layout */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
            <div className="flex h-14 w-14 rotate-[-3deg] items-center justify-center rounded-full border-[3px] border-brand bg-canvas text-base font-bold text-ink">
              VS
            </div>
          </div>
        </div>
      </div>

      {/* Goal: Think / Learn / Act */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Card tone="white" rotate={0.4}>
          <div className="mb-1 text-2xl" aria-hidden="true">🧠</div>
          <CardTitle>Think</CardTitle>
          <p className="text-xs font-medium leading-snug text-ink sm:text-sm">
            Reason through problems the way a person would.
          </p>
        </Card>
        <Card tone="white" rotate={-0.4}>
          <div className="mb-1 text-2xl" aria-hidden="true">📚</div>
          <CardTitle>Learn</CardTitle>
          <p className="text-xs font-medium leading-snug text-ink sm:text-sm">
            Pick up patterns from data instead of explicit rules.
          </p>
        </Card>
        <Card tone="white" rotate={0.4}>
          <div className="mb-1 text-2xl" aria-hidden="true">🎯</div>
          <CardTitle>Act</CardTitle>
          <p className="text-xs font-medium leading-snug text-ink sm:text-sm">
            Make smart decisions to reach a goal.
          </p>
        </Card>
      </div>
    </Infographic>
  );
}
