import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Leaderboard } from "@/components/Leaderboard";
import { StatsBoard } from "@/components/StatsBoard";

export default function HomePage() {
  return (
    <Shell active="/">
      <section className="mx-auto max-w-2xl pt-6 text-center sm:pt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep">
          Phase 0 preview
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Five minutes a day
          <br />
          <span className="text-brand-deep">until the interview.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft">
          Procedural drills, spaced review, and bite-sized lessons aimed at Indian college
          grads breaking into ML roles. Not another course. Practice, not playlists.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/today"
            className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Start today&apos;s session
          </Link>
          <Link
            href="/practice"
            className="rounded-xl border border-ash bg-white px-5 py-3 text-sm font-semibold text-ink"
          >
            Try a drill
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-ash bg-white px-5 py-3 text-sm font-semibold text-ink"
          >
            Log in
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <StatsBoard />
      </section>

      <section className="mx-auto mt-8 max-w-3xl">
        <Leaderboard limit={10} />
      </section>

      <section className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-3">
        {[
          {
            title: "Unlimited drills",
            body: "Confusion matrices, tensor shapes, gradient steps, loss functions — generated, auto-graded, interview-shaped.",
          },
          {
            title: "Remembers what you forget",
            body: "Spaced repetition resurfaces the concepts you keep missing. The reason to come back is that memory actually decays.",
          },
          {
            title: "No streak anxiety",
            body: "Freezes you earn, a pause that doesn't punish, and XP weighted toward things you ship — not days you logged in.",
          },
        ].map((c) => (
          <div key={c.title} className="card p-5 text-left">
            <h2 className="text-sm font-semibold text-ink">{c.title}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{c.body}</p>
          </div>
        ))}
      </section>

      <p className="mx-auto mt-12 max-w-xl text-center text-xs text-ink-faint">
        Leaderboard rows are demo data for now. Your own progress is saved to this
        browser; real accounts and the 7pm IST email arrive with Phase 1.
      </p>
    </Shell>
  );
}
