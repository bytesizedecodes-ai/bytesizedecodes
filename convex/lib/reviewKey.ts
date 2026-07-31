import { parseDrillKey, type Difficulty } from "./parseDrillKey";

export type ReviewKey =
  | { kind: "generator"; generatorId: string; difficulty: Difficulty }
  | { kind: "authored"; source: "byte"; slug: string; questionId: string }
  | {
      kind: "authored";
      source: "course";
      courseSlug: string;
      lessonSlug: string;
      questionId: string;
    };

export function parseReviewKey(itemKey: string): ReviewKey | null {
  const drill = parseDrillKey(itemKey);
  if (drill) return { kind: "generator", ...drill };

  const byteMatch = /^byte:([^:]+):([^:]+)$/.exec(itemKey);
  if (byteMatch) {
    return {
      kind: "authored",
      source: "byte",
      slug: byteMatch[1]!,
      questionId: byteMatch[2]!,
    };
  }

  const courseMatch = /^course:([^:]+):([^:]+):([^:]+)$/.exec(itemKey);
  if (courseMatch) {
    return {
      kind: "authored",
      source: "course",
      courseSlug: courseMatch[1]!,
      lessonSlug: courseMatch[2]!,
      questionId: courseMatch[3]!,
    };
  }

  return null;
}
