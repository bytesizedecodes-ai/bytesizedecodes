"use client";

/**
 * React bindings — Convex-backed with Convex Auth (social identity).
 *
 * Components import hooks from here and nowhere else. User data requires a
 * signed-in session; free public pages skip personal queries when unauthenticated.
 */

import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import {
  ConvexReactClient,
  useAction,
  useMutation,
  useQuery,
} from "convex/react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { todayKey, type DayKey } from "../day";
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

/**
 * After social sign-in, ensure a profiles row exists and OAuth name/email
 * are applied so getProfile can return them.
 */
function ProfileEnsure({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const ensure = useMutation(api.mutations.ensureProfile);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    void ensure({ userId: AUTH_USER_ID });
  }, [isLoading, isAuthenticated, ensure]);

  return <>{children}</>;
}

/** Mounts Convex Auth + the Convex client. */
export function DataProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <ProfileEnsure>{children}</ProfileEnsure>
    </ConvexAuthNextjsProvider>
  );
}

/** Current IST day, stable for the component's lifetime. */
export function useToday(): DayKey {
  return useMemo(() => todayKey(), []);
}

/**
 * Placeholder userId arg — server ignores it and uses ctx.auth subject.
 * Kept for Convex API shape stability.
 */
const AUTH_USER_ID = "auth";

function useAuthGate(): { ready: boolean; authed: boolean } {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return { ready: !isLoading, authed: isAuthenticated };
}

// ---------- reads ----------

export function useCurrentUser(): Profile | undefined | null {
  const { ready, authed } = useAuthGate();
  const today = useToday();
  const data = useQuery(
    api.queries.getProfile,
    ready && authed ? { userId: AUTH_USER_ID, today } : "skip",
  );
  if (!ready) return undefined;
  if (!authed) return null;
  if (data === undefined) return undefined;
  if (data === null) return null;
  return data as Profile;
}

/**
 * Single source of truth for navigation/auth-gating decisions.
 *
 *   - "loading"  — auth still resolving
 *   - "unauthed" — no signed-in session
 *   - "authed"   — social identity session is live
 */
export function useAuthState(): {
  status: "loading" | "unauthed" | "authed";
  profile: Profile | undefined | null;
  hasProfile: boolean;
} {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const profile = useCurrentUser();
  const hasProfile = Boolean(profile?.onboardingCompletedAt);
  if (isLoading) return { status: "loading", profile, hasProfile };
  return { status: isAuthenticated ? "authed" : "unauthed", profile, hasProfile };
}

export function useDayProgress(today: DayKey): DayProgress | undefined {
  const { ready, authed } = useAuthGate();
  const data = useQuery(
    api.queries.getDayProgress,
    ready && authed ? { userId: AUTH_USER_ID, today } : "skip",
  );
  if (!ready || !authed) return undefined;
  return data as DayProgress | undefined;
}

export function useDailyPlan(
  today: DayKey,
  timeMode?: TimeMode,
): DailyPlan | undefined {
  const { ready, authed } = useAuthGate();
  const data = useQuery(
    api.queries.getDailyPlan,
    ready && authed
      ? { userId: AUTH_USER_ID, today, ...(timeMode ? { timeMode } : {}) }
      : "skip",
  );
  if (!ready || !authed) return undefined;
  return data as DailyPlan | undefined;
}

export function useReviewQueue(today: DayKey): ReviewCard[] | undefined {
  const { ready, authed } = useAuthGate();
  const data = useQuery(
    api.queries.getReviewQueue,
    ready && authed ? { userId: AUTH_USER_ID, today } : "skip",
  );
  if (!ready || !authed) return undefined;
  return data as ReviewCard[] | undefined;
}

export function useByteProgress(slug: string): ByteProgress | undefined {
  const { ready, authed } = useAuthGate();
  const data = useQuery(
    api.queries.getByteProgress,
    ready && authed ? { userId: AUTH_USER_ID, slug } : "skip",
  );
  if (!ready) return undefined;
  if (!authed) {
    return {
      slug,
      status: "unseen",
      completedDay: null,
      xpEarned: 0,
      draftAnswers: null,
      draftChecked: null,
      draftCode: null,
      exercisePassed: false,
    };
  }
  if (data === undefined) return undefined;
  return data as ByteProgress;
}

export function useAllByteProgress(): Record<string, ByteProgress> | undefined {
  const { ready, authed } = useAuthGate();
  const data = useQuery(
    api.queries.getAllByteProgress,
    ready && authed ? { userId: AUTH_USER_ID } : "skip",
  );
  if (!ready) return undefined;
  if (!authed) return {};
  return data as Record<string, ByteProgress> | undefined;
}

export function useTopicMastery(today: DayKey): TopicMastery[] | undefined {
  const { ready, authed } = useAuthGate();
  const data = useQuery(
    api.queries.getTopicMastery,
    ready && authed ? { userId: AUTH_USER_ID, today } : "skip",
  );
  if (!ready || !authed) return undefined;
  return data as TopicMastery[] | undefined;
}

export function useRecentXp(days: number, today: DayKey): DayXp[] | undefined {
  const { ready, authed } = useAuthGate();
  const data = useQuery(
    api.queries.getRecentXp,
    ready && authed ? { userId: AUTH_USER_ID, days, today } : "skip",
  );
  if (!ready || !authed) return undefined;
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
  const { ready, authed } = useAuthGate();
  const data = useQuery(
    api.queries.listProjects,
    ready && authed ? { userId: AUTH_USER_ID } : "skip",
  );
  if (!ready || !authed) return undefined;
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
  const submit = useMutation(api.mutations.submitAttempt);
  return useCallback(
    (input: AttemptInput) =>
      submit({ input: { ...input, userId: AUTH_USER_ID } }) as Promise<AttemptResult>,
    [submit],
  );
}

export function useGradeReview(): (input: ReviewInput) => Promise<AttemptResult> {
  const grade = useMutation(api.mutations.gradeReview);
  return useCallback(
    (input: ReviewInput) =>
      grade({ input: { ...input, userId: AUTH_USER_ID } }) as Promise<AttemptResult>,
    [grade],
  );
}

export function useStartByte(): (slug: string) => Promise<void> {
  const start = useMutation(api.mutations.startByte);
  return useCallback(
    async (slug: string) => {
      await start({ userId: AUTH_USER_ID, slug });
    },
    [start],
  );
}

export function useCompleteByte(): (
  slug: string,
  today: DayKey,
  opts?: { requireExercise?: boolean },
) => Promise<AttemptResult> {
  const complete = useMutation(api.mutations.completeByte);
  return useCallback(
    (slug: string, today: DayKey, opts?: { requireExercise?: boolean }) =>
      complete({
        userId: AUTH_USER_ID,
        slug,
        today,
        ...(opts?.requireExercise ? { requireExercise: true } : {}),
      }) as Promise<AttemptResult>,
    [complete],
  );
}

export function useUpdateOnboarding(): (input: OnboardingInput) => Promise<void> {
  const update = useMutation(api.mutations.updateOnboarding);
  return useCallback(
    async (input: OnboardingInput) => {
      await update({ userId: AUTH_USER_ID, ...input });
    },
    [update],
  );
}

export function useTrackEvent(): (input: TrackEventInput) => Promise<void> {
  const track = useMutation(api.mutations.trackEvent);
  return useCallback(
    async (input: TrackEventInput) => {
      await track({
        userId: AUTH_USER_ID,
        name: input.name,
        today: input.today,
        refKey: input.refKey,
        track: input.track,
        mode: input.mode,
      });
    },
    [track],
  );
}

export function useSaveLessonDraft(): (input: LessonDraftInput) => Promise<void> {
  const save = useMutation(api.mutations.saveLessonDraft);
  return useCallback(
    async (input: LessonDraftInput) => {
      await save({
        userId: AUTH_USER_ID,
        slug: input.slug,
        draftAnswers:
          input.draftAnswers !== undefined ? JSON.stringify(input.draftAnswers) : undefined,
        draftChecked:
          input.draftChecked !== undefined ? JSON.stringify(input.draftChecked) : undefined,
        draftCode: input.draftCode,
      });
    },
    [save],
  );
}

export function useRecordCodeTestPass(): (
  slug: string,
  today: DayKey,
  skillIds: string[],
) => Promise<void> {
  const record = useMutation(api.mutations.recordCodeTestPass);
  return useCallback(
    async (slug: string, today: DayKey, skillIds: string[]) => {
      await record({ userId: AUTH_USER_ID, slug, today, skillIds });
    },
    [record],
  );
}

export function useResetProgress(): () => Promise<void> {
  const reset = useMutation(api.mutations.resetProgress);
  return useCallback(async () => {
    await reset({ userId: AUTH_USER_ID });
  }, [reset]);
}

export function useExportProgress(): () => Promise<string> {
  const exportAction = useAction(api.mutations.exportProgress);
  return useCallback(async () => {
    const json = (await exportAction({ userId: AUTH_USER_ID })) as unknown as string;
    return json;
  }, [exportAction]);
}

export function useImportProgress(): (json: string) => Promise<void> {
  const importProgress = useMutation(api.mutations.importProgress);
  return useCallback(
    async (json: string) => {
      await importProgress({ userId: AUTH_USER_ID, json });
    },
    [importProgress],
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
  const upsert = useMutation(api.mutations.upsertProject);
  return useCallback(
    async (input) => {
      await upsert({ userId: AUTH_USER_ID, ...input });
    },
    [upsert],
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
  const wipe = useMutation(api.mutations.deleteAccountData);
  return useCallback(async () => {
    await wipe({ userId: AUTH_USER_ID });
  }, [wipe]);
}

/* ------------------------------------------------------------------ */
/* Admin + feedback (the user→admin loop).                            */
/* ------------------------------------------------------------------ */

export function useAdminStats() {
  return useQuery(api.admin.queries.getStats, {});
}

export function useAdminUsers(limit = 50) {
  return useQuery(api.admin.queries.listUsers, { limit });
}

export function useAdminFeedback(status?: string) {
  return useQuery(api.admin.queries.listFeedback, status ? { status } : {});
}

export function useUpdateFeedbackStatus() {
  return useMutation(api.admin.mutations.updateFeedbackStatus);
}

/** Attempt to promote the calling authenticated user to admin (idempotent). */
export function useBootstrapAdminRole(): () => Promise<{ promoted: boolean; reason: string }> {
  const bootstrap = useMutation(api.admin.mutations.bootstrapAdminRole);
  return useCallback(async () => {
    return (await bootstrap({})) as { promoted: boolean; reason: string };
  }, [bootstrap]);
}

/** PUBLIC — submit user feedback (no admin role needed — still needs sign-in). */
export function useSubmitFeedback() {
  const submit = useMutation(api.admin.mutations.submitFeedback);
  return useCallback(
    async (input: {
      kind: "bug" | "content_error" | "idea" | "praise" | "other";
      body: string;
      url?: string;
    }) => {
      await submit({ userId: AUTH_USER_ID, ...input });
    },
    [submit],
  );
}
