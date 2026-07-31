import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { CoursePager } from "@/components/CoursePager";
import { getInfographicComponent } from "@/components/infographic";
import {
  allCourseSlugs,
  courseLessonKey,
  getCourse,
  getLesson,
  type Course,
} from "@/content/courses";
import { LessonBody } from "./LessonBody";

export function generateStaticParams() {
  return allCourseSlugs().flatMap((course) =>
    getCourse(course)!.lessons.map((lesson) => ({ course, lesson: lesson.slug })),
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLesson(courseSlug, lessonSlug);
  if (!found) notFound();
  const { course, lesson, index } = found;

  const Infographic = getInfographicComponent(lesson.slug);
  if (!Infographic) {
    throw new Error(
      `No infographic component registered for lesson "${lesson.slug}". ` +
        `Add it to components/infographic/index.tsx.`,
    );
  }

  const progressKey = courseLessonKey(courseSlug, lessonSlug);
  const hasQuestions = (lesson.questions?.length ?? 0) > 0;

  const prev = index > 0 ? lessonAt(course, index - 1) : null;
  const next = index < course.lessons.length - 1 ? lessonAt(course, index + 1) : null;

  return (
    <Shell active={`/courses/${courseSlug}`}>
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/courses/${courseSlug}`}
          className="text-sm text-ink-faint hover:text-ink-soft"
        >
          ← {course.title}
        </Link>

        <header className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-brand-deep">
            Lesson {index + 1} of {course.lessons.length} · {course.title}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {lesson.title}
          </h1>
          <p className="mt-2 text-sm text-ink-soft sm:text-[15px]">{lesson.blurb}</p>

          {/* Byte chip — signals this is a Hook-loop Action, not just reading */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-wash px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-deep">
              Byte · {lesson.minutes ?? 5} min
            </span>
            {hasQuestions && (
              <span className="rounded-full bg-ash px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                {lesson.questions!.length} questions
              </span>
            )}
            {hasQuestions && (
              <span className="rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                +XP on complete
              </span>
            )}
          </div>
        </header>

        {/* Infographic — the visual core of the byte */}
        <div className="mt-6">
          <Infographic />
        </div>

        {/* Prose + interactive byte body (questions, code, XP) */}
        <div className="mt-10 space-y-6">
          {lesson.prose && lesson.prose.length > 0 && (
            <LessonBody
              progressKey={progressKey}
              attemptPrefix={progressKey}
              topic={lesson.topic}
              prose={lesson.prose}
              exercise={lesson.exercise}
              questions={lesson.questions ?? []}
            />
          )}
        </div>

        <CoursePager courseSlug={courseSlug} prev={prev} next={next} />
      </div>
    </Shell>
  );
}

function lessonAt(course: Course, index: number) {
  const lesson = course.lessons[index];
  if (!lesson) return null;
  return { slug: lesson.slug, title: lesson.title };
}
