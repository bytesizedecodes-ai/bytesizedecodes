"use client";

import { ByteBody } from "@/components/ByteBody";
import type { Byte } from "@/content";

/**
 * Thin wrapper that feeds a `Byte` into the shared `ByteBody`.
 *
 * Preserves the original itemKey/progress keying exactly:
 *  - byte progress row keyed by the raw slug (`gradient-descent`)
 *  - per-question attempt itemKey prefixed `byte:${slug}` (`byte:gradient-descent:q1`)
 */
export function ByteRunner({ byte }: { byte: Byte }) {
  return (
    <ByteBody
      progressSlug={byte.slug}
      attemptPrefix={`byte:${byte.slug}`}
      topic={byte.topic}
      questions={byte.questions}
      exercise={byte.exercise}
    />
  );
}
