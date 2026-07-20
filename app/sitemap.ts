import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/site";

// Served at /sitemap.xml. Submitted to Google Search Console and pointed at by
// app/robots.ts. Homepage ranks highest; the rest are equal marketing pages.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
