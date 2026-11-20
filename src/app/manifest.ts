import type { MetadataRoute } from "next";

/* Generates /manifest.webmanifest — lets the site be installed on mobile and
   gives search engines app-level metadata. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "iFindHouse — Namma Ooru App",
    short_name: "iFindHouse",
    description: "Post your house free. Zero commission. Only verified tenants see your number.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#044233",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
