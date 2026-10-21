"use client";

import { useState } from "react";
import type { IconCard } from "@/content/site";
import { Icon } from "./Icon";

/**
 * Big numerals 1-2-3. On laptops the hovered one opens with CSS alone; on phones tapping a
 * row opens it (one at a time, the first starts open), which is what `is-open` drives.
 */
export function WhyRail({ items }: { items: IconCard[] }) {
  const [open, setOpen] = useState(0);

  return (
    <ol className="why-rail">
      {items.map((item, i) => (
        <li
          key={item.title}
          className={`why-item${open === i ? " is-open" : ""}`}
          tabIndex={0}
          role="button"
          aria-expanded={open === i}
          onClick={() => setOpen(i)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(i);
            }
          }}
        >
          <span className="why-num" aria-hidden="true">
            {i + 1}
          </span>
          <div className="why-body">
            <div className="why-fold">
              <div>
                <span className="why-icon">
                  <Icon name={item.icon} />
                </span>
              </div>
            </div>
            <h3>{item.title}</h3>
            <div className="why-fold">
              <div>
                <p>{item.text}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
