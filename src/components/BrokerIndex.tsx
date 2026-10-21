"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

const ROWS = [
  { big: "One to two", word: "months’ rent", note: "Through a broker", ifh: false },
  { big: "Zero", word: "brokerage", note: "Through IFH", ifh: true },
];

/**
 * "The brokerage maths" as a typographic index: photo header, then ruled rows with a
 * huge figure and word. The wording reveals row by row as you scroll.
 */
export function BrokerIndex({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-bi]") ?? []);
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="bi bg-ink on-dark" aria-labelledby="broker-h" ref={root}>
      <div className="bi-photo">
        <Image
          src="/assets/img/pexels-d67-hunter-2154822929-35289099.jpg"
          alt=""
          fill
          sizes="100vw"
        />
      </div>
      <div className="container">
        <div className="bi-head" data-bi>
          <span className="eyebrow">The brokerage maths</span>
          <h2 className="section-title broker-title" id="broker-h">
            A month&apos;s rent is the going rate for brokerage.{" "}
            <em>We charge a fixed fee instead.</em>
          </h2>
        </div>
        <div className="bi-rows">
          {ROWS.map((row) => (
            <div className={`bi-row${row.ifh ? " is-ifh" : ""}`} key={row.note} data-bi>
              <p className="bi-line">
                <span className="bi-big">{row.big}</span>
                <span className="bi-word">{row.word}</span>
              </p>
              <span className="bi-note">→ {row.note}</span>
            </div>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}
