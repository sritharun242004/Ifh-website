"use client";

import { useEffect, useRef, useState } from "react";
import { CurvedDial } from "@/components/CurvedDial";
import { copy } from "@/landing/copy";
import { PhoneMock } from "./PhoneMock";
import { RevealLines } from "./RevealLines";

const STEPS = copy.privacy.steps;

/**
 * Section 3: the reused curved dial, driven by scroll progress through the section.
 * The inner panel uses native position: sticky, so scrolling is never hijacked;
 * the section is simply taller than one screen and the step follows the scroll position.
 */
export function PrivacySection({ photos }: { photos: (string | null)[] }) {
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const range = r.height - innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
      setStep(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  // Tapping a number scrolls to that step's part of the section.
  const goTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const range = el.offsetHeight - innerHeight;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: top + ((i + 0.5) / STEPS.length) * range, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <section ref={section} className="privacy" aria-labelledby="privacy-h">
      <div className="privacy-sticky">
        <RevealLines id="privacy-h" className="h2" lines={copy.privacy.titleLines} />
        <div className="privacy-row">
          <CurvedDial className="dial" steps={STEPS} tick={step} radius={210} stepDeg={19} onSelect={(i) => goTo(i)} />
          <PhoneMock step={step} photos={photos} />
        </div>
        {/* The active step's sentence, full width (the dial's own text is hidden on this page). */}
        <p className="privacy-step" key={step} aria-hidden="true">
          {STEPS[step]}
        </p>
        <p className="privacy-trust">{copy.privacy.trust}</p>
      </div>
    </section>
  );
}
