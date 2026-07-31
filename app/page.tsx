import Link from "next/link";
import { ArrowRight, BrainCircuit, BriefcaseBusiness, GraduationCap, Lightbulb } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <Shell active="/">
      <section className="mx-auto grid max-w-6xl items-center gap-10 py-7 lg:grid-cols-[1.06fr_0.94fr] lg:py-16">
        <div>
          <Badge tone="warm">Visual, active, built for your goal</Badge>
          <h1 className="display-title mt-5 max-w-3xl text-ink">
            Learn AI visually.
            <br />
            <span className="text-brand-deep">Practise it. Build something real.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Short visual lessons, intelligent practice, and real project thinking for
            anyone curious about AI—from first concepts to your first useful product.
          </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/onboarding" className="px-6">
            Find my learning path <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/learn" variant="secondary" className="px-6">
            Explore lessons
          </ButtonLink>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-ink-faint">
          Start anonymously. Choose a goal in under a minute. No account required.
        </p>
      </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -left-4 -top-4 h-28 w-28 rounded-full bg-warm-wash blur-2xl" />
          <div className="card relative overflow-hidden p-3 sm:p-4">
            <div className="rounded-[15px] bg-ink p-5 text-white sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted">
                Today · 9 minutes
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Understand why accuracy can lie
              </h2>
              <div className="mt-6 space-y-2">
                {[
                  ["1", "Recall", "2 due concepts"],
                  ["2", "Practise", "one generated case"],
                  ["3", "Apply", "choose a metric"],
                ].map(([n, label, detail]) => (
                  <div
                    key={n}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/7 px-3.5 py-3"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-ink">
                      {n}
                    </span>
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="ml-auto text-xs text-white/60">{detail}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-warm" />
              </div>
              <p className="mt-2 text-xs text-white/60">Small steps. Durable skill.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl border-t border-ash pt-12">
        <div className="max-w-2xl">
          <p className="eyebrow">Choose your outcome</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            One skill graph. A path that fits you.
          </h2>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            return (
              <Link
                key={goal.id}
                href={`/onboarding?goal=${goal.id}`}
                className="card-interactive focus-ring group p-5"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${goal.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-semibold text-ink">{goal.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{goal.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-brand-deep">
                  Start here <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-4 pb-10 sm:grid-cols-3">
        {[
          ["See it clearly", "Visual explanations turn abstract AI ideas into concrete mental models."],
          ["Practise the hard parts", "Generated problems adapt the scenario while targeted feedback repairs misconceptions."],
          ["Remember and apply", "Spaced review brings ideas back before they fade, then connects them to a useful decision."],
        ].map(([title, body], index) => (
          <div key={title} className="border-l-2 border-brand-muted px-5 py-2">
            <p className="text-xs font-bold text-brand-deep">0{index + 1}</p>
            <h2 className="mt-3 font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
          </div>
        ))}
      </section>
    </Shell>
  );
}

const GOALS = [
  {
    id: "beginner",
    title: "Understand AI clearly",
    body: "Build confident AI literacy without jargon or a coding prerequisite.",
    icon: Lightbulb,
    tone: "bg-warm-wash text-[#9a642f]",
  },
  {
    id: "grad",
    title: "Build technical skills",
    body: "Move from concepts to Python, ML practice, and portfolio-ready proof.",
    icon: GraduationCap,
    tone: "bg-brand-wash text-brand-deep",
  },
  {
    id: "engineer",
    title: "Prepare for an AI/ML role",
    body: "Learn the models, evaluation, and system choices relevant to your role.",
    icon: BriefcaseBusiness,
    tone: "bg-good-wash text-good",
  },
  {
    id: "founder",
    title: "Launch an AI product",
    body: "Validate the problem, evaluate the system, and build the smallest useful MVP.",
    icon: BrainCircuit,
    tone: "bg-[#f1eafb] text-[#7359a1]",
  },
] as const;
