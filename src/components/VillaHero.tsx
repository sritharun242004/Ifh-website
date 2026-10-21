"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

/**
 * Pinned home hero: the sunrise villa holds the screen, then scrolling crossfades it to
 * the same villa at sunset before the page moves on. Scroll progress is written to a CSS
 * variable (--p, 0 → 1) from one rAF per scroll, so React never re-renders while scrolling.
 */
export function VillaHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // tuck the hero under the sticky glass header so the photo runs to the top edge
    // (measured from the hero's natural position, which includes the header's collapsed margin)
    const syncHeader = () => {
      el.style.setProperty("--hdr", "0px");
      const top = el.getBoundingClientRect().top + window.scrollY;
      el.style.setProperty("--hdr", `${Math.max(top, 0)}px`);
    };

    // On phones the scroll progress is eased toward its target every frame, so the
    // text drift, progress bar and sunrise/sunset swap glide instead of stepping.
    const phone = window.matchMedia("(max-width: 899px)");
    let frame = 0;
    let target = 0;
    let shown = 0;
    const paint = (p: number) => {
      el.style.setProperty("--p", p.toFixed(4));
      // phones swap between the two photos instead of blending them
      el.dataset.phase = p > 0.35 ? "sunset" : "sunrise";
    };
    const tick = () => {
      frame = 0;
      if (phone.matches) {
        shown += (target - shown) * 0.14;
        if (Math.abs(target - shown) < 0.0005) shown = target;
        else frame = requestAnimationFrame(tick);
        paint(shown);
      } else {
        shown = target;
        paint(target);
      }
    };
    const update = () => {
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      target = travel > 0 ? Math.min(Math.max(-rect.top / travel, 0), 1) : 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onScroll = update;
    const onResize = () => {
      syncHeader();
      onScroll();
    };

    syncHeader();
    update();
    shown = target;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={root} className="villa-hero" aria-labelledby="home-h">
      <div className="villa-stage">
        <div className="villa-layer villa-sunrise villa-desk">
          <Image
            src="/assets/img/villa-sunrise.png"
            alt="A modern three-storey villa with glass balconies and a rooftop garden, at sunrise."
            fill
            priority
            quality={100}
            sizes="100vw"
          />
        </div>
        <div className="villa-layer villa-sunset villa-desk" aria-hidden="true">
          <Image src="/assets/img/villa-sunset.png" alt="" fill quality={100} sizes="100vw" />
        </div>
        <div className="villa-layer villa-sunrise villa-mob" aria-hidden="true">
          <Image
            src="/assets/img/villa-sunrise-mobile.png"
            alt=""
            fill
            loading="eager"
            quality={100}
            sizes="100vw"
          />
        </div>
        <div className="villa-layer villa-sunset villa-mob" aria-hidden="true">
          <Image
            src="/assets/img/villa-sunset-mobile.png"
            alt=""
            fill
            loading="eager"
            quality={100}
            sizes="100vw"
          />
        </div>
        <div className="villa-scrim" aria-hidden="true" />

        <div className="container villa-content">
          <span className="eyebrow">Zero brokerage · IFH verified</span>
          <h1 className="hero-title" id="home-h">
            Verified <span className="villa-hl">homes</span>
            <br />
            and <span className="villa-hl">offices</span>
          </h1>
          <p className="lead">
            Rent a home or find an office. Browse IFH-verified listings and connect directly with
            owners.
          </p>
          <ul className="villa-trust">
            <li>
              <Icon name="file" />
              Clear property details
            </li>
            <li>
              <Icon name="shield" />
              Trust-first search
            </li>
            <li>
              <Icon name="userCheck" />
              One account
            </li>
          </ul>
        </div>

        <div className="villa-progress" aria-hidden="true">
          <span className="villa-progress-sun" />
          <span className="villa-progress-track">
            <span />
          </span>
          <span className="villa-progress-moon" />
        </div>
      </div>
    </section>
  );
}
