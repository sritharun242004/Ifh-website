"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Phones only: a swipe slider where the card in the middle is full size and the
 * neighbours peek in from the sides, smaller and dimmer. Anything wider than a phone
 * keeps the normal grid (the styles only apply at max-width 599px).
 */
export function FocusSlider({ children, className = "" }: { children: ReactNode; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const phone = matchMedia("(max-width: 599px)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      const cards = Array.from(el.children) as HTMLElement[];
      if (!phone.matches) {
        cards.forEach((c) => {
          c.style.removeProperty("scale");
          c.style.removeProperty("filter");
        });
        return;
      }
      const mid = el.scrollLeft + el.clientWidth / 2;
      cards.forEach((c) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) / c.offsetWidth; // 0 = centred
        const t = Math.min(d, 1);
        c.style.scale = String(1 - 0.14 * t);
        c.style.filter = `brightness(${1 - 0.22 * t})`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    phone.addEventListener("change", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      phone.removeEventListener("change", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={track} className={`${className} focus-slider`.trim()}>
      {children}
    </div>
  );
}
