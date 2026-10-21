"use client";

import { useRef, useState } from "react";
import type { FaqItem } from "@/content/site";

type Props = { id: string; eyebrow: string; title: string; items: FaqItem[] };

/** FAQ accordion: one answer open at a time, smooth height animation. */
export function Faq({ id, eyebrow, title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section className="section bg-sage" id="faq" aria-labelledby={`${id}-h`}>
      <div className="container faq-wrap">
        <div className="reveal">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title" id={`${id}-h`}>
            {title}
          </h2>
        </div>
        <div className="faq reveal">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div className="faq-item" key={item.q}>
                <h3>
                  <button
                    className="faq-q"
                    id={`${id}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    {item.q}
                    <span className="pm" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  className="faq-a"
                  id={`${id}-a${i}`}
                  role="region"
                  aria-labelledby={`${id}-q${i}`}
                  style={{ height: isOpen ? (panels.current[i]?.scrollHeight ?? "auto") : 0 }}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
