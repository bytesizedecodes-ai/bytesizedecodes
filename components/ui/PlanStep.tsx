import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, Brain, CheckCircle2 } from "lucide-react";

const ICONS = {
  review: Brain,
  drill: CheckCircle2,
  unit: BookOpen,
} as const;

export function PlanStep({
  index,
  kind,
  label,
  detail,
  minutes,
  href,
}: {
  index: number;
  kind: keyof typeof ICONS;
  label: string;
  detail: string;
  minutes: number;
  href: string;
}) {
  const Icon = ICONS[kind];
  return (
    <Link
      href={href}
      className="focus-ring group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-brand-wash/45 sm:px-7"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-wash text-brand-deep">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">
          {index}. {label}
        </span>
        <span className="mt-0.5 block text-xs text-ink-soft">{detail}</span>
      </span>
      <span className="shrink-0 text-xs text-ink-faint">{minutes} min</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function PlanStepList({ children }: { children: ReactNode }) {
  return <ol className="divide-y divide-ash">{children}</ol>;
}
