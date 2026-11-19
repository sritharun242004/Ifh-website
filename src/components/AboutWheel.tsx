"use client";

import { useEffect, useState } from "react";
import { CurvedDial } from "./CurvedDial";

const STEPS = [
  "Tenants browse listings for free, with no login.",
  "Found a place you like? Enquire, verify your number and choose a plan.",
  "Unlock the owner’s contact — directly, with no brokerage.",
  "Owners list properties and connect with genuinely interested tenants. We moderate every listing.",
];

/**
 * Rotating wheel: the numbers sit on a big arc; the active one is large beside its text.
 * It advances on its own (pauses on hover/touch) and each number can be tapped.
 */
export function AboutWheel() {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <CurvedDial steps={STEPS} tick={tick} onSelect={(_, next) => setTick(next)} />
    </div>
  );
}
