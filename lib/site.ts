// Single source of truth for business facts that appear in more than one place:
// page metadata, the sitemap, the LocalBusiness structured data, and the UI.

// Canonical origin for absolute URLs (metadataBase, sitemap, JSON-LD).
// Points at the Netlify subdomain until mybackyardbarber.com's DNS is live —
// then set NEXT_PUBLIC_SITE_URL in the Netlify UI (or change this default) so
// canonicals follow the real domain. Never give this a trailing slash.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ornate-froyo-9a8406.netlify.app";

export const BUSINESS_NAME = "Backyard Barber Land Management";

export const PHONE_DISPLAY = "704-902-9827";
export const PHONE_E164 = "+17049029827";
export const PHONE_HREF = `tel:${PHONE_E164}`;

export const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61575530987820";

export const CITY = "Statesville";
export const STATE = "NC";
export const FOUNDED_YEAR = "2010";

// Statesville, NC — also drives the service-area map (components/ServiceAreaMap.tsx).
export const GEO: { lat: number; lng: number } = { lat: 35.7826, lng: -80.8873 };
export const SERVICE_RADIUS_MILES = 100;

// Routes that should be crawled and listed in the sitemap, most important first.
// Keep in sync with the pages under app/ and the nav in components/Header.tsx.
export const ROUTES = [
  "/",
  "/services",
  "/gallery",
  "/service-area",
  "/about",
  "/contact",
] as const;
