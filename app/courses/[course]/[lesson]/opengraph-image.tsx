import { getCourse, getLesson } from "@/content/courses";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Per-lesson OG image — lesson title + "Lesson · {course title}" kicker. */
export default async function LessonOgImage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLesson(courseSlug, lessonSlug);
  const course = found?.course ?? getCourse(courseSlug);
  const title = found?.lesson.title ?? "Lesson";
  const kicker = course ? `Lesson · ${course.title}` : "Lesson";
  return renderOgImage({ title, kicker });
}
