"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string };

/**
 * Top-level "Courses" nav item. It is BOTH a link (to the courses hub) AND a
 * dropdown trigger:
 *  - A plain click navigates to `/courses`.
 *  - Hovering (desktop) or long-pressing the chevron opens a quick-jump panel.
 *
 * This is the fix for "clicking Courses does nothing": the trigger is a real
 * `<a>`, not just a toggle button.
 */
export function NavDropdown({
  label,
  hubHref,
  items,
  active,
}: {
  label: string;
  hubHref: string;
  items: readonly NavItem[];
  active?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hover-open / hover-close on desktop; touch users get click-to-toggle.
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!container.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      cancelClose();
    };
  }, []);

  const isActive =
    active === hubHref ||
    items.some((i) => active === i.href || (active?.startsWith(`${i.href}/`) ?? false));

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <div className="flex items-center">
        {/* Primary affordance: a real link. */}
        <Link
          href={hubHref}
          aria-haspopup="true"
          aria-expanded={open}
          className={
            "flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors " +
            (isActive
              ? "bg-brand-wash font-medium text-ink"
              : "text-ink-soft hover:bg-ash/60")
          }
        >
          {label}
        </Link>
        {/* Chevron is the dropdown toggle (stops navigation). */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={`${label} menu`}
          className={
            "flex h-7 w-5 items-center justify-center rounded-full transition-colors " +
            (isActive
              ? "bg-brand-wash text-ink"
              : "text-ink-soft hover:bg-ash/60")
          }
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className={
              "h-3 w-3 transition-transform " + (open ? "rotate-180" : "")
            }
          >
            <path
              d="M5 7.5 10 12.5 15 7.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-52 rounded-xl border border-ash bg-white p-1 shadow-md">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={
                "block rounded-lg px-3 py-2 text-sm transition-colors " +
                (active === item.href || (active?.startsWith(`${item.href}/`) ?? false)
                  ? "bg-brand-wash font-medium text-ink"
                  : "text-ink-soft hover:bg-ash/60")
              }
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={hubHref}
            onClick={() => setOpen(false)}
            className="block border-t border-ash px-3 py-2 text-xs font-medium uppercase tracking-wide text-brand-deep hover:bg-brand-wash"
          >
            View all →
          </Link>
        </div>
      )}
    </div>
  );
}
