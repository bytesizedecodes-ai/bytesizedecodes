"use client";

import Link from "next/link";
import {
  Download,
  Flame,
  RotateCcw,
  Settings2,
  Snowflake,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Shell } from "@/components/Shell";
import { RequireAuth } from "@/components/RequireAuth";
import { COURSES, courseLessonKey } from "@/content/courses";
import { getLearningTrack } from "@/content/tracks";
import {
  useAllByteProgress,
  useCurrentUser,
  useDeleteAccountData,
  useExportProgress,
  useImportProgress,
  useResetProgress,
  useToday,
  useReviewQueue,
} from "@/lib/data/provider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ProfilePage() {
  const profile = useCurrentUser();
  const progress = useAllByteProgress();
  const today = useToday();
  const due = useReviewQueue(today);
  const { signOut } = useAuthActions();
  const exportProgress = useExportProgress();
  const importProgress = useImportProgress();
  const resetProgress = useResetProgress();
  const deleteAccountData = useDeleteAccountData();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const track = getLearningTrack(profile?.track ?? "beginner");

  const courseRows = useMemo(() => {
    if (!progress) return [];
    return COURSES.map((course) => {
      const total = course.lessons.length;
      const completed = course.lessons.filter(
        (l) => progress[courseLessonKey(course.slug, l.slug)]?.status === "completed",
      ).length;
      const started = course.lessons.some((l) => {
        const s = progress[courseLessonKey(course.slug, l.slug)]?.status;
        return s === "started" || s === "completed";
      });
      return {
        slug: course.slug,
        title: course.title,
        access: course.access,
        total,
        completed,
        status:
          completed === total && total > 0
            ? ("done" as const)
            : started
              ? ("in_progress" as const)
              : ("not_started" as const),
      };
    }).filter((row) => row.status !== "not_started");
  }, [progress]);

  async function download() {
    setBusy(true);
    try {
      const json = await exportProgress();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `bytesizedecodes-progress-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage("Progress file downloaded.");
    } finally {
      setBusy(false);
    }
  }

  async function onImport(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      await importProgress(await file.text());
      setMessage("Progress imported.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    if (!confirm("Reset all bytesizedecodes progress? This cannot be undone.")) return;
    setBusy(true);
    try {
      await resetProgress();
      setMessage("Progress reset.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (
      !confirm(
        "Delete all learning data for this account on the server? You will be signed out. Export first if you want a backup.",
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await deleteAccountData();
      await signOut();
      setMessage("Account data deleted.");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell active="/profile">
      <RequireAuth>
        <div className="mx-auto max-w-4xl space-y-8">
          <PageHeader
            eyebrow="Profile"
            title="Your account"
            description="Social identity, learning path, course progress, and privacy controls."
          />

          {/* Identity */}
          <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
            {profile?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.imageUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-wash text-xl font-bold text-brand-deep">
                {(profile?.displayName ?? "?").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-semibold text-ink">
                {profile?.displayName ?? "Learner"}
              </h2>
              <p className="mt-1 truncate text-sm text-ink-soft">
                {profile?.email ?? "Signed-in account"}
              </p>
              {profile === undefined && (
                <p className="mt-2 text-xs text-ink-faint">Loading profile…</p>
              )}
            </div>
            <Button variant="secondary" onClick={() => void signOut()}>
              Sign out
            </Button>
          </section>

          {/* Stats */}
          <section className="grid gap-3 sm:grid-cols-4">
            <StatCard
              icon={<Star className="h-4 w-4" />}
              label="Level"
              value={profile ? String(profile.level) : "—"}
              detail={
                profile
                  ? `${profile.xpTotal} Energy · ${profile.levelProgress.into}/${profile.levelProgress.span}`
                  : undefined
              }
            />
            <StatCard
              icon={<Flame className="h-4 w-4" />}
              label="Streak"
              value={profile ? String(profile.currentStreak) : "—"}
              detail={profile ? `Best ${profile.longestStreak}` : undefined}
            />
            <StatCard
              icon={<Snowflake className="h-4 w-4" />}
              label="Freezes"
              value={profile ? String(profile.streakFreezes) : "—"}
            />
            <StatCard
              icon={<Settings2 className="h-4 w-4" />}
              label="Due today"
              value={due ? String(due.length) : "—"}
              detail="Review queue"
            />
          </section>

          {/* Path */}
          <section className="card grid gap-0 overflow-hidden md:grid-cols-[1fr_0.7fr]">
            <div className="p-6">
              <Badge>{track.shortTitle}</Badge>
              <h2 className="mt-4 text-xl font-semibold text-ink">{track.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{track.promise}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-ink-faint">
                <span className="rounded-full bg-ash/70 px-3 py-1.5">
                  Level: {profile?.startingLevel ?? "not selected"}
                </span>
                <span className="rounded-full bg-ash/70 px-3 py-1.5">
                  Session: {profile?.preferredTimeMode ?? "standard"}
                </span>
                <span className="rounded-full bg-ash/70 px-3 py-1.5">
                  {profile?.weeklyMinutes ?? 75} min/week
                </span>
              </div>
              <Link
                href="/onboarding"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-deep hover:underline"
              >
                <Settings2 className="h-4 w-4" /> Change learning preferences
              </Link>
            </div>
            <div className="flex items-center bg-brand-wash p-6">
              <div>
                <p className="text-sm font-semibold text-ink">Daily habit</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                  Open Today to complete one useful plan step — streak and Energy update when you
                  practise, not when you only open the app.
                </p>
                <Link
                  href="/today"
                  className="mt-4 inline-flex text-sm font-semibold text-brand-deep hover:underline"
                >
                  Go to Today →
                </Link>
              </div>
            </div>
          </section>

          {/* Courses */}
          <section className="card space-y-4 p-6">
            <div>
              <h2 className="text-lg font-semibold text-ink">Courses</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                In progress and completed courses on this account.
              </p>
            </div>
            {progress === undefined ? (
              <p className="text-sm text-ink-faint">Loading…</p>
            ) : courseRows.length === 0 ? (
              <p className="text-sm text-ink-soft">
                No course progress yet.{" "}
                <Link href="/courses" className="font-semibold text-brand-deep hover:underline">
                  Browse free courses
                </Link>
              </p>
            ) : (
              <ul className="divide-y divide-ash">
                {courseRows.map((row) => (
                  <li key={row.slug} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <Link
                        href={`/courses/${row.slug}`}
                        className="font-semibold text-ink hover:underline"
                      >
                        {row.title}
                      </Link>
                      <p className="text-xs text-ink-faint">
                        {row.completed} of {row.total} lessons · {row.access}
                      </p>
                    </div>
                    <Badge tone={row.status === "done" ? "good" : "brand"}>
                      {row.status === "done" ? "Done" : "In progress"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Privacy */}
          <section className="card space-y-4 p-6">
            <div>
              <h2 className="text-lg font-semibold text-ink">Progress and privacy</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                Download a backup, restore one, reset learning state, or delete server data.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button className="w-full" onClick={() => void download()} disabled={busy}>
                <Download className="h-4 w-4" /> Export progress
              </Button>
              <label className="focus-ring flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-ash bg-surface-elevated px-4 py-2.5 text-sm font-semibold text-ink hover:border-brand-muted">
                <Upload className="h-4 w-4" /> Import progress
                <input
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  disabled={busy}
                  onChange={(event) => void onImport(event.target.files?.[0] ?? null)}
                />
              </label>
              <Button
                variant="secondary"
                className="w-full text-bad"
                onClick={() => void onReset()}
                disabled={busy}
              >
                <RotateCcw className="h-4 w-4" /> Reset progress
              </Button>
              <Button
                variant="ghost"
                className="w-full text-bad"
                onClick={() => void onDelete()}
                disabled={busy}
              >
                <Trash2 className="h-4 w-4" /> Delete account data
              </Button>
            </div>
            {message && (
              <p role="status" className="rounded-xl bg-brand-wash px-3 py-2 text-xs text-ink-soft">
                {message}
              </p>
            )}
          </section>
        </div>
      </RequireAuth>
    </Shell>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-ink-faint">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {detail && <p className="mt-0.5 text-xs text-ink-faint">{detail}</p>}
    </div>
  );
}
