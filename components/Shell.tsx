import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/BrandMark";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { NavLinks } from "@/components/NavLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_NAME } from "@/lib/site";

/**
 * The app shell — header, nav, multi-column footer, feedback widget.
 *
 * The nav is auth-aware via <NavLinks>. Guests see Learn · Courses · Login;
 * signed-in learners see the full loop plus account menu.
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
              <span>{SITE_NAME}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <NavLinks active={active} variant="desktop" />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
      <FeedbackWidget />
      <SiteFooter />
      <NavLinks active={active} variant="mobile" />
    </div>
  );
}
