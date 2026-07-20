// The five services, shown on the homepage grid, the /services index, and each
// service's own detail page at /services/[slug].
//
// To add a service: add an entry here, drop a photo in public/services/, and it
// appears everywhere automatically (including the sitemap and the JSON-LD).
// `slug` is the URL — don't change one after launch without a redirect.

export type Service = {
  slug: string;
  name: string;
  /** One-liner used on the cards. */
  description: string;
  image?: string;
  /** Short line under the heading on the detail page. */
  tagline: string;
  /** A paragraph or two of detail. Plain sentences, no jargon. */
  details: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "lawn-care",
    name: "Lawn Care & Maintenance",
    description:
      "Mowing, edging, trimming, and seasonal cleanup to keep your lawn looking its best all year.",
    image: "/services/lawn-care.jpg",
    tagline: "Weekly, bi-weekly, or one-time — whatever your yard needs.",
    details: [
      "We keep lawns sharp, from small residential yards to larger properties that take real equipment. Most customers are on a weekly or bi-weekly schedule through the growing season, but we're glad to do one-time cleanups too.",
      "If your yard has gotten away from you, that's not a problem — overgrown lots are some of our most satisfying work. We'll knock it back and get it on a schedule so it stays that way.",
    ],
  },
  {
    slug: "grading",
    name: "Grading & Land Leveling",
    description:
      "Site grading and land leveling for drainage, new lawns, driveways, and building pads.",
    image: "/services/grading.jpg",
    tagline: "Get water moving away from where it shouldn't be.",
    details: [
      "Most grading calls start with water — a soggy spot that never dries out, runoff heading toward a foundation, or a yard that washes out every time it rains hard. We reshape the ground so water goes where it should.",
      "We also grade for new lawns, driveways, sheds, and building pads. We'll walk the property with you before anything starts so there are no surprises.",
    ],
  },
  {
    slug: "stump-grinding",
    name: "Stump Grinding",
    description:
      "Grinding tree stumps down below grade so you can reclaim your yard, replant, or build without the eyesore.",
    image: "/services/stump-grinding.jpg",
    tagline: "Gone below grade, so you can mow right over it.",
    details: [
      "A stump left behind is an obstacle every time you mow and an eyesore the rest of the time. We grind them down below grade so the spot can be seeded, planted, or just forgotten about.",
      "Price comes down to three things: how many stumps, how big around they are, and where they sit on the property. A stump out in the open is straightforward; one tucked between a fence and a flower bed, or somewhere the machine has to be walked a long way, takes more work to reach.",
    ],
  },
  {
    slug: "debris-hauling",
    name: "Debris Hauling",
    description:
      "Fast removal of yard waste, brush, construction debris, and unwanted materials from your property.",
    image: "/services/debris-hauling.jpg",
    tagline: "We load it, haul it, and take care of the dump fees.",
    details: [
      "Brush piles, storm damage, old fencing, leftover construction debris, or the pile of stuff that's been behind the shed for years — we load it up and take it away. You don't need to move anything to the curb first.",
      "Give us a rough idea of the pile and what's in it, and we can usually ballpark it over the phone.",
    ],
  },
  {
    slug: "gravel-spreading",
    name: "Gravel Spreading",
    description:
      "Driveway and pathway gravel delivery and spreading, built to last and drain well.",
    image: "/services/gravel-spreading.jpg",
    tagline: "A driveway that lies flat and holds up.",
    details: [
      "Whether it's a top-off layer on an existing drive, a full resurface, or a brand-new base, we deliver the gravel and spread it properly — raked out flat and smooth, with no ruts or high spots left behind.",
      "Long rural driveways are routine for us. We'll advise on the right stone for what you're driving on it and how much depth the job actually needs.",
    ],
  },
  {
    slug: "landscaping-supply",
    name: "Landscaping Supply Delivery",
    description:
      "Delivery of mulch, gravel, stone, sand, topsoil, pine needles, manure, and more — dropped where you want it, or spread for you.",
    image: "/services/landscaping-supply.jpg",
    tagline: "Mulch, gravel, stone, pine needles, manure — delivered by the load.",
    details: [
      "Save yourself the trailer rental and the trips back and forth to the supply yard. We haul mulch, gravel, stone, sand, topsoil, pine needles, manure, and just about any other bulk landscaping material straight to your property.",
      "We'll drop it on a tarp exactly where you want it, or spread it for you while we're there. Not sure how much you need? Tell us the size of the area and we'll work it out.",
    ],
  },
];

/** Look up one service by its URL slug. */
export function getService(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
