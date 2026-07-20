// Date-driven "what we're busy with right now" banner (components/SeasonalSpotlight.tsx).
// Deliberately zero-maintenance: nobody has to remember to swap the banner,
// it follows the calendar. `serviceSlug` must match a slug in lib/services.ts —
// the banner pulls that service's photo and links a pre-filled quote request.

export type Season = {
  months: number[]; // 1-12
  eyebrow: string;
  headline: string;
  blurb: string;
  serviceSlug: string;
};

export const SEASONS: Season[] = [
  {
    months: [3, 4, 5],
    eyebrow: "Spring Cleanup Season",
    headline: "Get the Yard Back Under Control",
    blurb:
      "Winter leaves a mess. We clear the brush and debris, cut back the overgrowth, and get your lawn on a mowing schedule before it gets away from you.",
    serviceSlug: "lawn-care",
  },
  {
    months: [6, 7, 8],
    eyebrow: "Mowing Season",
    headline: "Keep It Sharp All Summer",
    blurb:
      "Weekly and bi-weekly mowing, edging, and trimming. One less thing to do in the heat.",
    serviceSlug: "lawn-care",
  },
  {
    months: [9, 10, 11],
    eyebrow: "Fall Cleanup Season",
    headline: "Leaves and Debris, Hauled Off",
    blurb:
      "Leaf cleanup, brush piles, storm debris, and everything else the fall drops on your property — we load it up and take it away.",
    serviceSlug: "debris-hauling",
  },
  {
    months: [12, 1, 2],
    eyebrow: "Winter Project Season",
    headline: "The Best Time for the Big Jobs",
    blurb:
      "With nothing growing, winter is a good window for grading, driveway work, and clearing out what you've been putting off. Book now and beat the spring rush.",
    serviceSlug: "grading",
  },
];

/** The season covering `date`'s month. Falls back to the first entry, which
 *  keeps the banner rendering even if SEASONS is ever edited into a gap. */
export function getSeason(date: Date = new Date()): Season {
  const month = date.getMonth() + 1;
  return SEASONS.find((season) => season.months.includes(month)) ?? SEASONS[0];
}
