"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { INTRO_MS } from "@/landing/intro";

export type HeroNote = {
  /** A letter for a person's avatar, or one of the small icons. */
  avatar?: string;
  icon?: "heart" | "calendar" | "rupee";
  title: string;
  verified?: boolean;
  meta: string;
};
export type HeroSlide = { src: string | null; alt: string; focus?: string; note: HeroNote };

const EVERY_MS = 3500;

function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  );
}

function NoteIcon({ icon }: { icon: NonNullable<HeroNote["icon"]> }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icon === "heart" && <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />}
      {icon === "calendar" && (
        <>
          <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
          <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
        </>
      )}
      {icon === "rupee" && <path d="M7 5h10M7 9h10M9 5c5 0 5 8 0 8H7l8 7" />}
    </svg>
  );
}

/**
 * Hero picture: a few homes, each with the kind of message an owner wants to get
 * (a verified tenant asking, likes, a visit fixed, a deal with no broker fee).
 * Changes every 3.5 s after the intro; tap the photo for the next one. Pauses while the hero is
 * off screen or the tab is hidden. With reduced motion it does not change by itself.
 */
export function HeroSlides({ slides, tag }: { slides: HeroSlide[]; tag: string }) {
  const [index, setIndex] = useState(0);
  const [ticks, setTicks] = useState(0); // restarts the timer after a tap
  const root = useRef<HTMLElement>(null);
  const count = slides.length;

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
    setTicks((t) => t + 1);
  }, [count]);

  useEffect(() => {
    if (count < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = true;
    let timer = 0;
    const first = ticks === 0;
    const schedule = (ms: number) => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (visible && !document.hidden) setIndex((i) => (i + 1) % count);
        schedule(EVERY_MS);
      }, ms);
    };
    // First change only after the intro and the first message have been seen.
    schedule(first ? INTRO_MS + 1200 + EVERY_MS : EVERY_MS);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
    if (root.current) io.observe(root.current);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [count, ticks]);

  const note = slides[index].note;

  return (
    <figure ref={root} className="hero-card">
      <button type="button" className="hero-photo" onClick={next} aria-label="Show the next home">
        {slides.map((s, i) => (
          <span key={i} className={`hero-slide${i === index ? " is-active" : ""}`} aria-hidden={i !== index}>
            {s.src ? (
              <Image
                src={s.src}
                alt={i === index ? s.alt : ""}
                fill
                priority={i === 0}
                sizes="(min-width: 480px) 440px, 92vw"
                style={s.focus ? { objectPosition: s.focus } : undefined}
              />
            ) : (
              <span className="hero-photo-ph" />
            )}
          </span>
        ))}
        <span className="hero-photo-tag">{tag}</span>
        {count > 1 && (
          <span className="hero-dots" aria-hidden="true">
            {slides.map((_, i) => (
              <span key={i} className={i === index ? "is-active" : undefined} />
            ))}
          </span>
        )}
      </button>

      {/* key: each new message pops in again */}
      <figcaption key={index} className={`hero-note-card${index === 0 && ticks === 0 ? " is-first" : ""}`} aria-live="off">
        <span className={`hero-avatar${note.icon ? " is-icon" : ""}`} aria-hidden="true">
          {note.icon ? <NoteIcon icon={note.icon} /> : note.avatar}
        </span>
        <span className="hero-note-text">
          <strong>{note.title}</strong>
          <span className="hero-note-meta">
            {note.verified && (
              <>
                <span className="hero-verified">
                  <Check />
                  Verified
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            {note.meta}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
