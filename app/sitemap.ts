import type { MetadataRoute } from "next";
import { COURSES } from "@/content/courses";
import { BYTES } from "@/content";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap — emits every indexable URL. Content routes (courses, lessons,
 * bytes) are derived from the content registries so new entries appear
 * automatically. Personalized routes (/today, /practice, /review, /progress,
 * /profile, /onboarding) are intentionally excluded: they require auth/state
 * and offer nothing to crawl.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/bytes`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const courseRoutes: MetadataRoute.Sitemap = COURSES.flatMap((course) => [
    {
      url: `${SITE_URL}/courses/${course.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...course.lessons.map((lesson) => ({
      url: `${SITE_URL}/courses/${course.slug}/${lesson.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);

  const byteRoutes: MetadataRoute.Sitemap = BYTES.map((byte) => ({
    url: `${SITE_URL}/bytes/${byte.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...byteRoutes];
}
