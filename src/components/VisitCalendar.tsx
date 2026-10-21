"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["10:00 AM", "12:00 PM", "3:00 PM", "5:30 PM"];

const COLLAGE = [
  { src: "/assets/img/1502672260266-1c1ef2d93688-700.jpg", alt: "A bright, furnished living room" },
  { src: "/assets/img/1600596542815-ffad4c1539a9-700.jpg", alt: "A modern independent house" },
  { src: "/assets/img/1497366216548-37526070297c-700.jpg", alt: "A bright modern workspace" },
  { src: "/assets/img/1560448204-e02f11c3d0e2-700.jpg", alt: "A verified apartment interior" },
];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * "Schedule visits": a month calendar to pick a day and a time slot, beside a photo collage.
 * Dates are computed on the client so the calendar always starts from the real today.
 */
export function VisitCalendar() {
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [picked, setPicked] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setToday(now);
    setView({ y: now.getFullYear(), m: now.getMonth() });
  }, []);

  const ready = today && view;
  const monthLabel = ready
    ? new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(
        new Date(view.y, view.m, 1),
      )
    : "";

  const cells: (Date | null)[] = [];
  if (ready) {
    const first = new Date(view.y, view.m, 1);
    const lead = (first.getDay() + 6) % 7; // weeks start on Monday
    const days = new Date(view.y, view.m + 1, 0).getDate();
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(new Date(view.y, view.m, d));
  }

  const atCurrentMonth = !!ready && view.y === today.getFullYear() && view.m === today.getMonth();
  const shift = (delta: number) => {
    if (!view) return;
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };
  const pickedLabel = picked
    ? new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(
        picked,
      )
    : null;

  return (
    <section className="section visit" aria-labelledby="visit-h">
      <div className="container visit-grid">
        <div className="vc reveal">
          <span className="vc-eyebrow">Schedule visits</span>
          <h2 className="vc-title" id="visit-h">
            <span>Pick a time</span> <span className="hl-green">that suits you both.</span>
          </h2>
          <p className="vc-lead">Chat with owners and schedule visits.</p>

          <div className="vc-card" aria-live="polite">
            <div className="vc-head">
              <button
                type="button"
                className="vc-nav"
                onClick={() => shift(-1)}
                disabled={!ready || atCurrentMonth}
                aria-label="Previous month"
              >
                <Icon name="arrow" />
              </button>
              <strong>{monthLabel || " "}</strong>
              <button
                type="button"
                className="vc-nav"
                onClick={() => shift(1)}
                disabled={!ready}
                aria-label="Next month"
              >
                <Icon name="arrow" />
              </button>
            </div>

            <div className="vc-week" aria-hidden="true">
              {WEEKDAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="vc-days">
              {ready
                ? cells.map((date, i) => {
                    if (!date) return <span key={`b${i}`} />;
                    const past = date < today;
                    const isToday = sameDay(date, today);
                    const isPicked = !!picked && sameDay(date, picked);
                    return (
                      <button
                        key={date.getTime()}
                        type="button"
                        className={`vc-day${isToday ? " is-today" : ""}${isPicked ? " is-picked" : ""}`}
                        disabled={past}
                        aria-pressed={isPicked}
                        aria-label={new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(date)}
                        onClick={() => {
                          setPicked(date);
                          setSlot(null);
                        }}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })
                : null}
            </div>

            <div className={`vc-slots${picked ? " is-open" : ""}`}>
              <div>
                <p className="vc-slot-title">
                  {pickedLabel ? `Pick a time on ${pickedLabel}` : "Pick a day to see times"}
                </p>
                <div className="vc-chips">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`vc-chip${slot === s ? " is-picked" : ""}`}
                      aria-pressed={slot === s}
                      onClick={() => setSlot(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link className="btn vc-cta" href="/tenant#listings">
              {pickedLabel && slot ? `Find a home to visit · ${pickedLabel}, ${slot}` : "Find a home to visit"}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>

        <div className="vc-collage reveal" aria-hidden="false">
          {COLLAGE.map((img, i) => (
            <div key={img.src} className={`vc-photo vc-p${i + 1}`}>
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 900px) 24vw, 45vw" />
            </div>
          ))}
          <div className="vc-badge vc-b1">
            <span className="vc-badge-icon">
              <Icon name="check" />
            </span>
            <div>
              <small>248 homes</small>
              <strong>IFH verified</strong>
            </div>
          </div>
          <div className="vc-badge vc-b2">
            <span className="vc-badge-icon">
              <Icon name="calendar" />
            </span>
            <div>
              <small>Visits</small>
              <strong>Zero brokerage</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
