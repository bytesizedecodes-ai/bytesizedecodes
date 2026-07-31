"use client";

import { ByteBody } from "@/components/ByteBody";
import type { ByteQuestion, CodeExercise, SkillId } from "@/content";

/**
 * Renders the prose + interactive byte body for a course lesson.
 *
 * Client component because `ByteBody` is interactive. The prose is plain text
 * (no inline markdown needed at the lesson level — kept simple on purpose).
 * `today` is read via `useToday()` inside `ByteBody`, so it isn't a prop here.
 */
export function LessonBody({
  progressKey,
  attemptPrefix,
  topic,
  prose,
  exercise,
  questions,
  skillIds,
}: {
  progressKey: string;
  attemptPrefix: string;
  topic: string;
  prose: string[];
  exercise?: CodeExercise;
  questions: ByteQuestion[];
  skillIds?: readonly SkillId[];
}) {
  return (
    <>
      <section className="space-y-3">
        {prose.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-ink-soft">
            {p}
          </p>
        ))}
      </section>

      <ByteBody
        progressSlug={progressKey}
        attemptPrefix={attemptPrefix}
        topic={topic}
        questions={questions}
        exercise={exercise}
        skillIds={skillIds}
      />
    </>
  );
}
