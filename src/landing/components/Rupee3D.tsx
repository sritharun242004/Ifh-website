"use client";

import { useEffect, useRef, useState } from "react";

const LAYERS = 16;
const DEPTH_STEP = 2; // px between layers → ~32px of extrusion
const MAX_TILT = 18;

// pine (#14453B) → pine-press (#0E322A), reaching pine-press quickly so the side reads against the face
const mix = (t: number) => {
  const a = [0x14, 0x45, 0x3b];
  const b = [0x0e, 0x32, 0x2a];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
};
const LAYER_COLORS = Array.from({ length: LAYERS }, (_, i) => mix(Math.min(1, (i + 4) / LAYERS * 1.6)));

function isLowEnd() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.deviceMemory !== undefined && nav.deviceMemory < 2) || (navigator.hardwareConcurrency || 4) <= 2;
}

/**
 * Giant extruded ₹0 built with CSS 3D (no WebGL): stacked duplicate layers pushed back with translateZ.
 * Tilts toward the finger / mouse (max ±18°) and springs back on release. Idle: slow float once `idle`.
 * Reduced motion or very slow devices: flat pine ₹0 with a soft shadow.
 */
export function Rupee3D({ idle }: { idle: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [flat, setFlat] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || isLowEnd()) {
      setFlat(true);
      return;
    }
    const el = root.current;
    if (!el) return;
    let frame = 0;

    const tiltTo = (x: number, y: number) => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (x - (r.left + r.width / 2)) / (r.width / 2)));
      const dy = Math.max(-1, Math.min(1, (y - (r.top + r.height / 2)) / (r.height / 2)));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.classList.add("is-tilting");
        el.style.setProperty("--ry", `${(dx * MAX_TILT).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-dy * MAX_TILT).toFixed(2)}deg`);
      });
    };
    const release = () => {
      cancelAnimationFrame(frame);
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    const onPointer = (e: PointerEvent) => e.pointerType === "mouse" && tiltTo(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) tiltTo(t.clientX, t.clientY);
    };
    // Passive listeners: tilting never blocks page scroll.
    el.addEventListener("pointermove", onPointer, { passive: true });
    el.addEventListener("pointerleave", release, { passive: true });
    el.addEventListener("touchstart", onTouch, { passive: true });
    el.addEventListener("touchmove", onTouch, { passive: true });
    el.addEventListener("touchend", release, { passive: true });
    el.addEventListener("touchcancel", release, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onPointer);
      el.removeEventListener("pointerleave", release);
      el.removeEventListener("touchstart", onTouch);
      el.removeEventListener("touchmove", onTouch);
      el.removeEventListener("touchend", release);
      el.removeEventListener("touchcancel", release);
    };
  }, []);

  if (flat) {
    return (
      <div className="r3d r3d-flat">
        <span className="r3d-face">₹0</span>
      </div>
    );
  }

  return (
    <div ref={root} className="r3d">
      <div className="r3d-tilt">
        <div className={`r3d-float${idle ? " is-idle" : ""}`}>
          {LAYER_COLORS.map((color, i) => (
            <span
              key={i}
              className="r3d-layer"
              aria-hidden="true"
              style={{ color, transform: `translateZ(${-(i + 1) * DEPTH_STEP}px)` }}
            >
              ₹0
            </span>
          ))}
          <span className="r3d-face">₹0</span>
        </div>
      </div>
      <span className="r3d-shadow" aria-hidden="true" />
    </div>
  );
}
