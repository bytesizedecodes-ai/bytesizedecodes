import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Flame, Star } from "lucide-react";

/**
 * Sample lesson page — dark theme (black + Twitter blue).
 * Shows what a real lesson route would look like if the dark theme were applied
 * across the app. Uses the "Inside supervised learning" content as a stand-in.
 */
export default function SampleLessonDarkPage() {
  const TW = "#1D9BF0";
  const cardBg = "#0d0d0f";
  const border = "#1f1f23";
  const fg = "#e7e7ea";
  const fgSoft = "#9b9ba3";
  const fgFaint = "#5b5b63";

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* nav */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{ borderBottom: `1px solid ${border}`, background: "rgba(0,0,0,0.8)" }}
      >
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/samples/landing-a" className="flex items-center gap-2.5 font-semibold tracking-tight" style={{ color: fg }}>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={{ background: TW }}
            >
              BSD
            </span>
            ByteSizeDecodes
          </Link>
          <div className="flex items-center gap-3 text-sm" style={{ color: fgSoft }}>
            <span className="inline-flex items-center gap-1">
              <Flame className="h-4 w-4" style={{ color: TW }} /> 7
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4" style={{ color: TW }} /> Lv 4
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* breadcrumb */}
        <Link href="/samples/landing-a" className="text-sm hover:opacity-80" style={{ color: fgFaint }}>
          ← Machine Learning for Layman
        </Link>

        {/* lesson header */}
        <header className="mt-4">
          <p className="text-sm font-medium capitalize" style={{ color: TW }}>
            Course · Machine Learning · intermediate
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: fg }}>
            Inside supervised learning
          </h1>
          <p className="mt-2" style={{ color: fgSoft }}>
            Samples + labels → a function → a category or a number
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs" style={{ color: fgFaint }}>
            <Clock3 className="h-3.5 w-3.5" /> 5 min · Lesson 5 of 19
          </div>
        </header>

        {/* prediction card (dark) */}
        <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: border, background: cardBg }}>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: fgFaint }}>
            Predict before you look
          </p>
          <p className="mt-2 text-sm font-medium" style={{ color: fg }}>
            Predicting a house price from examples of houses and their sale prices is…?
          </p>
          <div className="mt-3 space-y-2">
            {["Classification, because houses have categories", "Regression, because the output is a number"].map(
              (c, i) => (
                <button
                  key={c}
                  className="w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-colors hover:border-[var(--tw-blue)]"
                  style={{ borderColor: border, color: fgSoft }}
                >
                  {String.fromCharCode(97 + i)}. {c}
                </button>
              ),
            )}
          </div>
        </div>

        {/* infographic scene (dark) */}
        <figure
          className="mt-6 rounded-2xl border px-4 py-5 sm:px-6 sm:py-6"
          style={{ borderColor: border, background: cardBg }}
        >
          <figcaption className="mb-4 text-center text-sm font-bold sm:text-base" style={{ color: fg }}>
            ① Build a labelled training dataset
          </figcaption>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3">
            <div className="rounded-xl border p-3 text-center" style={{ borderColor: border, background: "#141416" }}>
              <CarSilhouette />
              <div className="mt-1 text-xs font-bold" style={{ color: fg }}>Samples</div>
              <div className="text-[11px]" style={{ color: fgSoft }}>the inputs</div>
            </div>
            <span className="text-2xl font-bold" style={{ color: fg }}>+</span>
            <div className="rounded-xl border p-3 text-center" style={{ borderColor: border, background: "#141416" }}>
              <div className="flex h-16 items-center justify-center gap-2">
                <span className="rounded-full px-2 py-1 text-[11px] font-bold text-white" style={{ background: fg }}>
                  car
                </span>
                <span className="rounded-full px-2 py-1 text-[11px] font-bold text-white" style={{ background: fg }}>
                  bike
                </span>
              </div>
              <div className="mt-1 text-xs font-bold" style={{ color: fg }}>Labels</div>
              <div className="text-[11px]" style={{ color: fgSoft }}>the answers</div>
            </div>
            <span className="text-2xl font-bold" style={{ color: fg }}>=</span>
            <div
              className="rounded-xl border p-3 text-center"
              style={{ borderColor: TW, background: "rgba(29,155,240,0.08)" }}
            >
              <div className="flex h-16 items-center justify-center gap-2">
                <CarSilhouette small />
                <BikeSilhouette small />
              </div>
              <div className="mt-1 text-xs font-bold" style={{ color: TW }}>Dataset</div>
              <div className="text-[11px]" style={{ color: fgSoft }}>inputs + answers</div>
            </div>
          </div>
        </figure>

        {/* prose (dark) */}
        <section className="mt-6 space-y-3">
          <p className="text-[15px] leading-relaxed" style={{ color: fgSoft }}>
            Once your samples are vectors with labels, you can build your first
            classifier with nothing more than counting.
          </p>
          <p className="text-[15px] leading-relaxed" style={{ color: fgSoft }}>
            Look at all the 4-wheel examples: if every one is a car, then a new
            4-wheel sample is almost certainly a car too.
          </p>
        </section>

        {/* check question (dark) */}
        <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: border, background: cardBg }}>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: TW }}>
            Check your understanding
          </p>
          <p className="mt-2 text-sm font-medium" style={{ color: fg }}>
            Predicting a house price from examples of houses and their sale prices is:
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm" style={{ borderColor: border, color: fgSoft }}>
              <span className="font-mono text-xs">a</span>
              Classification, because houses have categories
            </div>
            <div
              className="flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold"
              style={{ borderColor: TW, background: "rgba(29,155,240,0.08)", color: fg }}
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs">b</span>
                Regression, because the output is a number
              </span>
              <CheckCircle2 className="h-4 w-4" style={{ color: TW }} />
            </div>
          </div>
        </div>

        {/* pager (dark) */}
        <nav className="mt-8 flex items-center justify-between">
          <Link href="/samples/landing-a" className="text-sm hover:opacity-80" style={{ color: fgSoft }}>
            ← Previous
          </Link>
          <Link
            href="/samples/landing-a"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white"
            style={{ background: TW }}
          >
            Next: Inside unsupervised learning <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </main>
    </div>
  );
}

function CarSilhouette({ small = false }: { small?: boolean }) {
  const h = small ? "h-10" : "h-12";
  return (
    <svg viewBox="0 0 120 70" className={`${h} w-auto`} aria-hidden="true">
      <path
        d="M8 48 Q10 30 30 28 L42 18 Q60 14 78 18 L92 28 Q108 30 112 48 L112 54 Q112 58 108 58 L92 58 Q88 48 80 48 Q72 48 72 58 L48 58 Q44 48 40 48 Q32 48 32 58 L12 58 Q8 58 8 54 Z"
        fill="#1D9BF0"
        stroke="#0F8CD8"
        strokeWidth="2"
      />
      <circle cx="40" cy="56" r="9" fill="#3a2a1a" />
      <circle cx="80" cy="56" r="9" fill="#3a2a1a" />
    </svg>
  );
}

function BikeSilhouette({ small = false }: { small?: boolean }) {
  const h = small ? "h-10" : "h-12";
  return (
    <svg viewBox="0 0 120 80" className={`${h} w-auto`} aria-hidden="true">
      <circle cx="28" cy="56" r="18" fill="none" stroke="#0F8CD8" strokeWidth="3" />
      <circle cx="92" cy="56" r="18" fill="none" stroke="#0F8CD8" strokeWidth="3" />
      <path d="M28 56 L55 30 L75 30 L92 56 M55 30 L70 56 M75 30 L70 56" stroke="#1D9BF0" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
