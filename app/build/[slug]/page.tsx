"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { RequireOnboarding } from "@/components/RequireOnboarding";
import { RequireAuth } from "@/components/RequireAuth";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { useProjects, useUpsertProject } from "@/lib/data/provider";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const projects = useProjects();
  const upsert = useUpsertProject();
  const project = projects?.find((item) => item.slug === slug);
  const [brief, setBrief] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Keep local editor empty until the learner types; checkpoints are saved explicitly.
  }, [slug]);

  if (projects && !project) notFound();

  async function saveCheckpoint(nextVisibility?: "private" | "public") {
    if (!project) return;
    setSaving(true);
    setMessage(null);
    try {
      const visibility = nextVisibility ?? (project.visibility as "private" | "unlisted" | "public");
      await upsert({
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        checkpoint: brief.trim() ? "evaluation_cases" : project.checkpoint,
        status: visibility === "public" ? "published" : "in_progress",
        visibility,
        artifactJson: JSON.stringify({ problemBrief: brief }),
      });
      setMessage(
        visibility === "public"
          ? "Published to the opt-in gallery."
          : "Checkpoint saved privately.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell active="/build">
      <RequireAuth>
      <RequireOnboarding>
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/build" className="text-sm text-ink-faint hover:text-ink-soft">
              ← Build
            </Link>
            <Link href="/gallery" className="text-sm font-semibold text-brand-deep hover:underline">
              Open gallery
            </Link>
          </div>
          {!project ? (
            <div className="h-40 animate-pulse rounded-2xl bg-ash/70" />
          ) : (
            <>
              <header>
                <p className="eyebrow">
                  {project.status.replace("_", " ")} · {project.visibility}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                  {project.title}
                </h1>
                <p className="mt-2 text-sm text-ink-soft">{project.summary}</p>
              </header>
              <section className="card space-y-4 p-5">
                <h2 className="text-sm font-semibold text-ink">Problem brief</h2>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Who is this for, what question should it answer, and what counts as a failure?"
                  className="min-h-36 w-full rounded-xl border border-ash bg-surface-elevated px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
                <div className="flex flex-wrap gap-3">
                  <Button disabled={saving} onClick={() => void saveCheckpoint("private")}>
                    {saving ? "Saving…" : "Save private"}
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={saving}
                    onClick={() => void saveCheckpoint("public")}
                  >
                    Publish to gallery
                  </Button>
                  {project.visibility === "public" && (
                    <Button
                      variant="ghost"
                      disabled={saving}
                      onClick={() => void saveCheckpoint("private")}
                    >
                      Unpublish
                    </Button>
                  )}
                </div>
                {message && (
                  <p role="status" className="text-xs text-ink-soft">
                    {message}
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </RequireOnboarding>
      </RequireAuth>
    </Shell>
  );
}
