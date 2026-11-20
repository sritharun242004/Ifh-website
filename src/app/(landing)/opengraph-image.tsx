import { ImageResponse } from "next/og";

/* Dynamic share card for the owner landing page (WhatsApp / X / Facebook).
   Rendered in code so it always matches the live campaign copy — no static
   asset to keep in sync. nodejs runtime so it works on the Amplify adapter. */
export const runtime = "nodejs";
export const alt = "IFH — Post your house free. Zero commission. First 500 owners free.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LIME = "#9fe870";
const INK = "#0b3d2e";
const INK_SOFT = "#38513f";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* brand lockup */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 30,
              background: LIME,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="78" height="78" viewBox="0 0 40 40">
              <path
                d="M8 19 20 9l12 10v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"
                fill="none"
                stroke="#0e0f0c"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 26 }}>
            <div style={{ fontSize: 54, fontWeight: 700, color: INK, lineHeight: 1 }}>IFH</div>
            <div style={{ fontSize: 24, color: INK_SOFT, marginTop: 8 }}>
              I Find House &middot; Namma Ooru App
            </div>
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 700, color: INK, lineHeight: 1.04, letterSpacing: -1 }}>
            Post your house — FREE
          </div>
          <div style={{ fontSize: 34, color: INK_SOFT, marginTop: 22, maxWidth: 1000 }}>
            Zero commission. Only verified tenants see your number.
          </div>
        </div>

        {/* footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: LIME,
              color: INK,
              fontSize: 30,
              fontWeight: 700,
              padding: "16px 34px",
              borderRadius: 999,
            }}
          >
            First 500 owners post free
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: INK }}>www.ifindhouse.in</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
