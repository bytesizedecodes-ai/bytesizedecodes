"use client";

import { useState } from "react";
import { useAdminFeedback, useUpdateFeedbackStatus } from "@/lib/data/provider";
import type { Id } from "@/convex/_generated/dataModel";

const STATUSES = ["all", "new", "viewed", "in_progress", "resolved", "wontfix"] as const;

/**
 * Defense-in-depth: only render http(s) URLs as clickable links. React does NOT
 * neutralize `javascript:` (or other) schemes in `href`, so a feedback item whose
 * `url` is a malicious scheme would execute script in an admin's session when
 * clicked. The backend now strips non-http(s) urls on write; this guards anything
 * already stored.
 */
function safeHref(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.toString();
    return undefined;
  } catch {
    return undefined;
  }
}

export default function AdminFeedbackPage() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("new");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const feedback = useAdminFeedback(status === "all" ? undefined : status);
  const updateStatus = useUpdateFeedbackStatus();

  async function saveReply(id: Id<"feedback">, nextStatus?: "viewed" | "in_progress" | "resolved" | "wontfix") {
    const item = feedback?.find((f) => f._id === id);
    if (!item) return;
    setSaving(id);
    try {
      const draft = replyDrafts[id] ?? item.adminReply ?? "";
      await updateStatus({
        id,
        status: nextStatus ?? (item.status as "new" | "viewed" | "in_progress" | "resolved" | "wontfix"),
        adminReply: draft,
      });
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Feedback</h1>
        <p className="mt-1 text-sm text-ink-soft">
          View submitted feedback, leave an internal admin note/reply, and triage status.
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
              status === s ? "bg-ink text-canvas" : "bg-ash/70 text-ink-soft hover:bg-ash"
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
                  if (!(f._id in replyDrafts) && f.adminReply) {
                    setReplyDrafts((d) => ({ ...d, [f._id]: f.adminReply ?? "" }));
                  }
                  if (f.status === "new") {
                    void updateStatus({ id: f._id, status: "viewed" });
                  }
                }}
                className="flex w-full items-start gap-3 px-4 py-3 text-left"
              >
                <KindBadge kind={f.kind} />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm text-ink">{f.body}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-faint">
                    <span>{fmtDate(f.createdAt)}</span>
                    <span>·</span>
                    <span className="truncate">user {f.userId.slice(0, 12)}…</span>
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
                      {(() => {
                        const href = safeHref(f.url);
                        return href ? (
                          <a href={href} className="underline" target="_blank" rel="noreferrer noopener">
                            {f.url}
                          </a>
                        ) : (
                          <span className="text-ink-faint">{f.url}</span>
                        );
                      })()}
                    </p>
                  ) : null}

                  <label className="mt-4 block">
                    <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                      Admin reply / notes
                    </span>
                    <textarea
                      value={replyDrafts[f._id] ?? f.adminReply ?? ""}
                      onChange={(e) =>
                        setReplyDrafts((d) => ({ ...d, [f._id]: e.target.value }))
                      }
                      rows={3}
                      maxLength={2000}
                      placeholder="Internal note or reply text (stored on the feedback item)"
                      className="mt-1 w-full rounded-lg border border-ash bg-surface-elevated px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={saving === f._id}
                    onClick={() => void saveReply(f._id)}
                    className="mt-2 rounded-lg border border-ash bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40"
                  >
                    {saving === f._id ? "Saving…" : "Save reply"}
                  </button>

                  {/* Triage actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <TriageBtn
                      label="In progress"
                      active={f.status === "in_progress"}
                      onClick={() => void saveReply(f._id, "in_progress")}
                    />
                    <TriageBtn
                      label="Resolved"
                      active={f.status === "resolved"}
                      onClick={() => void saveReply(f._id, "resolved")}
                    />
                    <TriageBtn
                      label="Won't fix"
                      active={f.status === "wontfix"}
                      onClick={() => void saveReply(f._id, "wontfix")}
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
      ? "bg-bad text-canvas"
      : status === "resolved" || status === "wontfix"
        ? "bg-good text-canvas"
        : "bg-ink text-canvas";
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
        active ? "bg-ink text-canvas" : "border border-ash bg-surface-elevated text-ink-soft hover:bg-brand-wash/40"
      }`}
    >
      {label}
    </button>
  );
}

function fmtDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}
