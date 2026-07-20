import { SERVICES } from "@/lib/services";
import {
  BUSINESS_NAME,
  CITY,
  FACEBOOK_URL,
  FOUNDED_YEAR,
  GEO,
  PHONE_E164,
  SERVICE_RADIUS_MILES,
  SITE_URL,
  STATE,
} from "@/lib/site";

// schema.org LocalBusiness markup, rendered once from the root layout so it is
// present on every page. This is what lets Google show the business in local
// results / the knowledge panel for searches like "stump grinding Statesville NC".
//
// No street address: this is a mobile service with no storefront to visit, so
// it declares a service area instead (areaServed) and omits `address`.
// Validate changes at https://search.google.com/test/rich-results
export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS_NAME,
    url: SITE_URL,
    telephone: PHONE_E164,
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    foundingDate: FOUNDED_YEAR,
    priceRange: "$$",
    sameAs: [FACEBOOK_URL],
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: GEO.lat,
        longitude: GEO.lng,
      },
      geoRadius: Math.round(SERVICE_RADIUS_MILES * 1609.34),
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: CITY,
      addressRegion: STATE,
      addressCountry: "US",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Land management services",
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          // Points Google at the service's own detail page.
          url: `${SITE_URL}/services/${service.slug}`,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Escaping "<" prevents a stray tag in the data from closing this script
      // element early — see the Next.js JSON-LD guide.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
