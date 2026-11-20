import type { MetadataRoute } from "next";

/* Generates /sitemap.xml for the public pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.ifindhouse.in";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/property-owner`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tenant`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
