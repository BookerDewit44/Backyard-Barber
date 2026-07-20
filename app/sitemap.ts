import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/services";

// Served at /sitemap.xml. Submitted to Google Search Console and pointed at by
// app/robots.ts. Homepage ranks highest; the rest are equal marketing pages.
// The per-service detail pages come from SERVICES, so adding a service adds its
// page here automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes = [
    ...ROUTES,
    ...SERVICES.map((service) => `/services/${service.slug}`),
  ];

  return routes.map((route) => ({
    url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
