"use client";

import { useState } from "react";
import { useAdminFeedback, useUpdateFeedbackStatus } from "@/lib/data/provider";

const STATUSES = ["all", "new", "viewed", "in_progress", "resolved", "wontfix"] as const;

export default function AdminFeedbackPage() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("new");
  const [expanded, setExpanded] = useState<string | null>(null);
  const feedback = useAdminFeedback(status === "all" ? undefined : status);
  const updateStatus = useUpdateFeedbackStatus();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Feedback</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Triage issues, ideas, and praise from learners. Reply and resolve.
        </p>
      </header>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setStatus(s);
              setExpanded(null);
            }}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              status === s ? "bg-ink text-white" : "bg-ash/70 text-ink-soft hover:bg-ash"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* List */}
      {feedback === undefined ? (
        <div className="text-sm text-ink-faint">Loading feedback…</div>
      ) : feedback.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm font-medium text-ink">No feedback in this view</p>
          <p className="mt-1 text-sm text-ink-soft">Try a different status filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((f) => (
            <div key={f._id} className="card overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setExpanded(expanded === f._id ? null : f._id);
                  if (f.status === "new") updateStatus({ id: f._id, status: "viewed" });
                }}
                className="flex w-full items-start gap-3 px-4 py-3 text-left"
              >
                <KindBadge kind={f.kind} />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm text-ink">{f.body}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-faint">
                    <span>{fmtDate(f.createdAt)}</span>
                    {f.url ? (
                      <>
                        <span>·</span>
                        <span className="truncate">{f.url}</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <StatusBadge status={f.status} />
              </button>

              {expanded === f._id ? (
                <div className="border-t border-ash bg-ash/30 px-4 py-3">
                  <p className="text-sm leading-relaxed text-ink">{f.body}</p>
                  {f.url ? (
                    <p className="mt-2 text-xs text-brand-deep">
                      Submitted from:{" "}
                      <a href={f.url} className="underline" target="_blank" rel="noreferrer">
                        {f.url}
                      </a>
                    </p>
                  ) : null}
                  {f.adminReply ? (
                    <p className="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-ink-soft">
                      <span className="font-bold text-ink">Admin reply:</span> {f.adminReply}
                    </p>
                  ) : null}

                  {/* Triage actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <TriageBtn
                      label="In progress"
                      active={f.status === "in_progress"}
                      onClick={() => updateStatus({ id: f._id, status: "in_progress" })}
                    />
                    <TriageBtn
                      label="Resolved"
                      active={f.status === "resolved"}
                      onClick={() => updateStatus({ id: f._id, status: "resolved" })}
                    />
                    <TriageBtn
                      label="Won't fix"
                      active={f.status === "wontfix"}
                      onClick={() => updateStatus({ id: f._id, status: "wontfix" })}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function KindBadge({ kind }: { kind: string }) {
  const tone =
    kind === "bug"
      ? "bg-bad-wash text-bad"
      : kind === "content_error"
        ? "bg-warm-wash text-ink"
        : kind === "praise"
          ? "bg-good-wash text-good"
          : "bg-brand-wash text-brand-deep";
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${tone}`}>
      {kind.replace("_", " ")}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "new"
      ? "bg-bad text-white"
      : status === "resolved" || status === "wontfix"
        ? "bg-good text-white"
        : "bg-ink text-white";
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${tone}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function TriageBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={active}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
        active ? "bg-ink text-white" : "border border-ash bg-white text-ink-soft hover:bg-brand-wash/40"
      }`}
    >
      {label}
    </button>
  );
}

function fmtDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}
