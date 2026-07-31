import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { allCourseSlugs, courseLessonKey, getCourse } from "@/content/courses";
import { LessonStatus } from "./LessonStatus";

export function generateStaticParams() {
  return allCourseSlugs().map((course) => ({ course }));
}

export default async function CourseIndexPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  return (
    <Shell active={`/courses/${courseSlug}`}>
      <div className="mx-auto max-w-3xl">
        <Link href="/today" className="text-sm text-ink-faint hover:text-ink-soft">
          ← All courses
        </Link>

        <header className="mt-4 flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-wide text-brand">
            Course
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            {course.title}
          </h1>
          <p className="max-w-2xl text-ink-soft">{course.subtitle}</p>
          {course.description && (
            <p className="mt-1 max-w-2xl text-[15px] text-ink-soft">
              {course.description}
            </p>
          )}
        </header>

        <ol className="mt-8 flex flex-col gap-3">
          {course.lessons.map((lesson, index) => (
            <li key={lesson.slug}>
              <Link
                href={`/courses/${courseSlug}/${lesson.slug}`}
                className="card group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-brand-wash"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-wash text-sm font-semibold text-brand-deep">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-ink">
                    {lesson.title}
                  </span>
                  <span className="block truncate text-[13px] text-ink-soft">
                    {lesson.blurb}
                  </span>
                </span>
                <LessonStatus
                  progressKey={courseLessonKey(courseSlug, lesson.slug)}
                />
                <span className="flex-shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {course.lessons[0] && (
          <div className="mt-8">
            <Link
              href={`/courses/${courseSlug}/${course.lessons[0].slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-canvas transition-colors hover:bg-brand-deep"
            >
              Start the course →
            </Link>
          </div>
        )}

        <p className="mt-8 text-xs text-ink-faint">
          Phase 0 preview · more lessons land as the season progresses.
        </p>
      </div>
    </Shell>
  );
}
