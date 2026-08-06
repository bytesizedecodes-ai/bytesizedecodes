"use client";

import Link from "next/link";
import { useAdminStats } from "@/lib/data/provider";

export default function AdminDashboardPage() {
  const stats = useAdminStats();

  if (stats === undefined) {
    return <div className="text-sm text-ink-faint">Loading stats…</div>;
  }

  const openFeedback = stats.openFeedback;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-soft">Platform health, learners, and ops shortcuts.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
        <StatCard label="Accounts" value={stats.authenticated} sub={`${stats.seedProfiles} seed`} />
        <StatCard label="With email" value={stats.withEmail} />
        <StatCard label="Active 7d" value={stats.active7d} />
        <StatCard label="Active 30d" value={stats.active30d} />
        <StatCard label="Open feedback" value={openFeedback} sub={`${stats.feedbackTotal} total`} />
        <StatCard label="Campaigns sent" value={stats.campaignsSent} />
      </div>

      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">
            Feedback queue
          </h2>
          <Link href="/admin/feedback" className="text-xs font-semibold text-brand-deep hover:underline">
            Triage →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <FeedbackPill status="new" count={stats.feedback.new ?? 0} />
          <FeedbackPill status="viewed" count={stats.feedback.viewed ?? 0} />
          <FeedbackPill status="in_progress" count={stats.feedback.in_progress ?? 0} />
          <FeedbackPill status="resolved" count={stats.feedback.resolved ?? 0} />
          <FeedbackPill status="wontfix" count={stats.feedback.wontfix ?? 0} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/admin/users" className="card-interactive focus-ring p-5">
          <h3 className="font-semibold text-ink">Users</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Signed-in accounts with name, email, energy, and streaks.
          </p>
        </Link>
        <Link href="/admin/feedback" className="card-interactive focus-ring p-5">
          <h3 className="font-semibold text-ink">Feedback</h3>
          <p className="mt-1 text-sm text-ink-soft">
            View submissions, add admin replies, triage status.
          </p>
        </Link>
        <Link href="/admin/email" className="card-interactive focus-ring p-5">
          <h3 className="font-semibold text-ink">Email & triggers</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Composer, send/schedule to all, automated reminder toggles.
          </p>
        </Link>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-1 text-2xl font-bold text-ink">{value}</div>
      {sub ? <div className="text-[11px] text-ink-faint">{sub}</div> : null}
    </div>
  );
}

function FeedbackPill({ status, count }: { status: string; count: number }) {
  const tone =
    status === "new"
      ? "bg-bad-wash text-bad"
      : status === "resolved"
        ? "bg-good-wash text-good"
        : "bg-ash text-ink-soft";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {status.replace("_", " ")}: {count}
    </span>
  );
}
