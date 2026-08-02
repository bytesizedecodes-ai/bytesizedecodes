import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { JsonLd } from "@/components/JsonLd";
import { allCourseSlugs, courseLessonKey, getCourse } from "@/content/courses";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { LessonStatus } from "./LessonStatus";
import { CourseResumeButton } from "./CourseResumeButton";

export function generateStaticParams() {
  return allCourseSlugs().map((course) => ({ course }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course: courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.subtitle,
    alternates: { canonical: `/courses/${courseSlug}` },
  };
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.title,
          description: course.subtitle,
          provider: {
            "@type": "EducationalOrganization",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "online",
            courseWorkload: `PT${course.lessons.reduce(
              (sum, lesson) => sum + (lesson.minutes ?? 5),
              0,
            )}M`,
          },
        }}
      />
      <div className="mx-auto max-w-3xl">
        <Link href="/courses" className="text-sm text-ink-faint hover:text-ink-soft">
          ← All courses
        </Link>

        <header className="mt-4 flex flex-col gap-2">
          <p className="text-sm font-medium capitalize tracking-wide text-brand">
            Course · {course.domain} · {course.level}
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
            <CourseResumeButton course={course} />
          </div>
        )}

        <p className="mt-8 text-xs text-ink-faint">
          Each lesson combines a visual explanation with an active check and saved progress.
        </p>
      </div>
    </Shell>
  );
}
