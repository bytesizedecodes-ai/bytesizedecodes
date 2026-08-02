"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Dark/light theme toggle. Light is the default. The chosen theme is persisted
 * to localStorage["bsd-theme"] and applied as data-theme on <html>. The no-FOUC
 * bootstrap script in app/layout.tsx applies the stored value before paint;
 * this component keeps the icon in sync and toggles on click.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Read the effective theme (set by the bootstrap script) after hydration.
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("bsd-theme", next);
    } catch {
      // ignore (private mode etc.)
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-ash text-ink-soft transition-colors hover:bg-ash/60 hover:text-ink ${className}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
