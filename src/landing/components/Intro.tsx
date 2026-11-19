import { copy } from "@/landing/copy";
import { LogoMark } from "./Logo";

/**
 * Opening reveal: logo, then "IFH", then the brand line, on pine for ~1.5 s; then the curtain
 * lifts onto the hero. Pure CSS (server-rendered), so it is there on the very first paint, needs
 * no JS, and can never get stuck: the keyframes end hidden and click-through. Decorative, so
 * hidden from screen readers (the same logo, name and line are in the top bar).
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-inner">
        <LogoMark className="intro-logo" sizes="150px" priority />
        <p className="intro-name intro-mask">
          <span>IFH</span>
        </p>
        <p className="intro-line intro-mask" lang="ta">
          <span>{copy.brandLine}</span>
        </p>
      </div>
    </div>
  );
}
