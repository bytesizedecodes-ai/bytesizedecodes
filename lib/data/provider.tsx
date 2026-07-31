"use client";

/**
 * React bindings — Convex-backed.
 *
 * Components import hooks from here and nowhere else. This file is the documented swap
 * point: it was localStorage in Phase 0, it is Convex now, and every page kept its
 * imports identical. Reads go through useQuery (reactive subscriptions replace the old
 * useSyncExternalStore fingerprint); mutations through useMutation.
 *
 * Identity: getUserId() returns a localStorage UUID for the dev user. When Convex Auth
 * ships, only lib/data/identity.ts + convex/lib/getUser.ts change — not this file.
 *
 * The one signature break vs Phase 0: useExportProgress now returns a Promise<string>
 * because Convex actions are async. The single consumer (app/settings) was updated.
 */

import { useCallback, useMemo, type ReactNode } from "react";
import {
  ConvexProvider,
  ConvexReactClient,
  useAction,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "@/convex/_generated/api";
import { todayKey, type DayKey } from "../day";
import { getUserId } from "./identity";
import type {
  AttemptInput,
  AttemptResult,
  ByteProgress,
  DayProgress,
  DayXp,
  LeaderboardRow,
  Profile,
  ReviewCard,
  ReviewInput,
  TopicMastery,
  UserCounts,
} from "./types";

// Convex client is constructed once at module scope. The URL is written into
// .env.local by `npx convex dev` (NEXT_PUBLIC_CONVEX_URL).
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/** Mounts the Convex client. Replaces the old localStore.hydrate() call. */
export function DataProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

/** Current IST day, stable for the component's lifetime. */
export function useToday(): DayKey {
  return useMemo(() => todayKey(), []);
}

/** Stable per-browser user id. Re-render-safe (no state). */
function useUserId(): string {
  return useMemo(() => getUserId(), []);
}

// ---------- reads ----------
//
// Each query returns undefined while loading — the same "not hydrated" semantics every
// page already gates on. Loaded-empty states are preserved by returning the value as-is.
// Convex's reactivity invalidates these automatically after a mutation, so the manual
// useVersion() fingerprint from Phase 0 is gone.

export function useCurrentUser(): Profile | undefined | null {
  const userId = useUserId();
  const today = useToday();
  const data = useQuery(api.queries.getProfile, { userId, today });
  if (data === undefined) return undefined;
  if (data === null) return null;
  return data as Profile;
}

export function useDayProgress(today: DayKey): DayProgress | undefined {
  const userId = useUserId();
  const data = useQuery(api.queries.getDayProgress, { userId, today });
  return data as DayProgress | undefined;
}

export function useReviewQueue(today: DayKey): ReviewCard[] | undefined {
  const userId = useUserId();
  const data = useQuery(api.queries.getReviewQueue, { userId, today });
  return data as ReviewCard[] | undefined;
}

export function useByteProgress(slug: string): ByteProgress | undefined {
  const userId = useUserId();
  const data = useQuery(api.queries.getByteProgress, { userId, slug });
  if (data === undefined) return undefined;
  return data as ByteProgress;
}

export function useAllByteProgress(): Record<string, ByteProgress> | undefined {
  const userId = useUserId();
  const data = useQuery(api.queries.getAllByteProgress, { userId });
  return data as Record<string, ByteProgress> | undefined;
}

export function useTopicMastery(today: DayKey): TopicMastery[] | undefined {
  const userId = useUserId();
  const data = useQuery(api.queries.getTopicMastery, { userId, today });
  return data as TopicMastery[] | undefined;
}

export function useRecentXp(days: number, today: DayKey): DayXp[] | undefined {
  const userId = useUserId();
  const data = useQuery(api.queries.getRecentXp, { userId, days, today });
  return data as DayXp[] | undefined;
}

// ---------- global reads (no userId) ----------
//
// The first hooks that don't resolve a per-browser userId — these read across all
// profiles for the leaderboard and homepage stat board.

export function useLeaderboard(limit?: number): LeaderboardRow[] | undefined {
  const data = useQuery(api.queries.getLeaderboard, limit ? { limit } : {});
  return data as LeaderboardRow[] | undefined;
}

export function useUserCounts(): UserCounts | undefined {
  const data = useQuery(api.queries.getUserCounts, {});
  return data as UserCounts | undefined;
}

// ---------- mutations ----------
//
// Each wraps a Convex mutation, injecting the dev userId. Signatures match the Phase 0
// DataMutations contract — callers in components/ and app/ are unchanged.

export function useSubmitAttempt(): (input: AttemptInput) => Promise<AttemptResult> {
  const userId = useUserId();
  const submit = useMutation(api.mutations.submitAttempt);
  return useCallback(
    (input: AttemptInput) => submit({ input: { ...input, userId } }) as Promise<AttemptResult>,
    [submit, userId],
  );
}

export function useGradeReview(): (input: ReviewInput) => Promise<AttemptResult> {
  const userId = useUserId();
  const grade = useMutation(api.mutations.gradeReview);
  return useCallback(
    (input: ReviewInput) => grade({ input: { ...input, userId } }) as Promise<AttemptResult>,
    [grade, userId],
  );
}

export function useStartByte(): (slug: string) => Promise<void> {
  const userId = useUserId();
  const start = useMutation(api.mutations.startByte);
  return useCallback(
    async (slug: string) => {
      await start({ userId, slug });
    },
    [start, userId],
  );
}

export function useCompleteByte(): (slug: string, today: DayKey) => Promise<AttemptResult> {
  const userId = useUserId();
  const complete = useMutation(api.mutations.completeByte);
  return useCallback(
    (slug: string, today: DayKey) =>
      complete({ userId, slug, today }) as Promise<AttemptResult>,
    [complete, userId],
  );
}

export function useResetProgress(): () => Promise<void> {
  const userId = useUserId();
  const reset = useMutation(api.mutations.resetProgress);
  return useCallback(async () => {
    await reset({ userId });
  }, [reset, userId]);
}

/**
 * NOTE: now async (returns Promise<string>). Phase 0 returned string synchronously;
 * Convex actions are async by nature. The single consumer, app/settings, was updated.
 */
export function useExportProgress(): () => Promise<string> {
  const userId = useUserId();
  const exportAction = useAction(api.mutations.exportProgress);
  return useCallback(async () => {
    const json = (await exportAction({ userId })) as unknown as string;
    return json;
  }, [exportAction, userId]);
}

export function useImportProgress(): (json: string) => Promise<void> {
  const userId = useUserId();
  const importProgress = useMutation(api.mutations.importProgress);
  return useCallback(
    async (json: string) => {
      await importProgress({ userId, json });
    },
    [importProgress, userId],
  );
}
