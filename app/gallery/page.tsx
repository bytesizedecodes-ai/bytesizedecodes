"use client";

import Link from "next/link";
import { Globe2 } from "lucide-react";
import { Shell } from "@/components/Shell";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePublicProjects } from "@/lib/data/provider";

export default function GalleryPage() {
  const projects = usePublicProjects(24);

  return (
    <Shell active="/build">
      <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader
          eyebrow="Gallery"
          title="Opt-in project gallery"
          description="Only projects learners explicitly publish appear here. Private drafts stay private."
          aside={
            <Link
              href="/build"
              className="inline-flex min-h-11 items-center rounded-xl border border-ash bg-white px-4 text-sm font-semibold text-ink"
            >
              My projects
            </Link>
          }
        />

        {projects === undefined ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl bg-ash/70" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="card flex items-start gap-4 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-wash text-brand-deep">
              <Globe2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Nothing published yet</p>
              <p className="mt-1 text-sm text-ink-soft">
                Start a project under Build, then flip visibility to public when you want
                feedback.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <article key={`${project.displayName}-${project.slug}`} className="card p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                  {project.displayName}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-ink">{project.title}</h2>
                <p className="mt-2 text-sm text-ink-soft">{project.summary}</p>
                <p className="mt-4 text-xs text-ink-faint">
                  Checkpoint: {project.checkpoint.replaceAll("_", " ")}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
