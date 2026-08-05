"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Course } from "@/content/courses";
import { COURSE_ACCESS, COURSE_DOMAINS, COURSE_LEVELS } from "@/content/courses";
import { CourseCard } from "./CourseCard";

/**
 * Domain + level + access filter bar plus the filtered course grid.
 * Filter state lives in the URL (`?domain=&level=&access=`).
 */
export function CourseFilters({ courses }: { courses: readonly Course[] }) {
  return (
    <Suspense fallback={<GridSkeleton courses={courses} />}>
      <CourseFiltersContent courses={courses} />
    </Suspense>
  );
}

function CourseFiltersContent({ courses }: { courses: readonly Course[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeDomain = searchParams.get("domain");
  const activeLevel = searchParams.get("level");
  const activeAccess = searchParams.get("access");

  function setFilter(key: "domain" | "level" | "access", value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.replace(qs ? `/courses?${qs}` : "/courses", { scroll: false });
  }

  const filtered = courses.filter(
    (course) =>
      (!activeDomain || course.domain === activeDomain) &&
      (!activeLevel || course.level === activeLevel) &&
      (!activeAccess || course.access === activeAccess),
  );

  return (
    <div>
      <div className="space-y-2">
        <FilterRow
          label="Domain"
          options={["All", ...COURSE_DOMAINS]}
          active={activeDomain ?? "All"}
          onSelect={(value) => setFilter("domain", value)}
        />
        <FilterRow
          label="Level"
          options={["All", ...COURSE_LEVELS]}
          active={activeLevel ?? "All"}
          onSelect={(value) => setFilter("level", value)}
          capitalize
        />
        <FilterRow
          label="Access"
          options={["All", ...COURSE_ACCESS]}
          active={activeAccess ?? "All"}
          onSelect={(value) => setFilter("access", value)}
          capitalize
        />
      </div>

      <div className="mt-3 text-xs text-ink-faint">
        {filtered.length} {filtered.length === 1 ? "course" : "courses"}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      ) : (
        <div className="card mt-4 p-10 text-center">
          <p className="text-sm font-medium text-ink">No courses match this filter yet</p>
          <p className="mt-1 text-sm text-ink-soft">
            Try a different domain, level, or access tier — or check back as we add more.
          </p>
          <button
            type="button"
            onClick={() => router.replace("/courses", { scroll: false })}
            className="focus-ring mt-4 inline-flex items-center rounded-xl border border-ash bg-surface-elevated px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-wash/40"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  active,
  onSelect,
  capitalize = false,
}: {
  label: string;
  options: readonly string[];
  active: string;
  onSelect: (value: string) => void;
  capitalize?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option)}
            className={`focus-ring rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              capitalize ? "capitalize" : ""
            } ${
              isActive
                ? "bg-ink text-canvas"
                : "bg-ash/70 text-ink-soft hover:bg-ash"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function GridSkeleton({ courses }: { courses: readonly Course[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: Math.max(2, Math.min(courses.length, 4)) }).map((_, index) => (
        <div key={index} className="card h-56 animate-pulse" />
      ))}
    </div>
  );
}
