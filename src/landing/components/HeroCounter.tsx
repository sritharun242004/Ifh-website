"use client";

import { useEffect, useState } from "react";
import { copy } from "@/landing/copy";
import { INTRO_MS } from "@/landing/intro";
import { Odometer } from "./Odometer";
import { useSeats } from "./SeatsProvider";

/**
 * Small line under the hero button: "● 449 free spots left · Takes 1 minute".
 * Shows the total (dimmed) until the real number arrives, then rolls down to it.
 */
export function HeroCounter() {
  const { left, total, status } = useSeats();
  const unavailable = status === "error" && left === null;
  const gone = left === 0;
  // Hold at the total until the hero is on screen, so the roll-down is seen, not hidden by the intro.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), INTRO_MS + 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <p className="hero-seats">
      {unavailable || gone ? (
        <span>{gone ? copy.hero.counterGone : copy.hero.counterUnavailable}</span>
      ) : (
        <>
          <span className="live-dot" aria-hidden="true" />
          <span className={`hero-seats-num${left === null ? " is-loading" : ""}`} aria-live="polite">
            <Odometer value={shown ? (left ?? total) : total} />
          </span>
          <span>{copy.hero.counterLabel}</span>
        </>
      )}
      <span className="hero-seats-sep" aria-hidden="true">
        ·
      </span>
      <span>{copy.hero.time}</span>
    </p>
  );
}
