"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "@/landing/copy";
import { ArrowRight } from "./Icons";
import { Odometer } from "./Odometer";
import { useSeats } from "./SeatsProvider";

/**
 * Bottom CTA bar. Shows once the hero CTA has scrolled up out of view,
 * hides again whenever the form section (#lock) is on screen.
 */
export function StickyCta() {
  const { left, total, status } = useSeats();
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroCta = document.getElementById("hero-cta");
    const form = document.getElementById("lock");
    const observers: IntersectionObserver[] = [];

    if (heroCta) {
      // Ignore the strip under the 56px top bar: a CTA hidden behind the bar counts as scrolled past.
      const io = new IntersectionObserver(
        ([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 100),
        { rootMargin: "-56px 0px 0px 0px" },
      );
      io.observe(heroCta);
      observers.push(io);
    }
    if (form) {
      const io = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), {
        rootMargin: "0px 0px -15% 0px",
      });
      io.observe(form);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const shown = pastHero && !formVisible;

  // Hidden bar must not be focusable or read out.
  useEffect(() => {
    if (bar.current) bar.current.inert = !shown;
  }, [shown]);
  const gone = left === 0;

  return (
    <div ref={bar} className={`sticky-cta${shown ? " is-shown" : ""}`} aria-hidden={!shown}>
      <div className="sticky-inner">
        <p className="sticky-seats">
          {gone ? (
            copy.sticky.seatsGone
          ) : status === "error" && left === null ? (
            `First ${total} free`
          ) : (
            <>
              <span className="live-dot" aria-hidden="true" />
              <Odometer value={left ?? total} />
              <span>{copy.sticky.seatsSuffix}</span>
            </>
          )}
        </p>
        <a className="btn-primary btn-compact" href="#lock">
          {gone ? copy.sticky.ctaGone : copy.sticky.cta}
          <ArrowRight />
        </a>
      </div>
    </div>
  );
}
