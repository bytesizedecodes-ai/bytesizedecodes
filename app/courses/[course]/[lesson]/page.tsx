import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { ConceptBrief } from "@/components/ConceptBrief";
import { CoursePager } from "@/components/CoursePager";
import { JsonLd } from "@/components/JsonLd";
import { LessonCheatSheet } from "@/components/LessonCheatSheet";
import { LessonDiagram } from "@/components/LessonDiagram";
import { ReadingProgress } from "@/components/ReadingProgress";
import { getInfographicComponent } from "@/components/infographic";
import { PaidLessonGate } from "@/components/PaidLessonGate";
import {
  allCourseSlugs,
  courseLessonKey,
  getCourse,
  getLesson,
  NEXT_COURSE,
  type Course,
} from "@/content/courses";
import { absoluteUrl } from "@/lib/site";
import { getSkill } from "@/content/skills";
import { LessonBody } from "./LessonBody";

export function generateStaticParams() {
  return allCourseSlugs().flatMap((course) =>
    getCourse(course)!.lessons.map((lesson) => ({ course, lesson: lesson.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLesson(courseSlug, lessonSlug);
  if (!found) return {};
  // Paid lesson bodies are soft-gated (sign-in) and not full-indexed — the
  // course index stays public. See docs/monetization-and-subscription.md.
  const robots =
    found.course.access === "paid" ? { index: false, follow: true } : undefined;
  return {
    title: found.lesson.title,
    description: found.lesson.blurb,
    alternates: { canonical: `/courses/${courseSlug}/${lessonSlug}` },
    ...(robots ? { robots } : {}),
  };
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

  // At the reward moment, momentum should carry the learner forward: to the
  // next lesson, or — on the final lesson — straight into the next course.
  const nextCourse = NEXT_COURSE[courseSlug];
  const nextLesson = next
    ? { href: `/courses/${courseSlug}/${next.slug}`, title: next.title }
    : nextCourse
      ? {
          href: `/courses/${nextCourse.slug}`,
          title: getCourse(nextCourse.slug)?.title ?? nextCourse.slug,
          label: "Course complete · up next",
        }
      : { href: `/courses/${courseSlug}`, title: `Back to ${course.title}`, label: "Course complete" };

  return (
    <Shell active={`/courses/${courseSlug}`}>
      <ReadingProgress />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: lesson.title,
          description: lesson.blurb,
          isPartOf: {
            "@type": "Course",
            name: course.title,
            url: absoluteUrl(`/courses/${courseSlug}`),
          },
          url: absoluteUrl(`/courses/${courseSlug}/${lessonSlug}`),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Courses", item: absoluteUrl("/courses") },
            {
              "@type": "ListItem",
              position: 2,
              name: course.title,
              item: absoluteUrl(`/courses/${courseSlug}`),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: lesson.title,
              item: absoluteUrl(`/courses/${courseSlug}/${lessonSlug}`),
            },
          ],
        }}
      />
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
          {lesson.capability && (
            <p className="mt-4 rounded-xl border border-brand-muted bg-brand-wash px-4 py-3 text-sm text-ink-soft">
              <span className="font-semibold text-ink">By the end:</span>{" "}
              {lesson.capability}
            </p>
          )}

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
                +Energy on complete
              </span>
            )}
            {(lesson.skillIds ?? []).map((skillId) => (
              <span
                key={skillId}
                title={getSkill(skillId).description}
                className="rounded-full border border-brand-muted px-2.5 py-1 text-[11px] font-medium text-ink-soft"
              >
                {getSkill(skillId).label}
              </span>
            ))}
          </div>
        </header>

        {lesson.concept && (
          <div className="mt-6">
            <ConceptBrief brief={lesson.concept} />
          </div>
        )}

        {(() => {
          // The lesson core: infographic → diagram → prose/questions → pager.
          // Paid courses gate this whole block behind free sign-in; the header
          // and concept brief above stay public as the teaser.
          const core = (
            <>
              <div className="mt-6">
                <Infographic />
              </div>

              {lesson.diagram && <LessonDiagram diagram={lesson.diagram} />}

              <div className="mt-10 space-y-6">
                <LessonBody
                  progressKey={progressKey}
                  attemptPrefix={progressKey}
                  topic={lesson.topic}
                  prose={lesson.prose ?? []}
                  exercise={lesson.exercise}
                  questions={lesson.questions ?? []}
                  skillIds={lesson.skillIds}
                  capability={lesson.capability}
                  nextLesson={nextLesson}
                />
              </div>

              {lesson.concept && (
                <LessonCheatSheet
                  courseTitle={course.title}
                  lessonTitle={lesson.title}
                  anchor={lesson.concept.anchor}
                  what={lesson.concept.what}
                  whenNot={lesson.concept.whenNot}
                  path={`/courses/${courseSlug}/${lessonSlug}`}
                  url={absoluteUrl(`/courses/${courseSlug}/${lessonSlug}`)}
                />
              )}

              <CoursePager
                courseSlug={courseSlug}
                courseTitle={course.title}
                prev={prev}
                next={next}
              />
            </>
          );
          if (course.access === "paid") {
            return (
              <PaidLessonGate redirectTo={`/courses/${courseSlug}/${lessonSlug}`}>
                {core}
              </PaidLessonGate>
            );
          }
          return core;
        })()}
      </div>
    </Shell>
  );
}

function lessonAt(course: Course, index: number) {
  const lesson = course.lessons[index];
  if (!lesson) return null;
  return { slug: lesson.slug, title: lesson.title };
}
