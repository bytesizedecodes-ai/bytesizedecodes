import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/BrandMark";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLinks } from "@/components/NavLinks";

/**
 * The app shell — header, nav, footer, feedback widget.
 *
 * The nav is auth-aware via <NavLinks>: a logged-out visitor sees only
 * Courses (free) + Learn (redirects to login). A logged-in learner sees the
 * full nav (Today, Learn, Courses, Build, Progress, Profile).
 */
export function Shell({
  children,
  active,
}: {
  children: ReactNode;
  active?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col pb-20 sm:pb-0">
      <header className="sticky top-0 z-40 border-b border-ash/90 bg-canvas/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-lg font-semibold tracking-tight">
              <BrandMark withAccent />
              <span>ByteSizeDecodes</span>
            </Link>
            <ThemeToggle className="sm:hidden" />
          </div>
          <NavLinks active={active} variant="desktop" />
          <ThemeToggle className="hidden sm:flex" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
      <FeedbackWidget />
      <footer className="border-t border-ash bg-canvas/80 py-7 text-center text-xs leading-relaxed text-ink-faint">
        ByteSizeDecodes — Learn AI visually. Practise it. Build something real.
      </footer>

      <NavLinks active={active} variant="mobile" />
    </div>
  );
}
