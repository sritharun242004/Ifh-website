"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

/** Lenis smooth scrolling for the whole page. Skipped for reduced-motion users. */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ anchors: { offset: -104 }, lerp: 0.12 });
    setLenis(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
