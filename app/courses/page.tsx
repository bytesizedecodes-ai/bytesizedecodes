import Link from "next/link";
import { Shell } from "@/components/Shell";
import { COURSES } from "@/content/courses";

/**
 * Courses hub — the page the top-nav "Courses" link points to.
 *
 * Lists every course from the registry as a card. With one course this is a
 * single card; the layout is ready for many.
 */
export default function CoursesHubPage() {
  return (
    <Shell active="/courses">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-wide text-brand">
            Courses
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Pick a path
          </h1>
          <p className="max-w-2xl text-ink-soft">
            Each course is a sequence of short, visual lessons. Use the arrows at
            the bottom of each lesson to walk through in order.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-4">
          {COURSES.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="card group block px-5 py-4 transition-colors hover:bg-brand-wash"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-ink">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">{course.subtitle}</p>
                  <p className="mt-2 text-xs font-medium text-ink-faint">
                    {course.lessons.length} lessons
                  </p>
                </div>
                <span className="flex-shrink-0 self-center text-ink-faint transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-ink-faint">
          Phase 0 preview · more courses land as the season progresses.
        </p>
      </div>
    </Shell>
  );
}
