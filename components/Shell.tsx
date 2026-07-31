import Link from "next/link";
import type { ReactNode } from "react";
import { NavDropdown } from "@/components/NavDropdown";

const COURSES = [
  { href: "/courses/machine-learning", label: "Machine Learning" },
  { href: "/courses/machine-learning-for-layman", label: "ML for Layman" },
] as const;

const NAV = [
  { href: "/today", label: "Today" },
  { href: "/practice", label: "Practice" },
  { href: "/review", label: "Review" },
  { href: "/mastery", label: "Mastery" },
  { href: "/bytes", label: "Bytes" },
  { href: "/login", label: "Login" },
] as const;

export function Shell({
  children,
  active,
}: {
  children: ReactNode;
  active?: (typeof NAV)[number]["href"] | (typeof COURSES)[number]["href"] | string | "/";
}) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 border-b border-ash bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand" />
            ByteSizedCodes
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavDropdown
              label="Courses"
              hubHref="/courses"
              items={COURSES}
              active={active}
            />
            {NAV.map((item) => {
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "rounded-full bg-brand-wash px-3 py-1.5 font-medium text-ink"
                      : "rounded-full px-3 py-1.5 text-ink-soft hover:bg-ash/60"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t border-ash py-6 text-center text-xs text-ink-faint">
        Phase 0 preview · progress lives in this browser ·{" "}
        <Link href="/settings" className="underline hover:text-ink-soft">
          export / reset
        </Link>
      </footer>
    </div>
  );
}
