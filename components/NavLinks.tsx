"use client";

import Link from "next/link";
import { BarChart3, BookOpen, CalendarDays, Hammer, Library, LogIn, UserRound } from "lucide-react";
import { useCurrentUser } from "@/lib/data/provider";

/**
 * The desktop + mobile nav, split by whether the user has a learning profile.
 *
 * - No completed profile (fresh visitor / anonymous-only): only Courses (free,
 *   no login) + Learn (which redirects to onboarding/login to create a profile).
 * - Has a profile (onboarding completed): the full nav — Today, Learn, Courses,
 *   Build, Progress, Profile.
 *
 * This matches the three-tier model: courses are free for everyone; the
 * personalised loop (Today/Build/Progress) requires a profile.
 */
const PUBLIC_NAV = [
  { href: "/courses", label: "Courses", icon: Library },
  { href: "/learn", label: "Learn", icon: BookOpen },
] as const;

const AUTHED_NAV = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/courses", label: "Courses", icon: Library },
  { href: "/build", label: "Build", icon: Hammer },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

function isActiveFor(active: string | undefined, href: string): boolean {
  return (
    active === href ||
    (href === "/learn" && active?.startsWith("/bytes")) ||
    (href === "/courses" && active?.startsWith("/courses")) ||
    (href === "/build" && active?.startsWith("/build")) ||
    (href === "/progress" &&
      (active === "/review" || active === "/mastery" || active === "/practice")) ||
    (href === "/profile" && (active === "/settings" || active === "/login"))
  );
}

export function NavLinks({
  active,
  variant,
}: {
  active?: string;
  variant: "desktop" | "mobile";
}) {
  const profile = useCurrentUser();
  const hasProfile = Boolean(profile?.onboardingCompletedAt);
  const nav = hasProfile ? AUTHED_NAV : PUBLIC_NAV;

  if (variant === "desktop") {
    return (
      <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary navigation">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveFor(active, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "focus-ring rounded-full bg-ink px-4 py-2 text-base font-bold text-canvas"
                  : "focus-ring rounded-full px-4 py-2 text-base font-bold text-ink-soft hover:bg-ash/60 hover:text-ink"
              }
            >
              {item.label}
            </Link>
          );
        })}
        {!hasProfile && (
          <Link
            href="/login"
            className="ml-2 rounded-full bg-brand px-5 py-2 text-base font-extrabold text-canvas transition-opacity hover:opacity-90"
          >
            Start free
          </Link>
        )}
      </nav>
    );
  }

  // mobile bottom bar
  const mobileCols = hasProfile ? nav.length : nav.length + 1;
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 grid border-t border-ash bg-surface/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:hidden"
      style={{ gridTemplateColumns: `repeat(${mobileCols}, minmax(0, 1fr))` }}
      aria-label="Primary navigation"
    >
      {nav.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveFor(active, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`focus-ring flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-xs font-bold ${
              isActive ? "bg-brand-wash text-brand-deep" : "text-ink-faint"
            }`}
          >
            <Icon className="h-4.5 w-4.5" />
            {item.label}
          </Link>
        );
      })}
      {!hasProfile && (
        <Link
          href="/login"
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-xs font-extrabold text-brand-deep"
        >
          <LogIn className="h-4.5 w-4.5" />
          Start free
        </Link>
      )}
    </nav>
  );
}
