"use client";

import { useByteProgress } from "@/lib/data/provider";

export function ByteStatus({ slug }: { slug: string }) {
  const progress = useByteProgress(slug);
  if (!progress || progress.status === "unseen") return null;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
        progress.status === "completed"
          ? "bg-good-wash text-good"
          : "bg-ash text-ink-soft"
      }`}
    >
      {progress.status === "completed" ? "Done" : "Started"}
    </span>
  );
}
