"use client";

import { useByteProgress } from "@/lib/data/provider";

/**
 * A tiny completion indicator for a course lesson on the course landing page.
 * Mirrors `app/bytes/ByteStatus.tsx` but uses the `course:` progress key.
 *
 * Returns nothing while loading or if the lesson is unseen, a ✓ once completed.
 */
export function LessonStatus({ progressKey }: { progressKey: string }) {
  const progress = useByteProgress(progressKey);
  if (!progress || progress.status !== "completed") return null;
  return (
    <span
      aria-label="Completed"
      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-good text-xs font-bold text-canvas"
    >
      ✓
    </span>
  );
}
