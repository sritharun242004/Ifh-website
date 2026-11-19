"use client";

import { useRef } from "react";

/** Wrapped offset of slot `i` from the active tick, in [-count/2, count/2). */
function offset(i: number, tick: number, count: number) {
  const n = (((i - tick) % count) + count) % count;
  return n >= count / 2 ? n - count : n;
}

/**
 * The curved number dial: numbers sit on a big arc and the active one is large beside its text.
 * Controlled: the parent owns `tick` (autoplay on the legacy home page, scroll position on the
 * owner landing page). Styling comes from the page's CSS (.wheel* classes).
 */
export function CurvedDial({
  steps,
  tick,
  onSelect,
  radius = 260,
  stepDeg = 24,
  className,
}: {
  steps: readonly string[];
  tick: number;
  onSelect: (index: number, nextTick: number) => void;
  radius?: number;
  stepDeg?: number;
  className?: string;
}) {
  const count = steps.length;
  const prev = useRef<number[]>(steps.map((_, i) => offset(i, tick, count)));
  const offsets = steps.map((_, i) => offset(i, tick, count));
  // A slot that wraps around the back of the dial jumps instead of sweeping across.
  const jumped = offsets.map((o, i) => Math.abs(o - prev.current[i]) > 1.5);
  prev.current = offsets;
  const active = ((tick % count) + count) % count;

  return (
    <div className={`wheel${className ? ` ${className}` : ""}`}>
      <svg className="wheel-arc" aria-hidden="true">
        <circle cx={56 - radius} cy="50%" r={radius} fill="none" />
      </svg>
      <div className="wheel-ring" style={{ ["--r" as string]: `${radius}px` }}>
        {steps.map((_, i) => {
          const o = offsets[i];
          const isActive = o === 0;
          return (
            <button
              key={i}
              type="button"
              className={`wheel-tick${isActive ? " is-active" : ""}`}
              style={{
                transform: `rotate(${o * stepDeg}deg) translateX(${radius}px) translateY(-50%)`,
                opacity: Math.abs(o) > 1 ? 0 : isActive ? 1 : 0.55,
                transition: jumped[i] ? "none" : undefined,
              }}
              aria-label={`Step ${i + 1}`}
              tabIndex={isActive || Math.abs(o) > 1 ? -1 : 0}
              onClick={() => onSelect(i, tick + offset(i, tick, count))}
            >
              <span className="wheel-dot" />
              <span className="wheel-num">{String(i + 1).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
      <p className="wheel-text" key={active} aria-hidden="true">
        {steps[active]}
      </p>
      <ol className="sr-only">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </div>
  );
}
