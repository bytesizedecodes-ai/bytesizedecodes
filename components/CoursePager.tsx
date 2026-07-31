import Link from "next/link";

/**
 * Prev / Next navigation between lessons in a course.
 *
 * `prev`/`next` carry the lesson to link to (or `null` at the ends of the
 * course). `next` always renders: when there is no next lesson it becomes a
 * "Finish" link back to the course landing page.
 */
export function CoursePager({
  courseSlug,
  prev,
  next,
}: {
  courseSlug: string;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}) {
  return (
    <nav className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/courses/${courseSlug}/${prev.slug}`}
          className="card group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-wash"
        >
          <span className="text-lg text-ink-faint transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-ink-faint">
              Previous
            </span>
            <span className="block truncate text-sm font-medium text-ink">
              {prev.title}
            </span>
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={`/courses/${courseSlug}/${next.slug}`}
          className="card group flex items-center justify-end gap-3 bg-brand-wash px-4 py-3 text-right transition-colors hover:bg-brand/15 sm:col-start-2"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-brand-deep">
              Next
            </span>
            <span className="block truncate text-sm font-medium text-ink">
              {next.title}
            </span>
          </span>
          <span className="text-lg text-brand-deep transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      ) : (
        <Link
          href={`/courses/${courseSlug}`}
          className="card group flex items-center justify-end gap-3 bg-brand px-4 py-3 text-right transition-transform hover:bg-brand-deep sm:col-start-2"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-canvas/80">
              Course complete
            </span>
            <span className="block text-sm font-medium text-canvas">
              Back to {courseTitle(courseSlug)}
            </span>
          </span>
          <span className="text-lg text-canvas">✓</span>
        </Link>
      )}
    </nav>
  );
}

// Avoid importing the registry into this client-safe component; the course title
// is passed implicitly via the slug. For the "finish" card we keep it generic.
function courseTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
