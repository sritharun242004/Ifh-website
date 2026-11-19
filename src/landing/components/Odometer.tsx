"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1300;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counting number. When `value` changes, the shown number counts from the old value to the new
 * one through real values only (ease-out, last steps slow), e.g. 500 -> 499 -> ... -> 449.
 * Drawn as plain tabular digits on one baseline: no per-digit strips, so digits can never sit
 * at different heights or slide in different directions.
 */
export function Odometer({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setShown(value);
      return;
    }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / DURATION);
      const v = Math.round(start + (value - start) * easeOut(t));
      from.current = v;
      setShown(v);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span className={`odo${className ? ` ${className}` : ""}`}>
      <span className="sr-only">{Math.max(0, value)}</span>
      <span aria-hidden="true">{Math.max(0, shown)}</span>
    </span>
  );
}
