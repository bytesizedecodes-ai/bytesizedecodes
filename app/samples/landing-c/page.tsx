import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Hammer, Quote } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

/**
 * Landing Direction C — "Outcome-led transformation".
 * Headline is a learner outcome; a 3-step journey; real numbers; a testimonial.
 * Reads: results-oriented, transformation-focused. Trust through proof of outcomes.
 */
export default function LandingCPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      {/* ===== Nav ===== */}
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
            <Link
              href="/onboarding"
              className="ml-1 rounded-full bg-ink px-4 py-2 font-medium text-white"
            >
              Start free
            </Link>
          </nav>
        </div>
      </header>

      {/* ===== Hero — outcome headline ===== */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-28 sm:px-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warm-wash px-3 py-1 text-xs font-semibold text-[#9a642f]">
          <Brain className="h-3.5 w-3.5" />
          For curious beginners to builders
        </span>
        <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          From confused about AI
          <br />
          <span className="text-brand-deep">to building with it.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
          One guided path that takes you from &ldquo;what even is a model?&rdquo; to a real
          artifact you understand and can explain — in bite-sized visual lessons.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/onboarding"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-ink px-7 py-3 text-sm font-semibold text-white hover:bg-ink/88"
          >
            Start free — no login <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/courses"
            className="inline-flex min-h-12 items-center rounded-xl border border-ash bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-brand-muted"
          >
            See the courses
          </Link>
        </div>
      </section>

      {/* ===== The 3-step journey (how it works) ===== */}
      <section className="border-y border-ash bg-surface/60 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-deep">
              The path
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Three stages, one outcome
            </h2>
          </div>
          <div className="relative mt-12 grid gap-6 sm:grid-cols-3">
            {/* connecting line on desktop */}
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-muted to-transparent sm:block" />
            {[
              {
                icon: BookOpen,
                step: "See it",
                title: "Understand",
                body: "Start with picture-led foundations. No maths, no jargon — the ideas click fast.",
                n: "01",
              },
              {
                icon: Brain,
                step: "Practise it",
                title: "Internalise",
                body: "Generated practice and spaced review turn understanding into durable skill.",
                n: "02",
              },
              {
                icon: Hammer,
                step: "Build it",
                title: "Apply",
                body: "Take what you know and build a real AI/ML artifact you can show and explain.",
                n: "03",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-ash bg-white text-brand-deep shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-xs font-bold uppercase tracking-wide text-ink-faint">
                    {s.n} · {s.step}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Real numbers ===== */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["19", "lessons"],
            ["2", "courses"],
            ["3 min", "shortest session"],
            ["$0", "to start learning"],
          ].map(([n, label]) => (
            <div key={label} className="card p-5 text-center">
              <div className="text-3xl font-bold tracking-tight text-ink">{n}</div>
              <div className="mt-1 text-xs text-ink-faint">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Testimonial ===== */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="card relative overflow-hidden p-8 sm:p-10">
          <Quote className="absolute right-6 top-6 h-10 w-10 text-brand-wash" />
          <p className="text-balance text-lg font-medium leading-relaxed text-ink sm:text-xl">
            &ldquo;I&apos;d read about machine learning a dozen times and it never stuck.
            The visual lessons — car vs bike, the neighbors voting — finally made it real.
            Now I can actually explain it.&rdquo;
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-wash text-sm font-bold text-brand-deep">
              A
            </div>
            <div>
              <div className="text-sm font-semibold text-ink">A learner</div>
              <div className="text-xs text-ink-faint">after the Layman course</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-4xl px-4 pb-24 pt-8 text-center sm:px-6">
        <div className="rounded-3xl bg-ink p-10 sm:p-14">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-canvas sm:text-3xl">
            Stop reading about AI.
            <br />
            Start understanding it.
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-canvas/60">
            Free forever to learn. Pick a goal and begin in under a minute.
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              href="/onboarding"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-ink hover:bg-canvas"
            >
              Find my learning path <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ash py-8 text-center text-xs text-ink-faint">
        ByteSizeDecodes — Learn AI visually. Practise it. Build something real.
      </footer>
    </div>
  );
}
