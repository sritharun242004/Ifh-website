"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  "Tenants browse listings for free, with no login.",
  "Found a place you like? Enquire, verify your number and choose a plan.",
  "Unlock the owner’s contact — directly, with no brokerage.",
  "Owners list properties and connect with genuinely interested tenants. We moderate every listing.",
];
const COUNT = STEPS.length;
const STEP_DEG = 24;
const RADIUS = 260;

/** Wrapped offset of slot `i` from the active tick, in [-2, 2). */
function offset(i: number, tick: number) {
  const n = (((i - tick) % COUNT) + COUNT) % COUNT;
  return n >= COUNT / 2 ? n - COUNT : n;
}

/**
 * Rotating wheel: the numbers sit on a big arc; the active one is large beside its text.
 * It advances on its own (pauses on hover/touch) and each number can be tapped.
 */
export function AboutWheel() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const prev = useRef<number[]>(STEPS.map((_, i) => offset(i, 0)));
  const jumped = useRef<boolean[]>(STEPS.map(() => false));

  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, [paused]);

  const offsets = STEPS.map((_, i) => offset(i, tick));
  jumped.current = offsets.map((o, i) => Math.abs(o - prev.current[i]) > 1.5);
  prev.current = offsets;
  const active = ((tick % COUNT) + COUNT) % COUNT;

  const goTo = (i: number) => setTick((t) => t + offset(i, t));

  return (
    <div
      className="wheel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <svg className="wheel-arc" aria-hidden="true">
        <circle cx={56 - RADIUS} cy="50%" r={RADIUS} fill="none" />
      </svg>
      <div className="wheel-ring" style={{ ["--r" as string]: `${RADIUS}px` }}>
        {STEPS.map((_, i) => {
          const o = offsets[i];
          const isActive = o === 0;
          return (
            <button
              key={i}
              type="button"
              className={`wheel-tick${isActive ? " is-active" : ""}`}
              style={{
                transform: `rotate(${o * STEP_DEG}deg) translateX(${RADIUS}px) translateY(-50%)`,
                opacity: Math.abs(o) > 1 ? 0 : isActive ? 1 : 0.55,
                transition: jumped.current[i] ? "none" : undefined,
              }}
              aria-label={`Step ${i + 1}`}
              tabIndex={isActive ? -1 : 0}
              onClick={() => goTo(i)}
            >
              <span className="wheel-dot" />
              <span className="wheel-num">{String(i + 1).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
      <p className="wheel-text" key={active} aria-hidden="true">
        {STEPS[active]}
      </p>
      <ol className="sr-only">
        {STEPS.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </div>
  );
}
