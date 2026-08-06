"use client";

import { useToday, useTrackEvent } from "@/lib/data/provider";
import type { DailyPlan } from "@/lib/data/types";
import { ButtonLink } from "@/components/ui/Button";
import { PlanStep, PlanStepList } from "@/components/ui/PlanStep";
import { ArrowRight, Clock3 } from "lucide-react";

export function DailyPlanCard({
  plan,
  dueCount = 0,
}: {
  plan: DailyPlan;
  dueCount?: number;
}) {
  const primary = plan.steps[0];
  const today = useToday();
  const trackEvent = useTrackEvent();
  const continueLabel =
    dueCount > 0
      ? `Continue · ${dueCount} due · ${plan.estimatedMinutes} min`
      : `Continue · ${plan.estimatedMinutes} min`;

  return (
    <section className="card overflow-hidden">
      <div className="bg-ink p-5 text-canvas sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted">
              Today&apos;s focus
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {plan.focus}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-elevated/10 px-3 py-1.5 text-xs text-canvas/60">
            <Clock3 className="h-3.5 w-3.5" />
            about {plan.estimatedMinutes} min
          </span>
        </div>

        {primary && (
          <ButtonLink
            href={primary.href}
            variant="secondary"
            className="mt-6 border-white/15 bg-surface-elevated text-ink hover:bg-surface-elevated/90 sm:px-6"
            onClick={() => {
              void trackEvent({
                name: "daily_plan_continued",
                today,
                refKey: primary.href,
                mode: plan.timeMode,
              });
            }}
          >
            {continueLabel} <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        )}
      </div>

      <PlanStepList>
        {plan.steps.map((step, index) => (
          <li key={`${step.kind}-${step.href}-${index}`}>
            <PlanStep
              index={index + 1}
              kind={step.kind}
              label={step.label}
              detail={step.detail}
              minutes={step.minutes}
              href={step.href}
            />
          </li>
        ))}
      </PlanStepList>
    </section>
  );
}
