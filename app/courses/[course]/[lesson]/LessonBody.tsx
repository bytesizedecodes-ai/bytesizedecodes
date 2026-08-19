"use client";

import { ByteBody } from "@/components/ByteBody";
import { Inline } from "@/components/Inline";
import type { ByteQuestion, CodeExercise, SkillId } from "@/content";

/**
 * Renders the prose + interactive byte body for a course lesson.
 *
 * Client component because `ByteBody` is interactive. Prose supports the
 * shared inline highlight syntax (**bold** and `code`) via `Inline`.
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
  capability,
  nextLesson,
}: {
  progressKey: string;
  attemptPrefix: string;
  topic: string;
  prose: string[];
  exercise?: CodeExercise;
  questions: ByteQuestion[];
  skillIds?: readonly SkillId[];
  capability?: string;
  nextLesson?: { href: string; title: string; label?: string };
}) {
  return (
    <>
      <section className="space-y-3">
        {prose.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-ink-soft">
            <Inline text={p} />
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
        capability={capability}
        nextLesson={nextLesson}
      />
    </>
  );
}
