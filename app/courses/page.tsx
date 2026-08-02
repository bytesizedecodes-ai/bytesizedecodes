import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { PageHeader } from "@/components/ui/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { COURSES } from "@/content/courses";
import { absoluteUrl } from "@/lib/site";
import { CourseFilters } from "./CourseFilters";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Browse AI, machine learning, and cybersecurity courses. Filter by domain and level. Every course is visual, active, and tracks your progress.",
  alternates: { canonical: "/courses" },
};

/**
 * Courses catalog — browse every course by domain and level. Distinct from
 * `/learn`, which personalizes a lesson list by the user's track. Here a
 * learner scans the full catalog and filters to what suits them.
 */
export default function CoursesPage() {
  return (
    <Shell active="/courses">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: COURSES.map((course, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: course.title,
            url: absoluteUrl(`/courses/${course.slug}`),
          })),
        }}
      />
      <div className="mx-auto max-w-5xl">
        <PageHeader
          eyebrow="Courses"
          title="Find your next course"
          description="Visual lessons, active checks, and saved progress across Machine Learning, Cybersecurity, and AI. Filter by field and level, follow /learn's pick, or explore on your own."
        />
        <div className="mt-8">
          <CourseFilters courses={COURSES} />
        </div>
        <p className="mt-8 text-xs leading-relaxed text-ink-faint">
          Not sure where to start?{" "}
          <a href="/learn" className="font-medium underline hover:text-ink-soft">
            Let /learn pick
          </a>{" "}
          based on your current level.
        </p>
      </div>
    </Shell>
  );
}
