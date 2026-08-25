import { Infographic, InfographicHeader, Card } from "./primitives";
import { Scene, StoryMap } from "./scenes";
import { Stagger, MotionChild } from "./motion";
import { OutlookIcon, PlayMark, NoPlayMark } from "./weather";

/**
 * Layman course — Lesson 13: "Rules as a tree: the decision tree" (v2 Thread
 * retrofit).
 *
 * Through-line stage: Asha's Sunday-match question, answered by the SAME four
 * weather chips all lesson — first as a doubt, then as a list of if/then
 * cards, then those exact rules redrawn as a tree (the card list stays beside
 * it as the ghost it came from). Beats: hook (will the match happen?) → anchor
 * (rules on cards) → reveal (the same rules, drawn as a walkable tree) →
 * cliffhanger (many trees fit — which is best?).
 */
export function DecisionTreeRules() {
  return (
    <Infographic>
      <InfographicHeader
        title="Rules as a tree"
        subtitle="A list of if/then rules is just a tree you walk down"
      />

      <StoryMap
        steps={[
          { icon: <span aria-hidden="true">🎾</span>, label: "Match day doubt" },
          { icon: <span aria-hidden="true">📜</span>, label: "Rules on cards" },
          { icon: <span aria-hidden="true">🌳</span>, label: "The same tree" },
          { icon: <span aria-hidden="true">🤔</span>, label: "Which tree wins?" },
        ]}
      />

      {/* Step 1 — the prediction question, as picture chips */}
      <Scene caption="So the question: will Asha's Sunday match happen?">
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ConditionChip icon={<OutlookIcon outlook="sunny" />} label="sunny" />
            <ConditionChip icon={<span className="text-lg" aria-hidden="true">🌡️</span>} label="cool" />
            <ConditionChip icon={<span className="text-lg" aria-hidden="true">💧</span>} label="high humidity" />
            <ConditionChip icon={<span className="text-lg" aria-hidden="true">🌬️</span>} label="windy" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-dashed border-brand-deep bg-brand-wash px-5 py-3">
            <span className="text-sm font-bold text-brand-deep">play the match?</span>
            <span className="text-lg font-bold text-brand-deep">?</span>
          </div>
        </div>
      </Scene>

      {/* Step 2 — a set of if/then rules, as cards */}
      <Scene variant="continue" caption="Then answer it with a list of rules">
        <div className="mx-auto max-w-md space-y-2">
          <RuleRow icon={<OutlookIcon outlook="overcast" className="!h-5" />}>
            if <b>overcast</b> <PlayMark />
          </RuleRow>
          <RuleRow icon={<OutlookIcon outlook="sunny" className="!h-5" />}>
            if <b>sunny</b> &amp; <b>high humidity</b> <NoPlayMark />
          </RuleRow>
          <RuleRow icon={<OutlookIcon outlook="rain" className="!h-5" />}>
            if <b>rain</b> &amp; <b>windy</b> <NoPlayMark />
          </RuleRow>
          <RuleRow icon={<span className="text-sm">else</span>}>
            otherwise <PlayMark />
          </RuleRow>
        </div>
      </Scene>

      {/* Step 3 — the same rules drawn as a tree */}
      <Scene variant="continue" caption="But those rules also draw as a tree — walk down it">
        <div className="flex flex-col items-center overflow-x-auto">
          <Node label="outlook?" />
          <Branch />
          <div className="flex items-start gap-3 sm:gap-8">
            <BranchColumn icon={<OutlookIcon outlook="sunny" />} label="sunny">
              <Node label="humidity?" />
              <Branch />
              <div className="flex gap-2">
                <LeafColumn label="high"><NoPlayMark /></LeafColumn>
                <LeafColumn label="normal"><PlayMark /></LeafColumn>
              </div>
            </BranchColumn>
            <BranchColumn icon={<OutlookIcon outlook="overcast" />} label="overcast">
              <PlayMark />
            </BranchColumn>
            <BranchColumn icon={<OutlookIcon outlook="rain" />} label="rain">
              <Node label="windy?" />
              <Branch />
              <div className="flex gap-2">
                <LeafColumn label="true"><NoPlayMark /></LeafColumn>
                <LeafColumn label="false"><PlayMark /></LeafColumn>
              </div>
            </BranchColumn>
          </div>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          sunny + high humidity → <NoPlayMark className="!px-2 !py-0.5" />. Same answer, different shape.
        </p>
      </Scene>

      {/* Step 4 — many trees possible */}
      <Scene caption="Then again — many trees give the same answers. Which is best?">
        <Stagger className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
          <MotionChild>
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-ash bg-surface-elevated text-sm font-semibold text-ink shadow-sm">
              tree A
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-ash bg-surface-elevated text-sm font-semibold text-ink shadow-sm">
              tree B
            </div>
          </MotionChild>
          <MotionChild>
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-ash bg-surface-elevated text-sm font-semibold text-ink shadow-sm">
              tree C
            </div>
          </MotionChild>
          <MotionChild>
            <span className="rounded-full bg-warm-wash px-3 py-1.5 text-xs font-bold text-ink">→ which?</span>
          </MotionChild>
        </Stagger>
        <p className="mt-3 text-center text-xs font-medium text-ink">
          That&apos;s the real question — answered next.
        </p>
      </Scene>

      <Card tone="brand" rotate={0}>
        <p className="text-center text-sm font-bold leading-relaxed text-ink sm:text-base">
          A decision tree is just your{" "}
          <span className="underline decoration-brand-deep decoration-2 underline-offset-2">rules</span>,
          drawn as a path you walk.
        </p>
      </Card>
    </Infographic>
  );
}

/** A condition pill: icon + label. */
function ConditionChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-wash px-3 py-1.5 text-xs font-semibold text-ink">
      {icon}
      {label}
    </span>
  );
}

/** A single if/then rule row with a leading icon. */
function RuleRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-ash bg-surface-elevated px-3 py-2 text-xs font-medium text-ink shadow-sm">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">{icon}</span>
      <span className="flex flex-wrap items-center gap-1.5">{children}</span>
    </div>
  );
}

/** A decision node (a question split). */
function Node({ label }: { label: string }) {
  return <div className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-canvas">{label}</div>;
}

/** A labelled leaf (outcome) column. */
function LeafColumn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-bold uppercase text-ink-soft">{label}</span>
      {children}
    </div>
  );
}

/** A vertical connector between tree levels. */
function Branch() {
  return (
    <div className="flex flex-col items-center py-0.5">
      <span className="h-4 w-px bg-ink-faint" aria-hidden="true" />
      <span className="h-3 w-px bg-ink-faint" aria-hidden="true" />
    </div>
  );
}

/** A labelled branch column of the tree. */
function BranchColumn({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-[5.5rem] flex-col items-center">
      <div className="mb-1 flex items-center gap-1">
        {icon}
        <span className="rounded-full bg-ash px-2 py-0.5 text-[10px] font-bold uppercase text-ink-soft">{label}</span>
      </div>
      {children}
    </div>
  );
}
