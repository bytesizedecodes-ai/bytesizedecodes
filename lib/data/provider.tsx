"use client";

/**
 * React bindings — Convex-backed with Convex Auth.
 *
 * Components import hooks from here and nowhere else. Identity resolves on the
 * server from the auth session when present; the browser UUID is only used to
 * keep legacy progress readable until anonymous auth claims it.
 */

import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import {
  ConvexReactClient,
  useAction,
  useMutation,
  useQuery,
} from "convex/react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { todayKey, type DayKey } from "../day";
import { getUserId, peekLegacyAnonId } from "./identity";
import type {
  AttemptInput,
  AttemptResult,
  ByteProgress,
  DailyPlan,
  DayProgress,
  DayXp,
  LeaderboardRow,
  OnboardingInput,
  Profile,
  ReviewCard,
  ReviewInput,
  TopicMastery,
  TrackEventInput,
  UserCounts,
  TimeMode,
  LessonDraftInput,
} from "./types";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function AuthBootstrap({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const claim = useMutation(api.mutations.claimLegacyProgress);

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    void signIn("anonymous").then(async () => {
      const legacy = peekLegacyAnonId();
      if (legacy) {
        try {
          await claim({ legacyUserId: legacy });
        } catch {
          // Claim is best-effort; learning still works under the new subject.
        }
      }
    });
  }, [isLoading, isAuthenticated, signIn, claim]);

  return <>{children}</>;
}

/** Mounts Convex Auth + the Convex client. */
export function DataProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </ConvexAuthNextjsProvider>
  );
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

export function useDailyPlan(
  today: DayKey,
  timeMode?: TimeMode,
): DailyPlan | undefined {
  const userId = useUserId();
  const data = useQuery(api.queries.getDailyPlan, {
    userId,
    today,
    ...(timeMode ? { timeMode } : {}),
  });
  return data as DailyPlan | undefined;
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

export function useLeaderboard(limit?: number): LeaderboardRow[] | undefined {
  const data = useQuery(api.queries.getLeaderboard, limit ? { limit } : {});
  return data as LeaderboardRow[] | undefined;
}

export function useUserCounts(): UserCounts | undefined {
  const data = useQuery(api.queries.getUserCounts, {});
  return data as UserCounts | undefined;
}

export function useProjects():
  | Array<{
      slug: string;
      title: string;
      summary: string;
      status: string;
      visibility: string;
      checkpoint: string;
      updatedAt: number;
    }>
  | undefined {
  const userId = useUserId();
  const data = useQuery(api.queries.listProjects, { userId });
  return data as
    | Array<{
        slug: string;
        title: string;
        summary: string;
        status: string;
        visibility: string;
        checkpoint: string;
        updatedAt: number;
      }>
    | undefined;
}

// ---------- mutations ----------

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

export function useCompleteByte(): (
  slug: string,
  today: DayKey,
  opts?: { requireExercise?: boolean },
) => Promise<AttemptResult> {
  const userId = useUserId();
  const complete = useMutation(api.mutations.completeByte);
  return useCallback(
    (slug: string, today: DayKey, opts?: { requireExercise?: boolean }) =>
      complete({
        userId,
        slug,
        today,
        ...(opts?.requireExercise ? { requireExercise: true } : {}),
      }) as Promise<AttemptResult>,
    [complete, userId],
  );
}

export function useUpdateOnboarding(): (input: OnboardingInput) => Promise<void> {
  const userId = useUserId();
  const update = useMutation(api.mutations.updateOnboarding);
  return useCallback(
    async (input: OnboardingInput) => {
      await update({ userId, ...input });
    },
    [update, userId],
  );
}

export function useTrackEvent(): (input: TrackEventInput) => Promise<void> {
  const userId = useUserId();
  const track = useMutation(api.mutations.trackEvent);
  return useCallback(
    async (input: TrackEventInput) => {
      await track({
        userId,
        name: input.name,
        today: input.today,
        refKey: input.refKey,
        track: input.track,
        mode: input.mode,
      });
    },
    [track, userId],
  );
}

export function useSaveLessonDraft(): (input: LessonDraftInput) => Promise<void> {
  const userId = useUserId();
  const save = useMutation(api.mutations.saveLessonDraft);
  return useCallback(
    async (input: LessonDraftInput) => {
      await save({
        userId,
        slug: input.slug,
        draftAnswers:
          input.draftAnswers !== undefined ? JSON.stringify(input.draftAnswers) : undefined,
        draftChecked:
          input.draftChecked !== undefined ? JSON.stringify(input.draftChecked) : undefined,
        draftCode: input.draftCode,
      });
    },
    [save, userId],
  );
}

export function useRecordCodeTestPass(): (
  slug: string,
  today: DayKey,
  skillIds: string[],
) => Promise<void> {
  const userId = useUserId();
  const record = useMutation(api.mutations.recordCodeTestPass);
  return useCallback(
    async (slug: string, today: DayKey, skillIds: string[]) => {
      await record({ userId, slug, today, skillIds });
    },
    [record, userId],
  );
}

export function useResetProgress(): () => Promise<void> {
  const userId = useUserId();
  const reset = useMutation(api.mutations.resetProgress);
  return useCallback(async () => {
    await reset({ userId });
  }, [reset, userId]);
}

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

export function useUpsertProject(): (input: {
  slug: string;
  title: string;
  summary: string;
  checkpoint: string;
  artifactJson?: string;
  status?: "draft" | "in_progress" | "submitted" | "published";
  visibility?: "private" | "unlisted" | "public";
}) => Promise<void> {
  const userId = useUserId();
  const upsert = useMutation(api.mutations.upsertProject);
  return useCallback(
    async (input) => {
      await upsert({ userId, ...input });
    },
    [upsert, userId],
  );
}

export function usePublicProjects(limit?: number) {
  const data = useQuery(api.queries.listPublicProjects, {
    ...(limit ? { limit } : {}),
  });
  return data as
    | Array<{
        slug: string;
        title: string;
        summary: string;
        checkpoint: string;
        updatedAt: number;
        displayName: string;
      }>
    | undefined;
}

export function useDeleteAccountData(): () => Promise<void> {
  const userId = useUserId();
  const wipe = useMutation(api.mutations.deleteAccountData);
  return useCallback(async () => {
    await wipe({ userId });
  }, [wipe, userId]);
}
