import type { MetadataRoute } from "next";

/* Generates /robots.txt. Allows the public site, keeps the admin + API out of
   the index, and points crawlers at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  const base = "https://www.ifindhouse.in";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
