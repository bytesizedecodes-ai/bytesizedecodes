import { Shell } from "@/components/Shell";
import { JsonLd } from "@/components/JsonLd";
import { BeginLearningCta } from "@/components/BeginLearningCta";
import { SITE_NAME, SITE_TAGLINE, SITE_URL, SITE_DESCRIPTION } from "@/lib/site";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChartNoAxesCombined,
  Eye,
  Hammer,
  Star,
  Target,
} from "lucide-react";

export const metadata = {
  title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <Shell active="/">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          slogan: SITE_TAGLINE,
        }}
      />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-10 text-center sm:pt-16">
          <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            Learn AI visually.
            <br />
            <span className="text-brand-deep">
              Practise it. Build something real.
            </span>
          </h1>

          {/* LTR learning loop — illustration-first, not copy cards */}
          <div
            className="mx-auto mt-10 max-w-3xl"
            role="img"
            aria-label="Flow: see visual lessons, practise with feedback, build a real project"
          >
            <div className="relative flex flex-col items-center gap-3 sm:flex-row sm:items-stretch sm:justify-between sm:gap-0">
              {/* Backbone track */}
              <div
                className="pointer-events-none absolute left-[12%] right-[12%] top-[3.25rem] z-0 hidden h-1 rounded-full bg-gradient-to-r from-brand via-brand-deep to-warm sm:block"
                aria-hidden
              />

              <FlowNode
                label="See"
                caption="visual lessons"
                panel={<SeePanel />}
              />
              <FlowArrow />
              <FlowNode
                label="Practise"
                caption="smart drills"
                panel={<PractisePanel />}
              />
              <FlowArrow />
              <FlowNode
                label="Build"
                caption="real projects"
                panel={<BuildPanel />}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BeginLearningCta />
            <Link
              href="/courses"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ash px-6 py-3 text-base font-semibold text-ink hover:bg-ash/40"
            >
              Explore courses
            </Link>
            <Link
              href="/plans"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-ash px-6 py-3 text-base font-semibold text-ink hover:bg-ash/40"
            >
              See plans
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Path value — five stages, not three prose cards ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Your path
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            From curious to capable
          </h2>
        </div>

        <ol className="relative mx-auto mt-12 max-w-5xl">
          {/* Desktop spine */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-7 z-0 hidden h-0.5 bg-gradient-to-r from-brand/30 via-brand to-warm sm:block"
            aria-hidden
          />

          <div className="grid gap-6 sm:grid-cols-5 sm:gap-3">
            {PATH_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <li key={stage.title} className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-muted bg-surface-elevated text-brand-deep shadow-sm ring-4 ring-canvas">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </div>
                  <span className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                    0{index + 1}
                  </span>
                  <h3 className="mt-1.5 text-sm font-semibold leading-snug text-ink">
                    {stage.title}
                  </h3>
                </li>
              );
            })}
          </div>
        </ol>
      </section>

      {/* ===== Testimonials marquee ===== */}
      <section className="overflow-hidden py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Loved by learners
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            What people are saying
          </h2>
        </div>
        <div className="relative">
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-canvas sm:w-20" style={{ background: "linear-gradient(to right, var(--color-canvas), transparent)" }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-canvas sm:w-20" style={{ background: "linear-gradient(to left, var(--color-canvas), transparent)" }} />
          <div className="flex w-max gap-4 hover:[animation-play-state:paused]" style={{ animation: "marquee 60s linear infinite" }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <figure
                key={i}
                className="flex w-72 shrink-0 flex-col gap-3 rounded-2xl border border-ash bg-surface-elevated p-5 shadow-sm sm:w-80"
              >
                <div className="flex gap-0.5 text-warm">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-wash text-xs font-bold text-brand-deep">
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-ink">{t.name}</span>
                    <span className="block text-[11px] text-ink-faint">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA — visual path into Learn ===== */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-ash bg-surface-elevated px-6 py-10 text-center sm:px-12 sm:py-14">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Start in under a minute
          </h2>

          <ol className="mx-auto mt-10 grid max-w-3xl gap-0 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-start">
            {START_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="contents">
                  <div className="flex flex-col items-center px-2 py-3">
                    <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-wash text-brand-deep ring-1 ring-brand-muted/60">
                      <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                      <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-canvas">
                        {index + 1}
                      </span>
                    </span>
                    <p className="mt-4 text-sm font-semibold text-ink">{step.title}</p>
                  </div>
                  {index < START_STEPS.length - 1 && (
                    <div
                      className="hidden items-center justify-center pt-8 sm:flex"
                      aria-hidden
                    >
                      <span className="h-px w-8 bg-brand-muted" />
                      <ArrowRight className="h-4 w-4 shrink-0 text-brand" />
                      <span className="h-px w-8 bg-brand-muted" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-col items-center gap-3">
            <BeginLearningCta />
            <p className="text-xs text-ink-faint">
              Free courses open without an account · Sign in to save progress
            </p>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function FlowArrow() {
  return (
    <div
      className="relative z-10 flex shrink-0 items-center justify-center text-brand sm:px-1 sm:pt-2"
      aria-hidden
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-muted bg-surface-elevated shadow-sm">
        <ArrowRight className="h-4 w-4" />
      </span>
    </div>
  );
}

function FlowNode({
  label,
  caption,
  panel,
}: {
  label: string;
  caption: string;
  panel: ReactNode;
}) {
  return (
    <div className="relative z-10 flex w-full max-w-[11.5rem] flex-col items-center sm:w-[11.5rem]">
      <div className="w-full overflow-hidden rounded-2xl border border-ash bg-surface-elevated shadow-[0_10px_30px_-18px_rgba(23,23,19,0.45)] ring-1 ring-brand-muted/30">
        <div className="h-[7.25rem] bg-gradient-to-b from-brand-wash/80 to-surface-elevated p-3">
          {panel}
        </div>
      </div>
      <p className="mt-3 text-sm font-bold tracking-tight text-ink">{label}</p>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
        {caption}
      </p>
    </div>
  );
}

/** Tiny “infographic board” — stacked shapes suggesting a visual lesson. */
function SeePanel() {
  return (
    <svg viewBox="0 0 140 96" className="h-full w-full" aria-hidden>
      <rect x="10" y="12" width="120" height="72" rx="10" fill="var(--color-surface-elevated)" stroke="var(--color-brand-muted)" />
      <rect x="22" y="24" width="46" height="28" rx="6" fill="var(--color-brand)" opacity="0.9" />
      <circle cx="90" cy="38" r="14" fill="var(--color-warm)" opacity="0.9" />
      <rect x="22" y="60" width="96" height="6" rx="3" fill="var(--color-ash)" />
      <rect x="22" y="70" width="64" height="6" rx="3" fill="var(--color-ash)" />
      <path d="M34 32h22M34 40h14" stroke="var(--color-canvas)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Choice pills with one correct — practice/drill signal. */
function PractisePanel() {
  return (
    <svg viewBox="0 0 140 96" className="h-full w-full" aria-hidden>
      <rect x="10" y="12" width="120" height="72" rx="10" fill="var(--color-surface-elevated)" stroke="var(--color-brand-muted)" />
      <rect x="22" y="24" width="96" height="16" rx="8" fill="var(--color-ash)" />
      <rect x="22" y="46" width="96" height="16" rx="8" fill="var(--color-good-wash)" stroke="var(--color-good)" strokeWidth="1.5" />
      <circle cx="34" cy="54" r="4" fill="var(--color-good)" />
      <path d="M31.5 54l1.8 1.8 3.8-3.8" fill="none" stroke="var(--color-canvas)" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="22" y="68" width="96" height="10" rx="5" fill="var(--color-ash)" opacity="0.7" />
    </svg>
  );
}

/** Mini product window — “build something real”. */
function BuildPanel() {
  return (
    <svg viewBox="0 0 140 96" className="h-full w-full" aria-hidden>
      <rect x="10" y="12" width="120" height="72" rx="10" fill="var(--color-ink)" />
      <circle cx="24" cy="26" r="3" fill="#f4212e" opacity="0.85" />
      <circle cx="34" cy="26" r="3" fill="#e7a765" opacity="0.85" />
      <circle cx="44" cy="26" r="3" fill="#1db954" opacity="0.85" />
      <rect x="22" y="38" width="50" height="8" rx="2" fill="var(--color-brand)" opacity="0.85" />
      <rect x="22" y="52" width="70" height="6" rx="2" fill="#ffffff" opacity="0.2" />
      <rect x="22" y="62" width="48" height="6" rx="2" fill="#ffffff" opacity="0.12" />
      <rect x="98" y="42" width="20" height="28" rx="4" fill="var(--color-warm)" opacity="0.95" />
      <path d="M104 56h8M108 52v8" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const PATH_STAGES = [
  {
    title: "Learn visually",
    icon: Eye,
  },
  {
    title: "Capture goals & progress",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Validate understanding",
    icon: BadgeCheck,
  },
  {
    title: "Help your profession",
    icon: Briefcase,
  },
  {
    title: "Build something real",
    icon: Hammer,
  },
] as const;

const START_STEPS = [
  {
    title: "Pick a goal",
    icon: Target,
  },
  {
    title: "Get a daily plan",
    icon: CalendarDays,
  },
  {
    title: "Learn your first concept",
    icon: BookOpen,
  },
] as const;

const TESTIMONIALS = [
  {
    quote: "I finally understand what a model actually learns — and why it can be wrong. The pictures made it click.",
    name: "Priya Sharma",
    role: "Marketing Manager",
    initials: "PS",
  },
  {
    quote: "Tried so many AI courses. This is the first one that didn't lose me in the first 10 minutes.",
    name: "Daniel Okafor",
    role: "Product Designer",
    initials: "DO",
  },
  {
    quote: "The car-vs-bike examples are silly simple, but that's exactly why they work. I finally get classification.",
    name: "Mei Lin",
    role: "CS Student",
    initials: "ML",
  },
  {
    quote: "I'm 52 and thought AI was beyond me. Three lessons in and I'm explaining ML to my colleagues.",
    name: "Robert Chen",
    role: "Operations Lead",
    initials: "RC",
  },
  {
    quote: "No math, no jargon, no shame. Just clear pictures and one idea at a time. Exactly what I needed.",
    name: "Aisha Patel",
    role: "Healthcare Analyst",
    initials: "AP",
  },
  {
    quote: "The spaced review is sneaky good. I keep coming back because the streak makes it feel like a game.",
    name: "Marcus Webb",
    role: "Startup Founder",
    initials: "MW",
  },
  {
    quote: "My team builds ML products. Now I can actually follow what they're talking about in standup.",
    name: "Elena Rossi",
    role: "Project Manager",
    initials: "ER",
  },
  {
    quote: "Every lesson takes 5 minutes and I walk away actually remembering the idea. That's rare.",
    name: "James Carter",
    role: "Teacher",
    initials: "JC",
  },
  {
    quote: "I was scared of AI. Now I'm curious. That shift happened in one afternoon on this site.",
    name: "Fatima Al-Sayed",
    role: "Recent Graduate",
    initials: "FA",
  },
  {
    quote: "The 'when ML gets it wrong' lesson should be required viewing for everyone using AI tools.",
    name: "Tom Becker",
    role: "Software Engineer",
    initials: "TB",
  },
] as const;
