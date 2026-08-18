"use client";

import { useEffect } from "react";

/**
 * Keyboard shortcuts for MCQ surfaces: number keys 1–9 pick the Nth choice,
 * Enter confirms. Keys are ignored while typing in an input/textarea (the
 * code cells share the page) and when `enabled` is false.
 */
export function useChoiceKeys({
  count,
  onPick,
  onConfirm,
  enabled = true,
}: {
  count: number;
  onPick: (index: number) => void;
  onConfirm?: () => void;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    function isTypingTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      return (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const n = Number.parseInt(event.key, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= count) {
        event.preventDefault();
        onPick(n - 1);
        return;
      }
      if (event.key === "Enter" && onConfirm) {
        event.preventDefault();
        onConfirm();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, onPick, onConfirm, enabled]);
}
