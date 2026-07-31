import { getByte } from "./index";
import { getLesson } from "./courses";
import type { ByteQuestion } from "./types";
import type { AuthoredReviewCard } from "@/lib/data/types";

export interface ResolvedAuthoredReview {
  question: ByteQuestion;
  sourceTitle: string;
  sourceHref: string;
}

export function resolveAuthoredReview(
  card: AuthoredReviewCard,
): ResolvedAuthoredReview | null {
  if (card.source === "byte" && card.slug) {
    const byte = getByte(card.slug);
    const question = byte?.questions.find((item) => item.id === card.questionId);
    if (!byte || !question) return null;
    return {
      question,
      sourceTitle: byte.title,
      sourceHref: `/bytes/${byte.slug}`,
    };
  }

  if (card.source === "course" && card.courseSlug && card.lessonSlug) {
    const found = getLesson(card.courseSlug, card.lessonSlug);
    const question = found?.lesson.questions?.find((item) => item.id === card.questionId);
    if (!found || !question) return null;
    return {
      question,
      sourceTitle: found.lesson.title,
      sourceHref: `/courses/${card.courseSlug}/${card.lessonSlug}`,
    };
  }

  return null;
}
