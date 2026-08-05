import type { JSX } from "react";

/**
 * Emits a `<script type="application/ld+json">` block for structured data.
 *
 * Server component — the JSON-LD renders into the initial HTML so search
 * engines see it without executing JavaScript. Pass a schema.org object (or
 * an array of them) and it is serialized verbatim.
 *
 * The serialized JSON is escaped so a `</script>` sequence inside any value cannot
 * terminate this block early and inject executable script. `JSON.stringify` alone
 * does not escape `<` or `/`, so this guard is required even though today `data`
 * only contains authored content.
 */
export function JsonLd({ data }: { data: object | object[] }): JSX.Element {
  const html = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: html }} />;
}
