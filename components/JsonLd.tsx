import type { JSX } from "react";

/**
 * Emits a `<script type="application/ld+json">` block for structured data.
 *
 * Server component — the JSON-LD renders into the initial HTML so search
 * engines see it without executing JavaScript. Pass a schema.org object (or
 * an array of them) and it is serialized verbatim.
 */
export function JsonLd({ data }: { data: object | object[] }): JSX.Element {
  return (
    <script
      type="application/ld+json"
      // `data` is an authored schema.org object, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
