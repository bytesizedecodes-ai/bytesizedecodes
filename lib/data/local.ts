/**
 * In-memory + localStorage store. Mutating methods return Promises with a deliberate delay
 * so every consumer is forced to handle pending and error states — the exact shape Convex
 * mutations will have. Skipping that here guarantees a rewrite when the backend arrives.
 */

import { addDays, asDayKey, type DayKey } from "../day";
import { hashToSeed } from "../drills/rng";
import type { Difficulty } from "../drills/types";
import { describeInterval, dueQueue, mastery, newSrsState, review, type SrsState } from "../srs";
import { settleOnPractice, settleOnRollover } from "./streak";
import {
  applyRepeatDiminishing,
  freezesEarnedAt,
  levelFromXp,
  levelProgress,
  rollByteXp,
  rollDrillXp,
  rollReviewXp,
} from "./xp";
import {
  STORAGE_KEY,
  type AttemptInput,
  type AttemptResult,
  type ByteProgress,
  type DayProgress,
  type DayXp,
  type PersistedStateV1,
  type Profile,
  type ReviewCard,
  type ReviewInput,
  type TopicMastery,
  type UserId,
} from "./types";

const LATENCY_MS = 80;
const ATTEMPT_CAP = 500;
const XP_EVENT_CAP = 500;
const FAKE_USER_ID = "local-user" as UserId;

type Listener = () => void;

function emptyState(): PersistedStateV1 {
  return {
    version: 1,
    userId: FAKE_USER_ID,
    displayName: "You",
    track: "grad",
    createdAt: Date.now(),
    xpTotal: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDay: null,
    streakFreezes: 1,
    srs: {},
    bytes: {},
    attempts: [],
    xpEvents: [],
  };
}

function load(): PersistedStateV1 {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as PersistedStateV1;
    if (parsed.version !== 1) return emptyState();
    return parsed;
  } catch {
    return emptyState();
  }
}

function save(state: PersistedStateV1): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function delay(ms = LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseDrillKey(itemKey: string): { generatorId: string; difficulty: Difficulty } | null {
  // gen:<id>:<difficulty>
  const m = /^gen:([^:]+):([1-5])$/.exec(itemKey);
  if (!m) return null;
  return { generatorId: m[1]!, difficulty: Number(m[2]) as Difficulty };
}

export class LocalStore {
  private state: PersistedStateV1;
  private listeners = new Set<Listener>();
  private ready = false;
  /** Dev-only: when true, the next mutation rejects. */
  private failNext = false;

  constructor() {
    this.state = emptyState();
  }

  /** Call once on the client after mount. */
  hydrate(): void {
    this.state = load();
    this.ready = true;
    this.emit();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const l of this.listeners) l();
  }

  private persist(): void {
    save(this.state);
    this.emit();
  }

  /** Force the next mutation to reject — used to exercise error paths in development. */
  armFailure(): void {
    this.failNext = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  getSnapshot(): PersistedStateV1 {
    return this.state;
  }

  // ---------- reads (synchronous snapshots; hooks wrap them) ----------

  getProfile(today: DayKey): Profile | null {
    if (!this.ready) return null;
    // Apply rollover lazily so a midnight gap is settled even without a cron.
    const settled = settleOnRollover(
      {
        currentStreak: this.state.currentStreak,
        longestStreak: this.state.longestStreak,
        lastPracticeDay: this.state.lastPracticeDay
          ? asDayKey(this.state.lastPracticeDay)
          : null,
        streakFreezes: this.state.streakFreezes,
      },
      today,
    );
    if (
      settled.currentStreak !== this.state.currentStreak ||
      settled.streakFreezes !== this.state.streakFreezes ||
      settled.lastPracticeDay !==
        (this.state.lastPracticeDay ? asDayKey(this.state.lastPracticeDay) : null)
    ) {
      this.state = {
        ...this.state,
        currentStreak: settled.currentStreak,
        longestStreak: settled.longestStreak,
        lastPracticeDay: settled.lastPracticeDay,
        streakFreezes: settled.streakFreezes,
      };
      this.persist();
    }

    const progress = levelProgress(this.state.xpTotal);
    return {
      userId: this.state.userId as UserId,
      displayName: this.state.displayName,
      track: this.state.track,
      xpTotal: this.state.xpTotal,
      level: progress.level,
      levelProgress: { into: progress.into, span: progress.span },
      currentStreak: this.state.currentStreak,
      longestStreak: this.state.longestStreak,
      lastPracticeDay: this.state.lastPracticeDay
        ? asDayKey(this.state.lastPracticeDay)
        : null,
      streakFreezes: this.state.streakFreezes,
      createdAt: this.state.createdAt,
      startingLevel: null,
      weeklyMinutes: null,
      preferredTimeMode: null,
      onboardingCompletedAt: null,
    };
  }

  getDayProgress(today: DayKey): DayProgress {
    const day = today as string;
    const todays = this.state.attempts.filter((a) => a.day === day);
    const xpEarned = this.state.xpEvents
      .filter((e) => e.day === day)
      .reduce((s, e) => s + e.amount, 0);
    return {
      day: today,
      itemsAnswered: todays.length,
      itemsCorrect: todays.filter((a) => a.correct).length,
      xpEarned,
      practised: todays.length > 0 || this.state.lastPracticeDay === day,
    };
  }

  getReviewQueue(today: DayKey): ReviewCard[] {
    const states = Object.values(this.state.srs);
    return dueQueue(states, today).flatMap((s) => {
      const parsed = parseDrillKey(s.itemKey);
      if (!parsed) return [];
      return [
        {
          kind: "generator" as const,
          itemKey: s.itemKey,
          topic: s.topic,
          generatorId: parsed.generatorId,
          difficulty: parsed.difficulty,
          seed: hashToSeed(`${this.state.userId}:${today}:${s.itemKey}`),
          ease: s.ease,
          reps: s.reps,
          lapses: s.lapses,
        },
      ];
    });
  }

  getByteProgress(slug: string): ByteProgress {
    const row = this.state.bytes[slug];
    if (!row) {
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
    return {
      slug,
      status: row.status,
      completedDay: row.completedDay ? asDayKey(row.completedDay) : null,
      xpEarned: row.xpEarned,
      draftAnswers: null,
      draftChecked: null,
      draftCode: null,
      exercisePassed: false,
    };
  }

  getAllByteProgress(): Record<string, ByteProgress> {
    const out: Record<string, ByteProgress> = {};
    for (const slug of Object.keys(this.state.bytes)) {
      out[slug] = this.getByteProgress(slug);
    }
    return out;
  }

  getTopicMastery(today: DayKey): TopicMastery[] {
    const byTopic = new Map<string, SrsState[]>();
    for (const s of Object.values(this.state.srs)) {
      const list = byTopic.get(s.topic) ?? [];
      list.push(s);
      byTopic.set(s.topic, list);
    }
    return [...byTopic.entries()]
      .map(([topic, items]) => {
        const avg =
          items.length === 0
            ? 0
            : items.reduce((sum, s) => sum + mastery(s), 0) / items.length;
        return {
          topic,
          mastery: avg,
          itemCount: items.length,
          dueCount: items.filter((s) => s.dueDay <= today).length,
        };
      })
      .sort((a, b) => b.mastery - a.mastery);
  }

  getRecentXp(days: number, today: DayKey): DayXp[] {
    const out: DayXp[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = addDays(today, -i);
      const xp = this.state.xpEvents
        .filter((e) => e.day === day)
        .reduce((s, e) => s + e.amount, 0);
      out.push({
        day,
        xp,
        practised: this.state.attempts.some((a) => a.day === day) || xp > 0,
      });
    }
    return out;
  }

  // ---------- mutations ----------

  private async gate(): Promise<void> {
    await delay();
    if (this.failNext) {
      this.failNext = false;
      throw new Error("Simulated failure (dev flag). Retry.");
    }
    if (!this.ready) throw new Error("Store not hydrated");
  }

  private applyPractice(today: DayKey): { extended: boolean; freezeEarned: boolean } {
    const before = this.state.currentStreak;
    const settlement = settleOnPractice(
      {
        currentStreak: this.state.currentStreak,
        longestStreak: this.state.longestStreak,
        lastPracticeDay: this.state.lastPracticeDay
          ? asDayKey(this.state.lastPracticeDay)
          : null,
        streakFreezes: this.state.streakFreezes,
      },
      today,
    );

    const freezesBefore = freezesEarnedAt(before);
    const freezesAfter = freezesEarnedAt(settlement.fields.currentStreak);
    const freezeEarned = freezesAfter > freezesBefore;

    this.state = {
      ...this.state,
      currentStreak: settlement.fields.currentStreak,
      longestStreak: settlement.fields.longestStreak,
      lastPracticeDay: settlement.fields.lastPracticeDay,
      streakFreezes: settlement.fields.streakFreezes + (freezeEarned ? 1 : 0),
    };

    return { extended: settlement.extended, freezeEarned };
  }

  private awardXp(
    amount: number,
    reason: string,
    refKey: string | null,
    day: DayKey,
  ): { xpTotal: number; level: number; leveledUp: boolean } {
    const before = levelFromXp(this.state.xpTotal);
    const xpTotal = this.state.xpTotal + amount;
    const level = levelFromXp(xpTotal);
    this.state = {
      ...this.state,
      xpTotal,
      xpEvents: [
        { amount, reason, refKey, day, at: Date.now() },
        ...this.state.xpEvents,
      ].slice(0, XP_EVENT_CAP),
    };
    return { xpTotal, level, leveledUp: level > before };
  }

  private recordAttempt(input: AttemptInput): void {
    this.state = {
      ...this.state,
      attempts: [
        {
          itemKey: input.itemKey,
          topic: input.topic,
          mode: input.mode,
          correct: input.correct,
          msTaken: input.msTaken,
          day: input.today,
          at: Date.now(),
        },
        ...this.state.attempts,
      ].slice(0, ATTEMPT_CAP),
    };
  }

  private ensureSrs(itemKey: string, topic: string, today: DayKey): SrsState {
    const existing = this.state.srs[itemKey];
    if (existing) return existing;
    const created = newSrsState(itemKey, topic, today);
    this.state = { ...this.state, srs: { ...this.state.srs, [itemKey]: created } };
    return created;
  }

  async submitAttempt(input: AttemptInput): Promise<AttemptResult> {
    await this.gate();
    const alreadyCorrectToday = this.state.attempts.some(
      (attempt) =>
        attempt.day === input.today &&
        attempt.itemKey === input.itemKey &&
        attempt.correct,
    );
    this.recordAttempt(input);

    let xpAwarded = 0;
    let critical = false;
    let nextReview: string | null = null;

    let leveledUp = false;
    if (input.correct) {
      const roll = applyRepeatDiminishing(
        rollDrillXp(this.state.userId, input.today, input.itemKey),
        alreadyCorrectToday,
      );
      xpAwarded = roll.amount;
      critical = roll.critical;
      const award = this.awardXp(roll.amount, roll.reason, input.itemKey, input.today);
      leveledUp = award.leveledUp;

      // First exposure creates the review card; subsequent correct practice doesn't
      // advance the schedule — that is what review mode is for.
      const state = this.ensureSrs(input.itemKey, input.topic, input.today);
      nextReview = describeInterval(Math.max(1, state.intervalDays));
    }

    const { extended, freezeEarned } = this.applyPractice(input.today);
    this.persist();

    const progress = levelProgress(this.state.xpTotal);
    return {
      xpAwarded,
      critical,
      xpTotal: this.state.xpTotal,
      level: progress.level,
      leveledUp,
      currentStreak: this.state.currentStreak,
      streakExtended: extended,
      freezeEarned,
      nextReview,
    };
  }

  async gradeReview(input: ReviewInput): Promise<AttemptResult> {
    await this.gate();
    this.recordAttempt(input);

    const existing = this.ensureSrs(input.itemKey, input.topic, input.today);
    const updated = review(existing, input.grade, input.today);
    this.state = { ...this.state, srs: { ...this.state.srs, [input.itemKey]: updated } };

    let xpAwarded = 0;
    let critical = false;
    let leveledUp = false;
    if (input.correct) {
      const roll = rollReviewXp(this.state.userId, input.today, input.itemKey);
      xpAwarded = roll.amount;
      critical = roll.critical;
      const award = this.awardXp(roll.amount, roll.reason, input.itemKey, input.today);
      leveledUp = award.leveledUp;
    }

    const { extended, freezeEarned } = this.applyPractice(input.today);
    this.persist();

    const progress = levelProgress(this.state.xpTotal);
    return {
      xpAwarded,
      critical,
      xpTotal: this.state.xpTotal,
      level: progress.level,
      leveledUp,
      currentStreak: this.state.currentStreak,
      streakExtended: extended,
      freezeEarned,
      nextReview: describeInterval(updated.intervalDays),
    };
  }

  async startByte(slug: string): Promise<void> {
    await this.gate();
    const existing = this.state.bytes[slug];
    if (existing?.status === "completed") return;
    this.state = {
      ...this.state,
      bytes: {
        ...this.state.bytes,
        [slug]: existing ?? { status: "started", completedDay: null, xpEarned: 0 },
      },
    };
    this.persist();
  }

  async completeByte(slug: string, today: DayKey): Promise<AttemptResult> {
    await this.gate();
    const existing = this.state.bytes[slug];
    if (existing?.status === "completed") {
      const progress = levelProgress(this.state.xpTotal);
      return {
        xpAwarded: 0,
        critical: false,
        xpTotal: this.state.xpTotal,
        level: progress.level,
        leveledUp: false,
        currentStreak: this.state.currentStreak,
        streakExtended: false,
        freezeEarned: false,
        nextReview: null,
      };
    }

    const roll = rollByteXp(this.state.userId, today, slug);
    const award = this.awardXp(roll.amount, roll.reason, `byte:${slug}`, today);
    this.state = {
      ...this.state,
      bytes: {
        ...this.state.bytes,
        [slug]: { status: "completed", completedDay: today, xpEarned: roll.amount },
      },
    };
    const { extended, freezeEarned } = this.applyPractice(today);
    this.persist();

    return {
      xpAwarded: roll.amount,
      critical: false,
      xpTotal: award.xpTotal,
      level: award.level,
      leveledUp: award.leveledUp,
      currentStreak: this.state.currentStreak,
      streakExtended: extended,
      freezeEarned,
      nextReview: null,
    };
  }

  async resetProgress(): Promise<void> {
    await this.gate();
    this.state = emptyState();
    this.persist();
  }

  exportProgress(): string {
    return JSON.stringify(this.state, null, 2);
  }

  async importProgress(json: string): Promise<void> {
    await this.gate();
    const parsed = JSON.parse(json) as PersistedStateV1;
    if (parsed.version !== 1) throw new Error("Unsupported progress file version");
    this.state = parsed;
    this.persist();
  }
}

/** Singleton used by the React provider. */
export const localStore = new LocalStore();
