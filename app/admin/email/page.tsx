"use client";

import { useEffect, useState } from "react";
import {
  useAdminCampaigns,
  useAdminTriggers,
  useCancelEmailCampaign,
  useCreateEmailCampaign,
  useEmailConfigStatus,
  useEnsureDefaultTriggers,
  useMailRecipients,
  useUpdateTrigger,
} from "@/lib/data/provider";
import type { Id } from "@/convex/_generated/dataModel";

export default function AdminEmailPage() {
  const config = useEmailConfigStatus();
  const recipients = useMailRecipients();
  const campaigns = useAdminCampaigns();
  const triggers = useAdminTriggers();
  const createCampaign = useCreateEmailCampaign();
  const cancelCampaign = useCancelEmailCampaign();
  const ensureTriggers = useEnsureDefaultTriggers();
  const updateTrigger = useUpdateTrigger();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(
    "Hi {{name}},\n\n\n\n— ByteSizeDecodes\nhttps://bytesizedecodes.com",
  );
  const [scheduleLocal, setScheduleLocal] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    void ensureTriggers({}).catch(() => {
      /* gate already enforces admin */
    });
  }, [ensureTriggers]);

  async function send(sendNow: boolean) {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      let scheduledForEpochMs: number | undefined;
      if (!sendNow) {
        if (!scheduleLocal) throw new Error("Pick a schedule time");
        scheduledForEpochMs = new Date(scheduleLocal).getTime();
        if (Number.isNaN(scheduledForEpochMs)) throw new Error("Invalid schedule time");
      }
      const result = await createCampaign({
        subject,
        body,
        sendNow,
        scheduledForEpochMs,
      });
      setMessage(
        result.status === "scheduled"
          ? "Campaign scheduled."
          : "Campaign queued — delivery runs on the server.",
      );
      if (sendNow) {
        setSubject("");
        setBody("Hi {{name}},\n\n\n\n— ByteSizeDecodes\nhttps://bytesizedecodes.com");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create campaign");
    } finally {
      setBusy(false);
    }
  }

  async function onCancel(campaignId: Id<"emailCampaigns">) {
    setBusy(true);
    setError(null);
    try {
      await cancelCampaign({ campaignId });
      setMessage("Campaign cancelled.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Email & triggers</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Broadcast to account holders, schedule sends, and toggle automated reminders.
        </p>
      </header>

      {/* Config + audience */}
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-faint">Resend</div>
          <div className="mt-1 text-lg font-semibold text-ink">
            {config === undefined
              ? "…"
              : config.resendConfigured
                ? "Configured"
                : "Not configured"}
          </div>
          <p className="mt-1 text-[11px] leading-snug text-ink-faint">
            Set <code className="text-ink-soft">RESEND_API_KEY</code> (and optional{" "}
            <code className="text-ink-soft">EMAIL_FROM</code>) on the Convex deployment.
          </p>
        </div>
        <div className="card p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-faint">From</div>
          <div className="mt-1 break-all text-sm font-medium text-ink">
            {config?.fromAddress ?? "…"}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-ink-faint">
            Recipients with email
          </div>
          <div className="mt-1 text-2xl font-bold text-ink">
            {recipients === undefined ? "…" : recipients.count}
          </div>
          <p className="mt-1 text-[11px] text-ink-faint">Unique addresses from signed-in accounts.</p>
        </div>
      </section>

      {config && !config.resendConfigured ? (
        <div className="rounded-lg border border-bad/30 bg-bad-wash px-4 py-3 text-sm text-bad">
          Campaigns will fail until Resend is configured on Convex. Compose and schedule still work
          for testing once the key is set.
        </div>
      ) : null}

      {/* Composer */}
      <section className="card space-y-4 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">Compose</h2>
        <p className="text-xs text-ink-faint">
          Use <code className="text-ink-soft">{"{{name}}"}</code> for personalization. Audience: all
          account holders with an email (cap 200 per send).
        </p>
        <label className="block">
          <span className="text-xs font-semibold text-ink-soft">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ash bg-surface-elevated px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
            placeholder="Subject line"
            maxLength={200}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-ink-soft">Body (plain text)</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-lg border border-ash bg-surface-elevated px-3 py-2 font-mono text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1">
            <span className="text-xs font-semibold text-ink-soft">Schedule (local time)</span>
            <input
              type="datetime-local"
              value={scheduleLocal}
              onChange={(e) => setScheduleLocal(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ash bg-surface-elevated px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || !subject.trim() || body.trim().length < 10}
              onClick={() => void send(true)}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-canvas disabled:opacity-40"
            >
              Send to all now
            </button>
            <button
              type="button"
              disabled={busy || !subject.trim() || body.trim().length < 10 || !scheduleLocal}
              onClick={() => void send(false)}
              className="rounded-lg border border-ash bg-surface-elevated px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40"
            >
              Schedule
            </button>
          </div>
        </div>
        {message ? <p className="text-sm text-good">{message}</p> : null}
        {error ? <p className="text-sm text-bad">{error}</p> : null}
      </section>

      {/* Recipient preview */}
      <section className="card overflow-hidden">
        <div className="border-b border-ash px-4 py-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
            Recipients preview
          </h2>
        </div>
        {recipients === undefined ? (
          <div className="p-4 text-sm text-ink-faint">Loading…</div>
        ) : recipients.recipients.length === 0 ? (
          <div className="p-4 text-sm text-ink-soft">
            No emails on file yet. Learners must sign in so OAuth email syncs to their profile.
          </div>
        ) : (
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-ash/50 text-xs font-bold uppercase text-ink-soft">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {recipients.recipients.map((r) => (
                  <tr key={r.email} className="border-t border-ash/60">
                    <td className="px-3 py-2 text-ink">{r.name}</td>
                    <td className="px-3 py-2 text-ink-soft">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Campaigns */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">Campaign history</h2>
        {campaigns === undefined ? (
          <div className="text-sm text-ink-faint">Loading…</div>
        ) : campaigns.length === 0 ? (
          <div className="card p-6 text-sm text-ink-soft">No campaigns yet.</div>
        ) : (
          <div className="space-y-2">
            {campaigns.map((c) => (
              <div key={c._id} className="card px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{c.subject}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {c.status}
                      {c.scheduledFor ? ` · send ${fmtDateTime(c.scheduledFor)}` : null}
                      {c.sentCount !== undefined
                        ? ` · ${c.sentCount}/${c.recipientCount ?? "?"} sent`
                        : null}
                      {c.error ? ` · ${c.error}` : null}
                    </p>
                  </div>
                  {c.status === "scheduled" || c.status === "draft" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void onCancel(c._id)}
                      className="text-xs font-semibold text-bad hover:underline"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Triggers */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          Automated triggers
        </h2>
        <p className="text-xs text-ink-faint">
          Cron-backed broadcasts when enabled. Start off; turn on only after Resend + copy review.
          Templates still use one message for all recipients (not per-user due counts yet).
        </p>
        {triggers === undefined ? (
          <div className="text-sm text-ink-faint">Loading…</div>
        ) : triggers.length === 0 ? (
          <div className="card p-6 text-sm text-ink-soft">
            Defaults not seeded yet — refresh this page.
          </div>
        ) : (
          <div className="space-y-3">
            {triggers.map((t) => (
              <div key={t._id} className="card space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink">{t.key}</p>
                    <p className="text-xs text-ink-faint">{t.scheduleLabel}</p>
                    {t.lastRunAt ? (
                      <p className="mt-0.5 text-[11px] text-ink-faint">
                        Last: {fmtDateTime(t.lastRunAt)} — {t.lastResult ?? "—"}
                      </p>
                    ) : null}
                  </div>
                  <label className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={t.enabled}
                      onChange={(e) => {
                        void updateTrigger({ key: t.key, enabled: e.target.checked }).catch(
                          (err: unknown) =>
                            setError(err instanceof Error ? err.message : "Update failed"),
                        );
                      }}
                    />
                    Enabled
                  </label>
                </div>
                {editingKey === t.key ? (
                  <div className="space-y-2 border-t border-ash pt-3">
                    <input
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full rounded-lg border border-ash bg-surface-elevated px-3 py-2 text-sm"
                    />
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-ash bg-surface-elevated px-3 py-2 font-mono text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-canvas"
                        onClick={() => {
                          void updateTrigger({
                            key: t.key,
                            subjectTemplate: editSubject,
                            bodyTemplate: editBody,
                          })
                            .then(() => setEditingKey(null))
                            .catch((err: unknown) =>
                              setError(err instanceof Error ? err.message : "Save failed"),
                            );
                        }}
                      >
                        Save template
                      </button>
                      <button
                        type="button"
                        className="text-xs text-ink-soft"
                        onClick={() => setEditingKey(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-ash pt-3">
                    <p className="text-sm font-medium text-ink">{t.subjectTemplate}</p>
                    <pre className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap text-xs text-ink-soft">
                      {t.bodyTemplate}
                    </pre>
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold text-brand-deep hover:underline"
                      onClick={() => {
                        setEditingKey(t.key);
                        setEditSubject(t.subjectTemplate);
                        setEditBody(t.bodyTemplate);
                      }}
                    >
                      Edit template
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function fmtDateTime(ms: number): string {
  return new Date(ms).toLocaleString();
}
