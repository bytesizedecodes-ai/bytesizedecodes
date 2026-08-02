"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Moon, ShieldCheck, Sparkles, Star, Sun } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { ButtonLink } from "@/components/ui/Button";

// Twitter blue — the accent for both themes.
const TWITTER_BLUE = "#1D9BF0";
const TWITTER_BLUE_DEEP = "#0F8CD8";

/**
 * Landing A — black + Twitter blue, with a dark/light toggle (top-right).
 * Theme is held in client state and applied via a `data-theme` attribute on the
 * root wrapper. CSS variables scoped to [data-theme] swap the palette so the
 * toggle is instant and flash-free. The toggle persists to localStorage.
 */
export function LandingShell() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Restore preference.
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("bsd-sample-theme") : null;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  function toggle() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") localStorage.setItem("bsd-sample-theme", next);
      return next;
    });
  }

  return (
    <div data-theme={theme} style={themeVars(theme)} className="min-h-dvh">
      <style>{`
        [data-theme="dark"] { --tw-blue: ${TWITTER_BLUE}; }
        [data-theme="light"] { --tw-blue: ${TWITTER_BLUE_DEEP}; }
      `}</style>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        {/* glow */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ background: "var(--bg-glow)" }}
        />
        {/* nav */}
        <header className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg font-semibold tracking-tight">
            <BrandMark />
            <span style={{ color: "var(--fg)" }}>ByteSizeDecodes</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/courses"
              className="rounded-full px-3.5 py-2 hover:opacity-80"
              style={{ color: "var(--fg-soft)" }}
            >
              Courses
            </Link>
            <Link
              href="/learn"
              className="hidden rounded-full px-3.5 py-2 hover:opacity-80 sm:inline"
              style={{ color: "var(--fg-soft)" }}
            >
              Learn
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--fg-soft)" }}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              href="/onboarding"
              className="rounded-full px-4 py-2 font-semibold text-white"
              style={{ background: "var(--tw-blue)" }}
            >
              Start free
            </Link>
          </nav>
        </header>

        {/* hero content */}
        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-16 text-center sm:pt-24">
          <div
            className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface-pill",
              color: "var(--fg-soft)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--tw-blue)" }} />
            Learn AI the visual way — no maths required
          </div>

          <h1
            className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl"
            style={{ color: "var(--fg)" }}
          >
            Learn AI visually.
            <br />
            <span style={{ color: "var(--tw-blue)" }}>Practise it. Build something real.</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--fg-soft)" }}
          >
            Short visual lessons, intelligent practice, and real project thinking —
            for anyone curious about AI, from first concepts to your first useful product.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/onboarding"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl px-7 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--tw-blue)" }}
            >
              Find my learning path <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-6 py-3 text-base font-semibold transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              Explore courses
            </Link>
          </div>

          <p className="mt-5 text-xs" style={{ color: "var(--fg-faint)" }}>
            Start anonymously. No login required to learn.
          </p>
        </div>
      </section>

      {/* ===== Social proof strip ===== */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px sm:grid-cols-4">
          {[
            ["19", "visual lessons"],
            ["2", "full courses"],
            ["100%", "free to learn"],
            ["∞", "practice drills"],
          ].map(([n, label]) => (
            <div key={label} className="px-4 py-6 text-center">
              <div className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--fg)" }}>
                {n}
              </div>
              <div className="mt-0.5 text-xs" style={{ color: "var(--fg-faint)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Trust pillars ===== */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "var(--tw-blue)" }}>
            Why it works
          </p>
          <h2
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: "var(--fg)" }}
          >
            A learning loop your brain actually likes
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "See it clearly",
              body: "Visual explanations turn abstract AI ideas into concrete mental models — no jargon, no prerequisites.",
            },
            {
              icon: GraduationCap,
              title: "Practise the hard parts",
              body: "Generated problems adapt while targeted feedback repairs misconceptions. Spaced review keeps it.",
            },
            {
              icon: ShieldCheck,
              title: "Build something real",
              body: "Progress toward a useful artifact — the kind you can show, explain, and trust.",
            },
          ].map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="rounded-2xl border p-6 transition-colors"
                style={{ borderColor: "var(--border)", background: "var(--surface-card)" }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "var(--surface-blue)", color: "var(--tw-blue)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold" style={{ color: "var(--fg)" }}>
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--fg-soft)" }}>
                  {p.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Testimonial ===== */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="flex justify-center gap-1" style={{ color: "var(--tw-blue)" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p
          className="mt-5 text-balance text-xl font-medium leading-relaxed sm:text-2xl"
          style={{ color: "var(--fg)" }}
        >
          &ldquo;I finally understand what a model actually learns — and why it can be wrong.
          The pictures made it click.&rdquo;
        </p>
        <p className="mt-4 text-sm" style={{ color: "var(--fg-faint)" }}>
          A learner, after the foundations course
        </p>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl border p-10 text-center sm:p-16"
          style={{ borderColor: "var(--border)", background: "var(--surface-cta)" }}
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl"
            style={{ background: "var(--bg-glow)" }}
          />
          <h2 className="relative text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: "var(--fg)" }}>
            Start in under a minute
          </h2>
          <p className="relative mx-auto mt-3 max-w-md" style={{ color: "var(--fg-soft)" }}>
            Pick a goal, get a daily plan, and learn your first AI concept today — free.
          </p>
          <div className="relative mt-7 flex justify-center">
            <Link
              href="/onboarding"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl px-7 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--tw-blue)" }}
            >
              Begin learning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer
        className="py-8 text-center text-xs"
        style={{ borderTop: "1px solid var(--border)", color: "var(--fg-faint)" }}
      >
        ByteSizeDecodes — Learn AI visually. Practise it. Build something real.
      </footer>
    </div>
  );
}

/** Theme palettes — black dark mode, cream light mode, Twitter blue accent. */
function themeVars(theme: "dark" | "light"): React.CSSProperties {
  if (theme === "dark") {
    return {
      background: "#000000",
      // CSS custom properties via style won't accept arbitrary keys, so we use a
      // data-attribute + a <style> block instead. These inline values are fallbacks.
      ["--bg" as string]: "#000000",
      ["--fg" as string]: "#e7e7ea",
      ["--fg-soft" as string]: "#9b9ba3",
      ["--fg-faint" as string]: "#5b5b63",
      ["--border" as string]: "#1f1f23",
      ["--surface-card" as string]: "#0d0d0f",
      ["--surface-pill" as string]: "rgba(255,255,255,0.04)",
      ["--surface-blue" as string]: "rgba(29,155,240,0.14)",
      ["--surface-cta" as string]: "linear-gradient(135deg, rgba(29,155,240,0.12), rgba(29,155,240,0.03))",
      ["--bg-glow" as string]: "rgba(29,155,240,0.20)",
    } as React.CSSProperties;
  }
  // light — existing cream background
  return {
    background: "#f7f5ef",
    ["--bg" as string]: "#f7f5ef",
    ["--fg" as string]: "#171713",
    ["--fg-soft" as string]: "#55544d",
    ["--fg-faint" as string]: "#8b897f",
    ["--border" as string]: "#e7e2d7",
    ["--surface-card" as string]: "#fffefa",
    ["--surface-pill" as string]: "#eaf0f8",
    ["--surface-blue" as string]: "#eaf4fd",
    ["--surface-cta" as string]: "linear-gradient(135deg, rgba(29,155,240,0.08), rgba(29,155,240,0.02))",
    ["--bg-glow" as string]: "rgba(29,155,240,0.12)",
  } as React.CSSProperties;
}
