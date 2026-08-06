import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Internal design-comparison drafts — never meant for search results or
 * public linking. robots.ts disallows /samples for crawlers; this noindex
 * is defense-in-depth in case a page here is ever linked or crawled anyway.
 * Delete this whole directory once a direction is promoted to the live `/`.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SamplesLayout({ children }: { children: ReactNode }) {
  return children;
}
