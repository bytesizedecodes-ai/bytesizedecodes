/**
 * Site-wide constants — the single source of truth for the production origin
 * and brand strings. Used by metadata, canonical URLs, sitemap, robots, and
 * OpenGraph image generation so the domain lives in exactly one place.
 *
 * Update SITE_URL here when the production domain changes.
 */

/** Production origin, without a trailing slash. */
export const SITE_URL = "https://bytesizedecodes.com";

/** Brand / product name. */
export const SITE_NAME = "ByteSizeDecodes";

/** Default meta description used when a page doesn't override it. */
export const SITE_DESCRIPTION =
  "Visual AI lessons, intelligent practice, spaced review, and goal-based paths for beginners, students, professionals, and founders.";

/** Short tagline used in OG images and the home title. */
export const SITE_TAGLINE = "Learn AI visually. Practise it. Build something real.";

/** Public contact address (mailto + form notifications). */
export const CONTACT_EMAIL = "bytesizedecodes@gmail.com";

/**
 * Effective date shown on Privacy / Terms (“Last updated”).
 * Bump when you materially change legal copy.
 */
export const SITE_LEGAL_UPDATED = "2026-08-05";

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/** Format SITE_LEGAL_UPDATED for display (e.g. “5 August 2026”). */
export function formatLegalDate(iso = SITE_LEGAL_UPDATED): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
