"use client";

import Link from "next/link";
import { useState } from "react";
import { Hammer, Plus } from "lucide-react";
import { RequireOnboarding } from "@/components/RequireOnboarding";
import { RequireAuth } from "@/components/RequireAuth";
import { Shell } from "@/components/Shell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { useProjects, useUpsertProject } from "@/lib/data/provider";

export default function BuildPage() {
  const projects = useProjects();
  const upsert = useUpsertProject();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startStarter() {
    setCreating(true);
    setError(null);
    try {
      await upsert({
        slug: "grounded-faq-assistant",
        title: "Grounded FAQ assistant",
        summary:
          "Define good answers, evaluate a prototype, and decide how a human should oversee it.",
        checkpoint: "problem_brief",
        status: "in_progress",
        visibility: "private",
        artifactJson: JSON.stringify({
          problemBrief: "",
          evaluationCases: [],
          demoUrl: "",
          riskRegister: [],
        }),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create project");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Shell active="/build">
      <RequireAuth>
      <RequireOnboarding>
        <div className="mx-auto max-w-5xl space-y-8">
          <PageHeader
            eyebrow="Build"
            title="Turn learning into an artifact"
            description="Private by default. Publish only when you want your project in the opt-in gallery."
            aside={
              <Link
                href="/gallery"
                className="inline-flex min-h-11 items-center rounded-xl border border-ash bg-surface-elevated px-4 text-sm font-semibold text-ink"
              >
                Gallery
              </Link>
            }
          />

          <section className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-wash text-brand-deep">
                  <Hammer className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-ink">Starter project</h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    Build and evaluate a grounded FAQ assistant — the shared Phase 5 starter.
                  </p>
                </div>
              </div>
              <Button disabled={creating} onClick={() => void startStarter()}>
                <Plus className="h-4 w-4" />
                {creating ? "Creating…" : "Start project"}
              </Button>
            </div>
            {error && <p className="mt-4 text-sm text-bad">{error}</p>}
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-ink">Your projects</h2>
            {projects === undefined ? (
              <div className="h-28 animate-pulse rounded-2xl bg-ash/70" />
            ) : projects.length === 0 ? (
              <div className="card p-5 text-sm text-ink-soft">
                No projects yet. Start the FAQ assistant when you want a durable artifact
                beyond drills and lessons.
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/build/${project.slug}`}
                  className="card-interactive focus-ring block p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{project.title}</p>
                      <p className="mt-1 text-xs text-ink-soft">{project.summary}</p>
                    </div>
                    <span className="rounded-full bg-ash px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                      {project.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-ink-faint">
                    Checkpoint: {project.checkpoint.replaceAll("_", " ")} · {project.visibility}
                  </p>
                </Link>
              ))
            )}
          </section>
        </div>
      </RequireOnboarding>
      </RequireAuth>
    </Shell>
  );
}
