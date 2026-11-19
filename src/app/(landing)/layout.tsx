import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Manrope, Montserrat, Noto_Sans_Tamil } from "next/font/google";
import { MetaPixel } from "@/landing/components/MetaPixel";
import { copy } from "@/landing/copy";
import "./landing.css";

/* Owner landing page root layout. Separate from (site) so none of the legacy CSS/JS ships here.
   Only the headline font is preloaded. */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--f-head",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-body",
  display: "swap",
  preload: false,
});
const montserrat = Montserrat({
  // latin-ext carries the ₹ glyph; it is only downloaded when ₹ is on screen (unicode-range).
  subsets: ["latin", "latin-ext"],
  weight: ["800", "900"],
  variable: "--f-num",
  display: "swap",
  preload: false,
});
const tamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["800"],
  variable: "--f-ta",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  metadataBase: new URL("https://ifindhouse.in"),
  icons: { icon: "/assets/logo.png" },
  openGraph: {
    type: "website",
    siteName: "IFH",
    title: copy.meta.title,
    description: copy.meta.description,
    url: "https://ifindhouse.in/",
    // og-image.jpg (₹0 + brand line + counter) is added in a later step.
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function LandingRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${manrope.variable} ${hanken.variable} ${montserrat.variable} ${tamil.variable}`}
    >
      <body>
        {/* A refresh always starts at the top: no restored scroll position, no jump to an old #anchor.
            Runs before the page content parses. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if("scrollRestoration" in history)history.scrollRestoration="manual";if(location.hash){history.replaceState(null,"",location.pathname+location.search);addEventListener("DOMContentLoaded",function(){scrollTo({top:0,left:0,behavior:"instant"})})}}catch(e){}})();`,
          }}
        />
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
