"use client";

/**
 * Primary navigation.
 *
 * Logged-out: Learn · Courses · Plans · Login (right)
 * Authed (onboarded): Today · Learn · Courses · Build · Progress · Plans + account
 * Authed (not onboarded): Learn · Courses · Plans + account
 *
 * Login / account sit at the trailing edge of the nav (right corner of header).
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Hammer,
  Layers,
  Library,
  LogIn,
  LogOut,
  UserRound,
} from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAuthState } from "@/lib/data/provider";
import { AuthModal } from "@/components/AuthModal";

const PUBLIC_NAV = [
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/courses", label: "Courses", icon: Library },
  { href: "/plans", label: "Plans", icon: Layers },
] as const;

const AUTHED_NAV = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/courses", label: "Courses", icon: Library },
  { href: "/build", label: "Build", icon: Hammer },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/plans", label: "Plans", icon: Layers },
] as const;

const PARTIAL_NAV = [
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/courses", label: "Courses", icon: Library },
  { href: "/plans", label: "Plans", icon: Layers },
] as const;

function isActiveFor(active: string | undefined, href: string): boolean {
  return (
    active === href ||
    (href === "/learn" && active?.startsWith("/bytes")) ||
    (href === "/courses" && active?.startsWith("/courses")) ||
    (href === "/build" && active?.startsWith("/build")) ||
    (href === "/plans" && active === "/plans") ||
    (href === "/progress" &&
      (active === "/review" || active === "/mastery" || active === "/practice"))
  );
}

export function NavLinks({
  active,
  variant,
}: {
  active?: string;
  variant: "desktop" | "mobile";
}) {
  const { status, hasProfile, profile } = useAuthState();
  const { signOut } = useAuthActions();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Loading and unauthed both show public nav + Login (avoid sticky personal tabs).
  const nav =
    status === "authed" && hasProfile
      ? AUTHED_NAV
      : status === "authed"
        ? PARTIAL_NAV
        : PUBLIC_NAV;
  const showLogin = status === "unauthed" || status === "loading";
  const showAccount = status === "authed";
  const label = profile?.displayName?.split(" ")[0] || "Account";

  if (variant === "desktop") {
    return (
      <>
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary navigation">
          {nav.map((item) => {
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
          {showLogin && (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="focus-ring ml-1 rounded-full bg-brand px-5 py-2 text-base font-extrabold text-canvas transition-opacity hover:opacity-90"
            >
              Login
            </button>
          )}
          {showAccount && (
            <div ref={menuRef} className="relative ml-1">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Account menu"
                className="focus-ring flex h-9 max-w-[10rem] items-center gap-2 rounded-full border border-ash bg-canvas px-2.5 text-ink-soft transition-colors hover:bg-ash/60 hover:text-ink"
              >
                {profile?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.imageUrl}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserRound className="h-4 w-4 shrink-0" />
                )}
                <span className="hidden truncate text-sm font-bold text-ink sm:inline">
                  {label}
                </span>
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="card absolute right-0 top-11 z-50 w-48 space-y-1 p-1.5 shadow-lg"
                >
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="focus-ring flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-ash/60 hover:text-ink"
                  >
                    <UserRound className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      void signOut();
                    }}
                    className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-ink-soft hover:bg-ash/60 hover:text-ink"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  // mobile bottom bar — Login / Profile on the right edge
  const mobileCols = nav.length + (showLogin || showAccount ? 1 : 0);
  return (
    <>
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
        {showLogin && (
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="focus-ring flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-xs font-extrabold text-brand-deep"
          >
            <LogIn className="h-4.5 w-4.5" />
            Login
          </button>
        )}
        {showAccount && (
          <Link
            href="/profile"
            className={`focus-ring flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-xs font-bold ${
              active === "/profile" ? "bg-brand-wash text-brand-deep" : "text-ink-faint"
            }`}
          >
            <UserRound className="h-4.5 w-4.5" />
            Profile
          </Link>
        )}
      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
