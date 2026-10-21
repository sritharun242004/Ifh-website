"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Fades `.reveal` elements in as they scroll into view (staggered 60ms per sibling). */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    items.forEach((el) => {
      const index = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
      el.style.setProperty("--i", String(Math.min(index, 8)));
    });

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
