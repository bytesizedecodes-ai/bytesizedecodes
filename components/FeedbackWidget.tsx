"use client";

import { useState } from "react";
import { MessageSquareText, X, Send } from "lucide-react";
import { useSubmitFeedback } from "@/lib/data/provider";

const KINDS = [
  { id: "bug", label: "🐛 Bug" },
  { id: "content_error", label: "✏️ Content error" },
  { id: "idea", label: "💡 Idea" },
  { id: "praise", label: "👍 Praise" },
  { id: "other", label: "💬 Other" },
] as const;

/**
 * Floating "Feedback" button for learner pages. Opens a small form (kind +
 * body + auto-captured URL). Submits to the public submitFeedback mutation —
 * no auth required, so anonymous learners can report issues too.
 */
export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("bug");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const submit = useSubmitFeedback();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      await submit({
        kind,
        body,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      });
      setDone(true);
      setBody("");
      setTimeout(() => {
        setDone(false);
        setOpen(false);
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Send feedback"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquareText className="h-5 w-5" />}
      </button>

      {/* Popover form */}
      {open ? (
        <div className="fixed bottom-20 right-5 z-40 w-[20rem] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-ash bg-white p-4 shadow-xl sm:right-6">
          {done ? (
            <p className="py-6 text-center text-sm font-medium text-good">
              Thanks — your feedback was sent.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h3 className="text-sm font-bold text-ink">Send feedback</h3>
              <div className="flex flex-wrap gap-1.5">
                {KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setKind(k.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      kind === k.id ? "bg-ink text-white" : "bg-ash/70 text-ink-soft hover:bg-ash"
                    }`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What happened, or what could be better?"
                rows={3}
                maxLength={2000}
                className="w-full resize-none rounded-xl border border-ash bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand/40"
                required
              />
              <button
                type="submit"
                disabled={submitting || !body.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </div>
      ) : null}
    </>
  );
}
