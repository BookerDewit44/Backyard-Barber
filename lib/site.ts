// Single source of truth for business facts that appear in more than one place:
// page metadata, the sitemap, the LocalBusiness structured data, and the UI.

// Canonical origin for absolute URLs (metadataBase, sitemap, JSON-LD).
// Must match the primary domain configured in Netlify, otherwise canonicals
// point somewhere that redirects. Override with NEXT_PUBLIC_SITE_URL for
// preview deploys. Never give this a trailing slash.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mybackyardbarber.com";

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
// Drives the Service Area page copy, the map circle, and the areaServed
// GeoCircle in the structured data. Deliberately NOT shown on the homepage.
export const SERVICE_RADIUS_MILES = 50;

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
