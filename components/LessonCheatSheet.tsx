"use client";

import { useState } from "react";
import { Inline } from "@/components/Inline";
import { SITE_NAME } from "@/lib/site";

/**
 * The shareable cheat-sheet card (v6 skill §4.7), rendered after the closing
 * MCQs. Mirrors the downloadable PNG (`/courses/[course]/[lesson]/cheat-sheet`)
 * and the lesson's OG image: anchor → What → When NOT → site URL. Derived from
 * the lesson's `concept` data — the marketing surface costs no authoring.
 */
export function LessonCheatSheet({
  courseTitle,
  lessonTitle,
  anchor,
  what,
  whenNot,
  path,
  url,
}: {
  courseTitle: string;
  lessonTitle: string;
  anchor: string;
  what: string;
  whenNot: string;
  path: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareText = `${lessonTitle} — a ${SITE_NAME} cheat sheet`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/older browsers) — the URL is shown
      // on the card below; leave the button in its resting state.
    }
  }

  return (
    <section
      aria-label="Cheat sheet"
      className="mt-10 rounded-2xl border border-ash bg-surface-elevated px-5 py-5 shadow-sm sm:px-6"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink">
          Cheat sheet
        </h2>
        <p className="text-xs text-ink-soft">
          Yours to keep — post it, pin it, or bring it to the standup.
        </p>
      </div>

      {/* Card preview — the on-page mirror of the PNG. */}
      <div className="rounded-xl border border-ash bg-canvas p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-ink">
            {SITE_NAME}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-brand-deep">
            Cheat sheet · {courseTitle}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold tracking-tight text-ink sm:text-xl">
          {lessonTitle}
        </h3>
        <p className="mt-3 border-l-4 border-gold pl-3 text-sm italic leading-relaxed text-ink sm:text-[15px]">
          <Inline text={anchor} />
        </p>
        <dl className="mt-4 space-y-2 text-[13px] leading-relaxed text-ink-soft sm:text-sm">
          <div className="flex gap-3">
            <dt className="shrink-0 font-bold text-ink">What</dt>
            <dd className="min-w-0">
              <Inline text={what} />
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="shrink-0 font-bold text-ink">When not</dt>
            <dd className="min-w-0">
              <Inline text={whenNot} />
            </dd>
          </div>
        </dl>
        <p className="mt-4 border-t border-ash pt-3 text-xs font-semibold text-brand-deep">
          {url.replace(/^https?:\/\//, "")}
        </p>
      </div>

      {/* Share actions — real actions, never dead links. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={`${path}/cheat-sheet`}
          download={`cheat-sheet-${path.split("/").pop()}.png`}
          className="focus-ring min-h-[36px] rounded-full bg-brand px-4 py-2 text-xs font-bold text-canvas transition-colors hover:opacity-90"
        >
          ↓ Download PNG
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring min-h-[36px] rounded-full border border-ash bg-surface-elevated px-4 py-2 text-xs font-bold text-ink transition-colors hover:border-brand"
        >
          Share on X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring min-h-[36px] rounded-full border border-ash bg-surface-elevated px-4 py-2 text-xs font-bold text-ink transition-colors hover:border-brand"
        >
          Share on LinkedIn
        </a>
        <button
          type="button"
          onClick={copyLink}
          aria-live="polite"
          className="focus-ring min-h-[36px] rounded-full border border-ash bg-surface-elevated px-4 py-2 text-xs font-bold text-ink transition-colors hover:border-brand"
        >
          {copied ? "✓ Link copied" : "Copy link"}
        </button>
      </div>
    </section>
  );
}
