import { Infographic, InfographicHeader, Card, CardTitle, Takeaway } from "./primitives";
import { Scene } from "./scenes";
import { Stagger, MotionChild, Reveal } from "./motion";

/**
 * RAG Engineering: At Scale — Lesson 4: "Permission-Aware Retrieval".
 *
 * The leak timeline (salary doc in the shared index → retrieved into a
 * normal user's context), the fix at query time (ACL metadata, pre-filter,
 * tenant isolation), and post-filter's failure mode. Bad marks the leak;
 * good marks each control. Expert register, compact.
 */
export function PermissionAwareRetrieval() {
  return (
    <Infographic>
      <InfographicHeader
        title="The index that forgot who's allowed"
        subtitle="RAG bypasses every file permission system — unless retrieval enforces them."
      />

      {/* Beat 1 — the leak timeline */}
      <Scene caption="① How a salary band reached a support inbox">
        <Stagger className="flex flex-col gap-1.5">
          <MotionChild>
            <Tick text="HR uploads comp-bands-2026.pdf to the wiki — ACL: hr-admins only" tone="neutral" />
          </MotionChild>
          <MotionChild>
            <Tick text="the crawler ingests it — embedding the content, dropping the ACL" tone="bad" />
          </MotionChild>
          <MotionChild>
            <Tick text="a support agent asks 'what's the senior engineer band?'" tone="neutral" />
          </MotionChild>
          <MotionChild>
            <Tick text="retrieval finds it — #1 match — into the context, into the answer" tone="bad" />
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-ink">
          The wiki said <span className="font-bold">hr-admins only</span>. The index heard{" "}
          <span className="font-bold">“everyone”</span> — because nobody told it otherwise.
        </p>
      </Scene>

      {/* Beat 2 — the controls */}
      <Scene caption="② Enforce at query time — the context never forms">
        <Reveal>
          <div className="space-y-2">
            <Control title="ACLs ride on every chunk" detail="source permissions become index metadata at ingestion — hr-admins, eng-all, tenant-42…" />
            <Control title="Pre-filter before search" detail="the query carries the user's groups; the index only ever searches authorized space — k results means k authorized results" accent />
            <Control title="Tenant isolation" detail="separate indexes or hard-partitioned namespaces per tenant — isolation by construction, not by filter discipline" />
            <Control title="Audit the filter like a boundary" detail="permission-denied retrievals are logged and tested — it's a security control, so it gets security tests" />
          </div>
        </Reveal>
      </Scene>

      {/* Beat 3 — post-filter's trap */}
      <Scene caption="③ Why post-filtering isn't the answer">
        <div className="rounded-xl border border-brand bg-brand-wash px-4 py-4 text-center">
          <p className="text-sm font-medium leading-relaxed text-ink sm:text-base">
            Filtering <span className="font-bold">after</span> ranking retrieves top-5 from the whole
            corpus, then discards the unauthorized ones — the user gets 5 results that are all
            theirs, but <span className="font-bold">ranked against documents they were never allowed to
            see</span>, and sometimes 2 results where 5 belonged. Pre-filter: search authorized
            space only. The security review passes on that difference.
          </p>
        </div>
      </Scene>

      <Card tone="brand" rotate={0}>
        <CardTitle icon="✦">The rule</CardTitle>
        <Takeaway>
          Permissions are enforced at retrieval or not at all: ACL metadata on every chunk,
          pre-filtered by the user's groups, tenant-isolated by construction, audited like
          the boundary it is.
        </Takeaway>
      </Card>
    </Infographic>
  );
}

/** One tick of the leak timeline. */
function Tick({ text, tone }: { text: string; tone: "neutral" | "bad" }) {
  const bad = tone === "bad";
  return (
    <div
      className={`rounded-lg border px-3 py-2 font-mono text-[11px] font-medium leading-snug shadow-sm ${
        bad
          ? "border-[var(--color-bad)] bg-[var(--color-bad-wash)] text-ink"
          : "border-ash bg-surface-elevated text-ink"
      }`}
    >
      {text}
    </div>
  );
}

/** One query-time control. */
function Control({ title, detail, accent = false }: { title: string; detail: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 shadow-sm ${
        accent ? "border-good bg-good-wash" : "border-ash bg-surface-elevated"
      }`}
    >
      <div className="text-xs font-bold text-ink sm:text-[13px]">{title}</div>
      <p className="mt-0.5 text-[10.5px] font-medium leading-relaxed text-ink-soft">{detail}</p>
    </div>
  );
}
