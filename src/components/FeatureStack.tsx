"use client";

import { useEffect, useRef } from "react";
import type { IconCard } from "@/content/site";
import { Icon } from "./Icon";
import { SectionHead } from "./Sections";

/* One shared lime gradient for every card. */
const LOOKS = [{ bg: "linear-gradient(140deg, #9fe870 0%, #cdffad 100%)", dark: false }];

/**
 * "Everything in one platform": nine cards that end up in a 3x3 grid. As you scroll
 * down the cards rise one at a time from a pile at the bottom and settle into their
 * places; scroll back up and they leave the grid one by one. Below 900px (or with
 * reduced motion) it is simply the finished grid.
 */
export function FeatureStack({
  cards,
  id = "feat-h",
  eyebrow = "The platform",
  title = "Everything in one platform",
  respectWide = false,
}: {
  cards: IconCard[];
  id?: string;
  eyebrow?: string;
  title?: string;
  /** Let cards flagged `wide` span two columns on desktop. */
  respectWide?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const trackEl = track.current;
    const gridEl = grid.current;
    if (!trackEl || !gridEl) return;

    const desktop = matchMedia("(min-width: 900px)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const cardEls = items.current.filter((el): el is HTMLDivElement => el !== null);
    const count = cardEls.length;
    const mid = (count - 1) / 2;

    const mobile = matchMedia("(max-width: 599px)");
    let deck = false;
    let enabled = false;
    // For each card: offset from its grid slot to its place in the pile
    let from: { dx: number; dy: number; rot: number }[] = [];
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

    const clear = () =>
      cardEls.forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.zIndex = "";
        el.style.filter = "";
        el.style.pointerEvents = "";
      });

    // Mobile cover ring: a swipeable 3D ring; the centre card faces front and the
    // neighbours tilt away on either side.
    let pos = 0;
    let dragging = false;
    const layout = () => {
      if (!deck) return;
      cardEls.forEach((el, i) => {
        const d = i - pos;
        const a = Math.abs(d);
        const side = Math.max(-1, Math.min(1, d));
        const x = side * Math.min(a, 1) * 118 + (a > 1 ? Math.sign(d) * (a - 1) * 34 : 0);
        el.style.transform = `translate3d(${x}px, 0, ${-Math.min(a, 3) * 90}px) rotateY(${-side * Math.min(a, 1) * 52}deg) scale(${1 - Math.min(a, 1) * 0.08})`;
        el.style.opacity = String(a > 2.6 ? 0 : 1);
        el.style.zIndex = String(100 - Math.round(a * 10));
        el.style.filter = `brightness(${1 - Math.min(a, 1) * 0.18})`;
        el.style.pointerEvents = a > 2.6 ? "none" : "";
      });
    };

    const onDown = (e: PointerEvent) => {
      if (!deck) return;
      dragging = true;
      startX = e.clientX;
      startPos = pos;
      moved = false;
      gridEl.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      pos = Math.max(0, Math.min(count - 1, startPos - dx / 120));
      layout();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      gridEl.classList.remove("is-dragging");
      const dx = e.clientX - startX;
      pos = Math.round(Math.max(0, Math.min(count - 1, startPos - dx / 120 + (moved ? -Math.sign(dx) * 0.2 : 0))));
      layout();
    };
    let startX = 0;
    let startPos = 0;
    let moved = false;
    const onClick = (e: MouseEvent) => {
      if (!deck || moved) return;
      const i = cardEls.findIndex((el) => el.contains(e.target as Node));
      if (i >= 0 && i !== Math.round(pos)) {
        pos = i;
        layout();
      }
    };
    gridEl.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    gridEl.addEventListener("click", onClick);

    const measure = () => {
      enabled = desktop.matches && !reduce.matches;
      deck = mobile.matches && !reduce.matches;
      if (deck) {
        clear();
        layout();
        return;
      }
      if (!enabled) {
        clear();
        return;
      }
      const cx = gridEl.clientWidth / 2;
      const pileY = gridEl.clientHeight / 2 + window.innerHeight * 0.55; // below the screen
      from = cardEls.map((el, i) => {
        const s = i - mid;
        const x = el.offsetLeft + el.offsetWidth / 2;
        const y = el.offsetTop + el.offsetHeight / 2;
        return {
          dx: cx + s * 40 - x,
          dy: pileY + Math.abs(s) * 6 - y,
          rot: s * 4 + (i % 2 ? 3 : -3),
        };
      });
      update();
    };

    const update = () => {
      if (!enabled) return;
      const rect = trackEl.getBoundingClientRect();
      const travel = trackEl.offsetHeight - window.innerHeight;
      const p = travel > 0 ? clamp01(-rect.top / travel) : 0;

      // Each card gets its own slice of the scroll distance (staggered)
      cardEls.forEach((el, i) => {
        const e = easeOut(clamp01((p - (0.03 + i * 0.075)) / 0.22));
        const f = from[i];
        const k = 1 - e; // 1 = in the pile, 0 = home in the grid
        el.style.transform = `translate3d(${f.dx * k}px, ${f.dy * k}px, 0) rotate(${f.rot * k}deg) scale(${0.92 + 0.08 * e})`;
        el.style.opacity = String(clamp01(e * 2.2));
        el.style.zIndex = String(i);
      });
    };

    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    reduce.addEventListener("change", measure);
    mobile.addEventListener("change", measure);
    document.fonts?.ready.then(measure);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
      reduce.removeEventListener("change", measure);
      mobile.removeEventListener("change", measure);
      gridEl.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      gridEl.removeEventListener("click", onClick);
      clear();
    };
  }, []);

  return (
    <div className="stack-track" ref={track}>
      <div className="stack-sticky">
        <SectionHead id={id} eyebrow={eyebrow} title={title} />
        <div className="stack-grid" ref={grid}>
          {cards.map((card, i) => {
            const look = LOOKS[i % LOOKS.length];
            return (
              <div
                key={card.title}
                ref={(el) => {
                  items.current[i] = el;
                }}
                className={`stack-card${look.dark ? " is-dark" : ""}${respectWide && card.wide ? " is-wide" : ""}`}
                style={{ background: look.bg, "--i": i } as React.CSSProperties}
              >
                <div className="icon-box">
                  <Icon name={card.icon} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
