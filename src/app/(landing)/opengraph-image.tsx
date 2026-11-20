import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/* Dynamic share card for the owner landing page (WhatsApp / X / Facebook).
   Uses the REAL brand mark (public/assets/logo.png) and the site's exact palette
   (pine + lime from landing.css), rendered in code so it always matches the
   live campaign copy. nodejs runtime so the logo file can be read at build. */
export const runtime = "nodejs";
export const alt = "IFH — Post your house free. Zero commission. First 500 owners free.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site tokens (landing.css :root)
const PINE = "#14453b";
const LIME = "#8eea5c";
const MUTED = "#4f6a5f";

const LOGO = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/assets/logo.png"),
).toString("base64")}`;

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
          padding: "60px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* brand lockup — the real smiley-house mark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} width={176} height={116} alt="" />
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 26 }}>
            <div style={{ fontSize: 54, fontWeight: 800, color: PINE, lineHeight: 1 }}>IFH</div>
            <div style={{ fontSize: 24, color: MUTED, marginTop: 8 }}>
              I Find House &middot; Namma Ooru App
            </div>
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, color: PINE, lineHeight: 1.03, letterSpacing: -1 }}>
            Post your house — FREE
          </div>
          <div style={{ fontSize: 34, color: MUTED, marginTop: 22, maxWidth: 1000 }}>
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
              color: PINE,
              fontSize: 30,
              fontWeight: 700,
              padding: "16px 34px",
              borderRadius: 999,
            }}
          >
            First 500 owners post free
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: PINE }}>www.ifindhouse.in</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
