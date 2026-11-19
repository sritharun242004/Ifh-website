"use client";

import { useEffect, useRef } from "react";
import { copy } from "@/landing/copy";
import { track } from "@/landing/lib/pixel";
import { Odometer } from "./Odometer";
import { OwnerForm } from "./OwnerForm";
import { RevealLines } from "./RevealLines";
import { useSeats } from "./SeatsProvider";

/** Section 4: "Lock your spot". Heading switches to the waitlist when all spots are taken. */
export function FormSection() {
  const { left, total } = useSeats();
  const ref = useRef<HTMLElement>(null);
  const gone = left === 0;

  // ViewContent once, when the form comes into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          track("ViewContent", { content_name: "owner_form" });
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="lock" ref={ref} className="lock" aria-labelledby="lock-h">
      <RevealLines
        key={gone ? "wait" : "lock"}
        id="lock-h"
        className="h2"
        lines={gone ? copy.form.waitlistTitleLines : copy.form.titleLines}
      />
      <p className="lock-counter">
        {gone ? (
          copy.form.counterGone
        ) : (
          <>
            <span className="live-dot" aria-hidden="true" />
            <span className="lock-num">
              <Odometer value={left ?? total} />
              <span className="lock-total"> / {total}</span>
            </span>
            {copy.form.counterSuffix}
          </>
        )}
      </p>
      <OwnerForm />
    </section>
  );
}
