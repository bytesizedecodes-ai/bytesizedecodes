import type { ReactNode } from "react";
import Link from "next/link";
import { AdminGate } from "./AdminGate";

/**
 * /admin layout — gates all child routes via AdminGate (which redirects
 * non-admins to /login). The backend ALSO enforces admin on every
 * query/mutation (convex/lib/admin.ts), so the UI gate is defense-in-depth.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas">
      <AdminGate>
        <header className="sticky top-0 z-40 border-b border-ash bg-canvas/90 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-[10px] font-bold text-canvas">
                BSD
              </span>
              <span>Admin</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/admin" className="text-ink-soft hover:text-ink">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-ink-soft hover:text-ink">
                Users
              </Link>
              <Link href="/admin/feedback" className="text-ink-soft hover:text-ink">
                Feedback
              </Link>
              <Link href="/admin/email" className="text-ink-soft hover:text-ink">
                Email
              </Link>
              <Link href="/" className="text-ink-faint hover:text-ink-soft">
                ← Site
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </AdminGate>
    </div>
  );
}
