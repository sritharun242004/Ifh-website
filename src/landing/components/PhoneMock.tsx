import Image from "next/image";
import { config } from "@/landing/config";
import { copy } from "@/landing/copy";

const CHOSEN: ReadonlySet<number> = new Set(config.privacyChosen); // the photos the owner chooses to show

function HouseGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  );
}

function Lock() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function Pin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

/** One photo tile: the real photo when its file exists, else the house-icon placeholder. */
function Thumb({ i, src, chosen }: { i: number; src: string | null; chosen?: boolean }) {
  return (
    <span className={`thumb thumb-${i % 4}${src ? " has-photo" : ""}${chosen ? " is-chosen" : ""}`}>
      {src ? <Image src={src} alt="" fill sizes="90px" /> : <HouseGlyph />}
      {chosen && (
        <span className="thumb-tick">
          <Tick />
        </span>
      )}
    </span>
  );
}

/**
 * Small phone built in HTML/CSS that follows the privacy steps, using the owner's house photos:
 * 0: 10 photo thumbs · 1: 8 blur, 2 stay sharp with a tick · 2: number + location hidden · 3: KYC unlocks number.
 */
export function PhoneMock({ step, photos }: { step: number; photos: (string | null)[] }) {
  const m = copy.privacy.mock;
  return (
    <div className="phone" data-step={step} aria-hidden="true">
      <div className="phone-notch" />
      <p className="phone-title">{m.title}</p>

      {/* Steps 01-02: photo grid */}
      <div className="phone-view phone-grid-view">
        <div className="phone-grid">
          {photos.map((src, i) => (
            <Thumb key={i} i={i} src={src} chosen={CHOSEN.has(i)} />
          ))}
        </div>
      </div>

      {/* Steps 03-04: what a tenant sees */}
      <div className="phone-view phone-detail-view">
        <div className="detail-photos">
          {config.privacyChosen.map((i) => (
            <Thumb key={i} i={i} src={photos[i] ?? null} />
          ))}
        </div>
        <div className="detail-row detail-number">
          <span className="detail-icon">
            <Lock />
          </span>
          <span className="num-hidden">{m.hiddenNumber}</span>
          <span className="num-shown">{m.shownNumber}</span>
        </div>
        <div className="detail-map">
          <span className="map-blur" />
          <span className="map-pin">
            <Pin />
          </span>
          <span className="map-label">{m.locationLabel}</span>
        </div>
        <div className="kyc-badge">
          <Tick />
          {m.kyc}
        </div>
      </div>
    </div>
  );
}
