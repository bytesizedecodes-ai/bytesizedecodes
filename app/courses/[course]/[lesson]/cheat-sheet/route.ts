import { getLesson } from "@/content/courses";
import { renderCheatSheetImage } from "@/lib/og";
import { absoluteUrl } from "@/lib/site";

/**
 * The per-lesson cheat-sheet PNG (v6 skill §4.7) — the shareable summary
 * card, generated from the lesson's `concept` data. Served inline (previewable
 * anywhere); the in-lesson Download button fetches it with the `download`
 * attribute. Stays public for paid lessons: the card carries less than the
 * concept brief, which is already the public teaser — sharing is the point.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ course: string; lesson: string }> },
) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLesson(courseSlug, lessonSlug);
  if (!found) {
    return new Response("Lesson not found", { status: 404 });
  }
  const { course, lesson } = found;
  return renderCheatSheetImage({
    kicker: `Cheat sheet · ${course.title}`,
    title: lesson.title,
    anchor: lesson.concept?.anchor,
    what: lesson.concept?.what,
    whenNot: lesson.concept?.whenNot,
    url: absoluteUrl(`/courses/${courseSlug}/${lessonSlug}`),
  });
}
