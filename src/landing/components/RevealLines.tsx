"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Headline line-mask reveal on scroll: each line slides up from behind a clip mask once.
 * Server-rendered text is visible by default; hiding only starts after hydration (no-JS safe).
 */
export function RevealLines({
  lines,
  as: Tag = "h2",
  id,
  className,
}: {
  lines: readonly string[];
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [state, setState] = useState<"static" | "waiting" | "in">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen (e.g. reload mid-page): leave it visible.
    if (el.getBoundingClientRect().top < innerHeight * 0.85) return;
    setState("waiting");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} id={id} className={`reveal-lines is-${state}${className ? ` ${className}` : ""}`}>
      {lines.map((line, i) => (
        <span key={line} className="mask-line">
          <span style={{ transitionDelay: `${i * 80}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
