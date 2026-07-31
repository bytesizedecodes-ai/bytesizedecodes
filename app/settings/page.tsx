"use client";

import { useState } from "react";
import { Shell } from "@/components/Shell";
import {
  useExportProgress,
  useImportProgress,
  useResetProgress,
} from "@/lib/data/provider";

export default function SettingsPage() {
  const exportProgress = useExportProgress();
  const importProgress = useImportProgress();
  const resetProgress = useResetProgress();
  const [message, setMessage] = useState<string | null>(null);

  async function download() {
    const json = await exportProgress();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bytesizedecodes-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Progress file downloaded.");
  }

  async function onImport(file: File | null) {
    if (!file) return;
    try {
      const text = await file.text();
      await importProgress(text);
      setMessage("Progress imported.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Import failed");
    }
  }

  async function onReset() {
    if (!confirm("Reset all local progress? This cannot be undone.")) return;
    await resetProgress();
    setMessage("Progress reset.");
  }

  return (
    <Shell>
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Progress is stored on the Convex dev database, keyed to this browser. Export
            a backup before clearing cache or switching devices.
          </p>
        </div>

        <div className="card space-y-3 p-5">
          <h2 className="text-sm font-semibold">Progress</h2>
          <button
            type="button"
            onClick={download}
            className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white"
          >
            Export progress
          </button>
          <label className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-ash bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-ash/40">
            Import progress
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => void onImport(e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type="button"
            onClick={() => void onReset()}
            className="w-full rounded-xl border border-bad/30 bg-bad-wash px-4 py-3 text-sm font-semibold text-bad"
          >
            Reset progress
          </button>
          {message && <p className="text-sm text-ink-soft">{message}</p>}
        </div>
      </div>
    </Shell>
  );
}
