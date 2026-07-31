"use client";

import Link from "next/link";
import {
  Download,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Shell } from "@/components/Shell";
import { LoginCard } from "@/components/LoginCard";
import { getLearningTrack } from "@/content/tracks";
import {
  useCurrentUser,
  useDeleteAccountData,
  useExportProgress,
  useImportProgress,
  useResetProgress,
} from "@/lib/data/provider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ProfilePage() {
  const profile = useCurrentUser();
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const exportProgress = useExportProgress();
  const importProgress = useImportProgress();
  const resetProgress = useResetProgress();
  const deleteAccountData = useDeleteAccountData();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const track = getLearningTrack(profile?.track ?? "beginner");

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
      <div className="mx-auto max-w-4xl space-y-8">
        <PageHeader
          eyebrow="Profile"
          title="Your path and your data"
          description="Anonymous by default. Link Google later for cross-device continuity. Your export, import, and delete controls stay here."
        />

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
              <ShieldCheck className="h-6 w-6 text-brand-deep" />
              <p className="mt-3 text-sm font-semibold text-ink">
                {isAuthenticated ? "Authenticated session" : "Anonymous session"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                {isAuthenticated
                  ? "This browser is signed in through Convex Auth. Projects stay private unless you publish them."
                  : "No password and no public profile. Export before clearing browser storage."}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="card space-y-4 p-6">
            <div>
              <h2 className="text-lg font-semibold text-ink">Progress and privacy</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                Download a backup, restore one, reset learning state, or delete server data.
              </p>
            </div>
            <Button className="w-full" onClick={() => void download()} disabled={busy}>
              <Download className="h-4 w-4" /> Export progress
            </Button>
            <label className="focus-ring flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-ash bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-brand-muted">
              <Upload className="h-4 w-4" /> Import progress
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                disabled={busy}
                onChange={(event) => void onImport(event.target.files?.[0] ?? null)}
              />
            </label>
            <Button variant="secondary" className="w-full text-bad" onClick={() => void onReset()} disabled={busy}>
              <RotateCcw className="h-4 w-4" /> Reset progress
            </Button>
            <Button variant="ghost" className="w-full text-bad" onClick={() => void onDelete()} disabled={busy}>
              <Trash2 className="h-4 w-4" /> Delete account data
            </Button>
            {message && (
              <p role="status" className="rounded-xl bg-brand-wash px-3 py-2 text-xs text-ink-soft">
                {message}
              </p>
            )}
          </section>

          <LoginCard />
        </div>
      </div>
    </Shell>
  );
}
