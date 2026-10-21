"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Lime bar above the navbar: a loading sweep on each page, then scroll progress. */
export function ScrollProgress() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.max(Math.min(window.scrollY / max, 1), 0.08) : 0.08})`;
    };
    const startTracking = () => {
      el.classList.add("tracking");
      update();
    };

    el.addEventListener("animationend", startTracking);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      el.removeEventListener("animationend", startTracking);
      window.removeEventListener("scroll", update);
    };
  }, [pathname]);

  // A new key per page restarts the loading sweep after each navigation.
  return <div key={pathname} ref={bar} className="scroll-progress" aria-hidden="true" />;
}
