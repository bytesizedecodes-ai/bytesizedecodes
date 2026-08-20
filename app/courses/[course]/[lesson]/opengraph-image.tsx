import { getCourse, getLesson } from "@/content/courses";
import { OG_CONTENT_TYPE, OG_SIZE, renderCheatSheetImage, renderOgImage } from "@/lib/og";
import { absoluteUrl } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Per-lesson OG image — the v6 cheat-sheet card (anchor → What → When NOT →
 * URL), so pasting the lesson URL anywhere previews a shareable summary.
 * Falls back to the plain title card when a lesson has no concept brief.
 */
export default async function LessonOgImage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLesson(courseSlug, lessonSlug);
  const course = found?.course ?? getCourse(courseSlug);
  const title = found?.lesson.title ?? "Lesson";
  const kicker = course ? `Cheat sheet · ${course.title}` : "Lesson";
  if (found?.lesson.concept) {
    return renderCheatSheetImage({
      kicker,
      title,
      anchor: found.lesson.concept.anchor,
      what: found.lesson.concept.what,
      whenNot: found.lesson.concept.whenNot,
      url: absoluteUrl(`/courses/${courseSlug}/${lessonSlug}`),
    });
  }
  return renderOgImage({ title, kicker });
}
