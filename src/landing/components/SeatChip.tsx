"use client";

import { copy } from "@/landing/copy";
import { Odometer } from "./Odometer";
import { useSeats } from "./SeatsProvider";

/** Top-bar chip: pulsing live dot + "449 left". Dimmed while the first real number loads. */
export function SeatChip() {
  const { left, total, status } = useSeats();

  if (status === "error" && left === null) {
    return <span className="seat-chip">First {total} free</span>;
  }
  if (left === 0) {
    return <span className="seat-chip">{copy.topBar.seatsGone}</span>;
  }
  return (
    <span className={`seat-chip${left === null ? " is-loading" : ""}`}>
      <span className="live-dot" aria-hidden="true" />
      <span className="seat-chip-num">
        <Odometer value={left ?? total} />
      </span>
      <span>{copy.topBar.seatsSuffix}</span>
    </span>
  );
}
