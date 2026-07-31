import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, BookOpen, CalendarDays, Hammer, UserRound } from "lucide-react";

const NAV = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/build", label: "Build", icon: Hammer },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

export function Shell({
  children,
  active,
}: {
  children: ReactNode;
  active?: (typeof NAV)[number]["href"] | string | "/";
}) {
  return (
    <div className="flex min-h-dvh flex-col pb-20 sm:pb-0">
      <header className="sticky top-0 z-40 border-b border-ash/90 bg-canvas/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-lg font-semibold tracking-tight">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-xs font-bold text-white">
              B
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-warm" />
            </span>
            <span>bytesizedecodes</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm sm:flex" aria-label="Primary navigation">
            {NAV.map((item) => {
              const isActive =
                active === item.href ||
                (item.href === "/learn" &&
                  (active?.startsWith("/courses") || active?.startsWith("/bytes"))) ||
                (item.href === "/build" && active?.startsWith("/build")) ||
                (item.href === "/progress" &&
                  (active === "/review" || active === "/mastery" || active === "/practice")) ||
                (item.href === "/profile" &&
                  (active === "/settings" || active === "/login"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "focus-ring rounded-full bg-ink px-3.5 py-2 font-medium text-white"
                      : "focus-ring rounded-full px-3.5 py-2 text-ink-soft hover:bg-white/80 hover:text-ink"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
      <footer className="border-t border-ash bg-canvas/80 py-7 text-center text-xs leading-relaxed text-ink-faint">
        bytesizedecodes stores learning progress in Convex. Start anonymously, then link Google
        from{" "}
        <Link href="/login" className="font-medium underline hover:text-ink-soft">
          Account
        </Link>{" "}
        when you want cross-device continuity.
      </footer>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-ash bg-surface/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:hidden"
        aria-label="Primary navigation"
      >
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            active === item.href ||
            (item.href === "/learn" &&
              (active?.startsWith("/courses") || active?.startsWith("/bytes"))) ||
            (item.href === "/build" && active?.startsWith("/build")) ||
            (item.href === "/progress" &&
              (active === "/review" || active === "/mastery" || active === "/practice")) ||
            (item.href === "/profile" &&
              (active === "/settings" || active === "/login"));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`focus-ring flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${
                isActive ? "bg-brand-wash text-brand-deep" : "text-ink-faint"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
