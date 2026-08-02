"use client";

import { useAdminUsers } from "@/lib/data/provider";

export default function AdminUsersPage() {
  const users = useAdminUsers(100);

  if (users === undefined) {
    return <div className="text-sm text-ink-faint">Loading users…</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Users</h1>
        <p className="mt-1 text-sm text-ink-soft">{users.length} profiles (newest first).</p>
      </header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ash bg-ash/40 text-xs font-bold uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Track</th>
                <th className="px-3 py-2 text-right">XP</th>
                <th className="px-3 py-2 text-right">Streak</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Last active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-ash/60 last:border-0">
                  <td className="px-3 py-2 font-medium text-ink">
                    {u.displayName}
                    {u.seed ? (
                      <span className="ml-2 rounded-full bg-ash px-1.5 py-0.5 text-[10px] font-bold text-ink-faint">
                        seed
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-ink-soft">{u.track}</td>
                  <td className="px-3 py-2 text-right font-mono text-ink">{u.xpTotal}</td>
                  <td className="px-3 py-2 text-right font-mono text-ink">{u.currentStreak}🔥</td>
                  <td className="px-3 py-2">
                    {u.role === "admin" ? (
                      <span className="rounded-full bg-brand-wash px-2 py-0.5 text-[11px] font-bold text-brand-deep">
                        admin
                      </span>
                    ) : (
                      <span className="text-ink-faint">user</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-ink-faint">{fmtDate(u.createdAt)}</td>
                  <td className="px-3 py-2 text-ink-faint">{u.lastPracticeDay ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function fmtDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}
