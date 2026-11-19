import { copy } from "@/landing/copy";
import { LogoMark } from "./Logo";
import { SeatChip } from "./SeatChip";

/** Slim always-visible bar: logo left, live seat chip right. No menu. */
export function TopBar() {
  return (
    <header className="topbar">
      <a className="topbar-logo" href="#main" aria-label={copy.topBar.logoLabel}>
        <LogoMark className="logo-mark" priority />
        <span className="logo-text">
          <span className="logo-word">IFH</span>
          <span className="logo-line" lang="ta">
            {copy.brandLine}
          </span>
        </span>
      </a>
      <SeatChip />
    </header>
  );
}
