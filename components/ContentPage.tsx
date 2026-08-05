import type { ReactNode } from "react";
import { formatLegalDate } from "@/lib/site";

/**
 * Shared chrome for About / Contact / Privacy / Terms:
 * eyebrow, title, optional last-updated, readable body width.
 */
export function ContentPage({
  eyebrow,
  title,
  description,
  showLastUpdated = false,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  showLastUpdated?: boolean;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="border-b border-ash pb-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">{description}</p>
        ) : null}
        {showLastUpdated ? (
          <p className="mt-4 text-xs font-medium text-ink-faint">
            Last updated {formatLegalDate()}
          </p>
        ) : null}
      </header>
      <div className="content-prose mt-10 space-y-8 text-sm leading-relaxed text-ink-soft sm:text-[15px]">
        {children}
      </div>
    </article>
  );
}

/** Section heading inside ContentPage bodies. */
export function ContentSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      {children}
    </section>
  );
}
