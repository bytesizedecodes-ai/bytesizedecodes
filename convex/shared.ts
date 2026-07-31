/**
 * Server-resident copy of the PersistedStateV1 export blob shape.
 *
 * Kept self-contained (no imports from lib/data/types or lib/srs) so the convex/ tree
 * has no cross-boundary type coupling to the client. The client's PersistedStateV1 in
 * lib/data/types.ts is the authoritative source; this mirrors it for export/import.
 */

export type Track = "grad" | "beginner" | "engineer" | "founder";

export type PracticeMode = "byte" | "review" | "practice";

export interface PersistedSrsEntry {
  itemKey: string;
  topic: string;
  ease: number;
  intervalDays: number;
  dueDay: string;
  reps: number;
  lapses: number;
  lastReviewedDay: string | null;
}

export interface PersistedByteEntry {
  status: "started" | "completed";
  completedDay: string | null;
  xpEarned: number;
}

export interface PersistedAttempt {
  itemKey: string;
  topic: string;
  mode: PracticeMode;
  correct: boolean;
  msTaken: number;
  day: string;
  at: number;
}

export interface PersistedXpEvent {
  amount: number;
  reason: string;
  refKey: string | null;
  day: string;
  at: number;
}

export interface PersistedStateV1 {
  version: 1;
  userId: string;
  displayName: string;
  track: Track;
  createdAt: number;
  xpTotal: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDay: string | null;
  streakFreezes: number;
  srs: Record<string, PersistedSrsEntry>;
  bytes: Record<string, PersistedByteEntry>;
  /** Newest first, capped. */
  attempts: PersistedAttempt[];
  /** Newest first, capped. */
  xpEvents: PersistedXpEvent[];
}
