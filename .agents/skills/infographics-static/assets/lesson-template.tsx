/**
 * TEMPLATE — copy this file to components/infographic/<PascalName>.tsx to start
 * a new infographic lesson. Replace WHAT-IS-FOO / Foo throughout.
 *
 * After creating the component:
 *   1. Register in components/infographic/index.tsx
 *   2. Add the lesson entry in content/courses.ts
 * See references/workflow-checklist.md.
 */

import {
  Infographic,
  InfographicHeader,
  Card,
  CardTitle,
  BulletList,
  Tag,
} from "./primitives";

export function WhatIsFoo() {
  return (
    <Infographic>
      <InfographicHeader
        title="What is Foo?"
        subtitle="A one-line essence of the concept"
      />

      {/* Definition card — the headline takeaway */}
      <Card tone="brand" rotate={-0.3}>
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">
            🎯
          </span>
          <p className="text-base font-semibold leading-snug sm:text-lg">
            <strong className="font-extrabold">Foo</strong> is{" "}
            <strong className="font-extrabold">the key definition</strong> —
            stated in one sentence.
          </p>
        </div>
      </Card>

      {/* Two-column comparison that stacks on mobile */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <Card tone="white" rotate={-0.5}>
          <CardTitle icon="✓">Right way</CardTitle>
          <BulletList
            items={["Point one", "Point two", "Point three"]}
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Tag>Example A</Tag>
            <Tag>Example B</Tag>
          </div>
        </Card>
        <Card tone="ash" rotate={0.5}>
          <CardTitle icon="✕">Common mistake</CardTitle>
          <BulletList
            items={["What goes wrong", "Why it's tempting", "How to spot it"]}
          />
        </Card>
      </div>

      {/* Optional: a takeaway strip */}
      <Card tone="white" rotate={0.3}>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold sm:text-lg">
          <span aria-hidden="true">💡</span> How to remember it
        </h3>
        <p className="text-sm font-medium leading-relaxed text-ink-soft sm:text-[15px]">
          One sentence that sticks. The kind of thing you'd whisper to yourself
          in an interview.
        </p>
      </Card>
    </Infographic>
  );
}
