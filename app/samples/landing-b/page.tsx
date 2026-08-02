import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, Target, Trophy } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

/**
 * Landing Direction B — "Editorial light + product window".
 * Cream canvas, large headline, a realistic lesson-window mockup as the hero.
 * Reads: thoughtful, credible, education-first. Trust through transparency.
 */
export default function LandingBPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      {/* ===== Top nav ===== */}
      <header className="sticky top-0 z-40 border-b border-ash bg-canvas/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <BrandMark withAccent />
            <span>ByteSizeDecodes</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/courses" className="rounded-full px-3.5 py-2 text-ink-soft hover:bg-white/80 hover:text-ink">
              Courses
            </Link>
            <Link href="/learn" className="hidden rounded-full px-3.5 py-2 text-ink-soft hover:bg-white/80 hover:text-ink sm:inline">
              Learn
            </Link>
            <Link
              href="/onboarding"
              className="ml-1 rounded-full bg-ink px-4 py-2 font-medium text-white"
            >
              Start free
            </Link>
          </nav>
        </div>
      </header>

      {/* ===== Hero — split: copy left, product window right ===== */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20 sm:px-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-wash px-3 py-1 text-xs font-semibold text-brand-deep">
            <Eye className="h-3.5 w-3.5" />
            The visual way to learn AI
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Learn AI the way your
            <br />
            brain actually works.
          </h1>
          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
            Picture-led lessons. Real practice. Spaced review. One daily plan that
            fits the time you have — from 3 minutes to a deep session.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/88"
            >
              Start free — no login <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex min-h-12 items-center rounded-xl border border-ash bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-brand-muted"
            >
              Browse courses
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-faint">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-good" /> 100% free to learn
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-good" /> No login required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-good" /> Track your progress
            </span>
          </div>
        </div>

        {/* Product window mockup — looks like the real /today lesson card */}
        <div className="relative">
          <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-warm-wash blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-ash bg-white shadow-xl">
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-ash bg-canvas px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-bad/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warm/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-good/70" />
              <span className="ml-3 truncate text-xs text-ink-faint">today · machine learning for layman</span>
            </div>
            {/* the lesson */}
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
                Today · 5 minutes
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink">
                Find its neighbors: k-Nearest Neighbors
              </h2>
              <div className="mt-4 space-y-2">
                {["Recall one fading concept", "Practise one generated case", "Apply it to a real example"].map(
                  (s, i) => (
                    <div
                      key={s}
                      className="flex items-center gap-3 rounded-xl border border-ash bg-canvas px-3 py-2.5"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-xs font-medium text-ink">{s}</span>
                      {i === 0 ? (
                        <CheckCircle2 className="ml-auto h-4 w-4 text-good" />
                      ) : null}
                    </div>
                  ),
                )}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-ink-faint">
                  <span>Today&apos;s progress</span>
                  <span>1 of 3</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ash">
                  <div className="h-full w-1/3 rounded-full bg-brand" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Three trust pillars ===== */}
      <section className="border-t border-ash bg-surface/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Three steps, every day
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { icon: Eye, title: "See it", body: "A visual lesson makes the concept click — in 5 minutes, no jargon." },
              { icon: Target, title: "Practise it", body: "Generated problems and spaced review turn the click into a skill." },
              { icon: Trophy, title: "Make it yours", body: "Progress, streaks, and evidence you can point to and trust." },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="card p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-wash text-brand-deep">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold text-ink-faint">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Your first AI concept is one click away.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          Free forever. No login to learn. Pick a goal and start in under a minute.
        </p>
        <div className="mt-7 flex justify-center">
          <Link
            href="/onboarding"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-ink px-7 py-3 text-sm font-semibold text-white hover:bg-ink/88"
          >
            Find my learning path <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-ash py-8 text-center text-xs text-ink-faint">
        ByteSizeDecodes — Learn AI visually. Practise it. Build something real.
      </footer>
    </div>
  );
}
