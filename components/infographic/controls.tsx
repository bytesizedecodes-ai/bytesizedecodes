"use client";

/**
 * Shared control primitives for continuous interactive playgrounds
 * (infographics-interactive_v6 §6). Every lesson slider/toggle builds from
 * these — they carry the affordance gate for you: visible chrome, a clear
 * selected state, a live value readout, real `<input>`/`<button>` elements
 * (keyboard- and screen-reader-reachable), and `focus-ring`. Theme-safe
 * tokens only; state changes, never motion, carry meaning.
 */

export function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  presets,
  unit,
}: {
  /** What the knob does, in plain words ("Learning rate (step size)"). */
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Live readout formatter; defaults to the raw value. */
  format?: (value: number) => string;
  /** Quick-jump chips on top of the continuous range (beginner-friendly). */
  presets?: readonly { label: string; value: number }[];
  /** Optional accessible unit announced with the value. */
  unit?: string;
}) {
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-xs font-bold text-ink">{label}</span>
        <span className="font-mono text-xs font-bold text-brand-deep" aria-hidden="true">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label}${unit ? `, ${unit}` : ""}`}
        aria-valuetext={format ? format(value) : undefined}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ash accent-brand focus-ring"
      />
      {presets && presets.length > 0 && (
        <div
          className="mt-2 flex flex-wrap justify-center gap-1.5"
          role="group"
          aria-label={`${label} presets`}
        >
          {presets.map((preset) => {
            const active = Math.abs(preset.value - value) < step / 2;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.value)}
                aria-pressed={active}
                className={`focus-ring min-h-[32px] rounded-full border px-3 py-1 text-[11px] font-bold transition-colors ${
                  active
                    ? "border-brand bg-brand text-canvas"
                    : "border-ash bg-surface-elevated text-ink-soft hover:border-brand hover:text-ink"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ToggleGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  /** What flipping the toggle switches between ("RAG"). */
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-ash bg-canvas p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`focus-ring min-h-[32px] shrink-0 rounded-full px-3.5 py-1 text-xs font-bold transition-colors ${
              active ? "bg-brand text-canvas" : "text-ink-soft hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
