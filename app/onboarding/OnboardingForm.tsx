"use client";

import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  Clock3,
  GraduationCap,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { LEARNING_TRACKS, STARTING_LEVELS, TIME_MODES } from "@/content/tracks";
import { useUpdateOnboarding } from "@/lib/data/provider";
import type { StartingLevel, TimeMode, Track } from "@/lib/data/types";
import { Button } from "@/components/ui/Button";

const trackIcons = {
  beginner: Lightbulb,
  grad: GraduationCap,
  engineer: BriefcaseBusiness,
  founder: BrainCircuit,
} as const;

export function OnboardingForm() {
  const params = useSearchParams();
  const router = useRouter();
  const updateOnboarding = useUpdateOnboarding();
  const initialTrack = useMemo<Track>(() => {
    const value = params.get("goal");
    return LEARNING_TRACKS.some((track) => track.id === value) ? (value as Track) : "beginner";
  }, [params]);
  const [track, setTrack] = useState<Track>(initialTrack);
  const [level, setLevel] = useState<StartingLevel>("new");
  const [timeMode, setTimeMode] = useState<TimeMode>("standard");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const selectedTime = TIME_MODES.find((item) => item.id === timeMode)!;
    setSaving(true);
    setError(null);
    try {
      await updateOnboarding({
        track,
        startingLevel: level,
        weeklyMinutes: selectedTime.weeklyMinutes,
        preferredTimeMode: timeMode,
      });
      const next = params.get("next");
      router.push(next && next.startsWith("/") ? next : "/today");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your path. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-9">
      <ChoiceSection number="1" title="What do you want AI to help you do?">
        <div className="grid gap-3 sm:grid-cols-2">
          {LEARNING_TRACKS.map((item) => {
            const Icon = trackIcons[item.id];
            const selected = item.id === track;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTrack(item.id)}
                aria-pressed={selected}
                className={`focus-ring relative rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-brand bg-brand-wash shadow-sm"
                    : "border-ash bg-white hover:border-brand-muted"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-4 block text-sm font-semibold text-ink">{item.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-soft">{item.promise}</span>
                {selected && (
                  <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-deep text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </ChoiceSection>

      <ChoiceSection number="2" title="Where should we start?">
        <div className="grid gap-3 sm:grid-cols-3">
          {STARTING_LEVELS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLevel(item.id)}
              aria-pressed={item.id === level}
              className={`focus-ring rounded-2xl border p-4 text-left transition ${
                item.id === level
                  ? "border-brand bg-brand-wash"
                  : "border-ash bg-white hover:border-brand-muted"
              }`}
            >
              <span className="text-sm font-semibold text-ink">{item.title}</span>
              <span className="mt-1.5 block text-xs leading-relaxed text-ink-soft">
                {item.detail}
              </span>
            </button>
          ))}
        </div>
      </ChoiceSection>

      <ChoiceSection number="3" title="How much time feels realistic?">
        <div className="grid gap-3 sm:grid-cols-3">
          {TIME_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTimeMode(item.id)}
              aria-pressed={item.id === timeMode}
              className={`focus-ring rounded-2xl border p-4 text-left transition ${
                item.id === timeMode
                  ? "border-ink bg-ink text-white"
                  : "border-ash bg-white text-ink hover:border-brand-muted"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Clock3 className="h-4 w-4" />
                {item.title} · {item.minutes} min
              </span>
              <span
                className={`mt-1.5 block text-xs leading-relaxed ${
                  item.id === timeMode ? "text-white/65" : "text-ink-soft"
                }`}
              >
                {item.detail}
              </span>
            </button>
          ))}
        </div>
      </ChoiceSection>

      {error && (
        <p role="alert" className="rounded-xl bg-bad-wash px-4 py-3 text-sm text-bad">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center gap-3 border-t border-ash pt-6">
        <Button className="w-full sm:w-auto sm:px-8" onClick={submit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving your path
            </>
          ) : (
            <>
              Build my daily plan <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
        <p className="text-center text-xs text-ink-faint">
          You can change these preferences later from Profile.
        </p>
      </div>
    </div>
  );
}

function ChoiceSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-warm-wash text-xs font-bold text-[#9a642f]">
          {number}
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}
