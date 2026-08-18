"use client";

import { useEffect, useRef } from "react";

/**
 * A thin scroll-progress bar pinned above the sticky header, so learners
 * always know how much of the lesson remains. Style is written directly to
 * the DOM (no state, no transition) — cheap on scroll and reduced-motion
 * safe by construction.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const fraction = scrollable > 0 ? Math.min(1, Math.max(0, doc.scrollTop / scrollable)) : 0;
      bar.style.transform = `scaleX(${fraction})`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-brand"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
