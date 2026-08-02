import { getCourse } from "@/content/courses";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Per-course OG image — title + "{domain} · {level}" kicker. */
export default async function CourseOgImage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  const title = course?.title ?? "Course";
  const kicker = course ? `${course.domain} · ${course.level}` : undefined;
  return renderOgImage({ title, kicker });
}
