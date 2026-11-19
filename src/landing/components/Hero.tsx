import { config } from "@/landing/config";
import { copy } from "@/landing/copy";
import { findSlotImage } from "@/landing/lib/slots";
import { HeroCounter } from "./HeroCounter";
import { type HeroSlide, HeroSlides } from "./HeroSlides";
import { ArrowRight } from "./Icons";

function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  );
}

/**
 * Section 1, built to be understood in one phone screen (360x560 visible and up), top to bottom:
 * question -> one-line answer -> homes with the messages an owner wants to get
 * -> 3 reasons -> one button -> small live seats line.
 */
export function Hero() {
  const h = copy.hero;
  // Photo files are looked up on the server; the slides themselves run on the client.
  const slides: HeroSlide[] = config.heroSlides.map((s, i) => ({
    src: findSlotImage(s.slot),
    alt: s.alt,
    focus: "focus" in s ? s.focus : undefined,
    note: h.notes[i % h.notes.length],
  }));

  return (
    <section className="hero" aria-labelledby="hero-h">
      <h1 id="hero-h" className="h1">
        {h.titleLines.map((line, i) => (
          <span key={line} className="mask-line">
            <span style={{ animationDelay: `calc(var(--intro) + ${i * 80}ms)` }}>{line}</span>
          </span>
        ))}
      </h1>
      <p className="hero-sub">{h.sub}</p>

      <HeroSlides slides={slides} tag={h.photoTag} />

      <ul className="hero-points">
        {h.points.map((p) => (
          <li key={p}>
            <span className="hero-tick" aria-hidden="true">
              <Check />
            </span>
            {p}
          </li>
        ))}
      </ul>

      <a id="hero-cta" className="btn-primary" href="#lock">
        {h.cta}
        <ArrowRight />
      </a>
      <HeroCounter />
    </section>
  );
}
