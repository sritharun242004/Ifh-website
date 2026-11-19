"use client";

import { useEffect, useRef, useState } from "react";
import { config } from "@/landing/config";
import { copy } from "@/landing/copy";
import { Rupee3D } from "./Rupee3D";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/**
 * Section 2: pinned for ~1.5 screens, plays once.
 * "No more" → "1 MONTH RENT / to the broker." → strike → ₹10,000 counts to 0 → 3D ₹0 drops in → payoff.
 * Markup renders the FINAL state, so no-JS and reduced-motion users see everything.
 * GSAP + ScrollTrigger load lazily, off the critical path.
 */
export function ZeroReveal() {
  const section = useRef<HTMLElement>(null);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLanded(true);
      return;
    }
    let revert: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !section.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      const root = section.current;
      const q = gsap.utils.selector(root);
      const count = q(".zero-count")[0] as HTMLElement;
      const n = { v: config.sampleMonthlyRent };

      const ctx = gsap.context(() => {
        gsap.set(q(".zero-kicker"), { opacity: 0, y: 12 });
        gsap.set(q(".zero-line > span"), { yPercent: 130 });
        gsap.set(q(".zero-strike"), { scaleX: 0 });
        gsap.set(count, { opacity: 0, scale: 1 });
        gsap.set(q(".zero-rupee"), { opacity: 0, y: -40 });
        count.textContent = inr(n.v);

        const tl = gsap
          .timeline({ paused: true, onComplete: () => setLanded(true) })
          .to(q(".zero-kicker"), { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" })
          .to(q(".zero-head .zero-line > span"), { yPercent: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, "-=0.15")
          .to(q(".zero-strike"), { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, "+=0.15")
          .to(q(".zero-head"), { opacity: 0.45, duration: 0.4 }, "+=0.05")
          .to(count, { opacity: 1, duration: 0.2 }, "<")
          .to(n, {
            v: 0,
            duration: 1.4,
            ease: "power3.out", // fast at first, last few numbers slow down
            onUpdate: () => {
              count.textContent = inr(Math.round(n.v));
            },
          }, "<")
          .to(count, { opacity: 0, scale: 0.85, duration: 0.15 })
          .to(q(".zero-rupee"), { opacity: 1, y: 0, duration: 0.75, ease: "back.out(2.4)" }, "<0.05")
          .to(q(".zero-payoff .zero-line > span"), { yPercent: 0, duration: 0.7, ease: "power3.out" }, "-=0.35");

        const pin = q(".zero-pin")[0];
        // Pin: holds the section for ~1.5 screens.
        const st = ScrollTrigger.create({ trigger: pin, start: "top top+=56", end: "+=150%", pin: true, anticipatePin: 1 });
        // Play: starts a little BEFORE the pin, so the sequence is already running when it locks
        // and can never sit blank if the scroll stops exactly on the pin line.
        ScrollTrigger.create({
          trigger: pin,
          start: "top 75%",
          once: true,
          onEnter: () => tl.play(),
        });
        // Landed below the section (reload mid-page): show the final state.
        if (st.progress >= 1) tl.progress(1);
      }, root);
      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section ref={section} className="zero" aria-labelledby="zero-h">
      <div className="zero-pin">
        <h2 id="zero-h" className="zero-head">
          <span className="zero-kicker">{copy.zero.kicker}</span>
          <span className="zero-big zero-line">
            <span>
              <span className="zero-strike-wrap">
                {copy.zero.bigLine}
                <span className="zero-strike" aria-hidden="true" />
              </span>
            </span>
          </span>
          <span className="zero-to zero-line">
            <span>{copy.zero.toBroker}</span>
          </span>
        </h2>

        <div className="zero-stage">
          <span className="sr-only">₹0</span>
          <p className="zero-count" aria-hidden="true" />
          <div className="zero-rupee" aria-hidden="true">
            <Rupee3D idle={landed} />
          </div>
        </div>

        <p className="zero-payoff">
          <span className="zero-line">
            <span>{copy.zero.payoff}</span>
          </span>
        </p>
      </div>
    </section>
  );
}
