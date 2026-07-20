// Customer reviews for components/Testimonials.tsx.
//
// !! PLACEHOLDER — these people are not real. !!
// While TESTIMONIALS_ARE_PLACEHOLDER is true the section renders nothing at
// all, so fake reviews never reach the live site. Replace the entries below
// with real Facebook/Google reviews (with permission), then flip the flag.
//
// When you flip it, also add `review` / `aggregateRating` to
// components/StructuredData.tsx — but NOT before, since marking up invented
// reviews violates Google's structured-data policy.

export const TESTIMONIALS_ARE_PLACEHOLDER = true;

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  /** 1-5 */
  stars: number;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Showed up when he said he would and the yard hasn't looked this good in years. Fair price, no runaround.",
    name: "Placeholder Name",
    location: "Statesville, NC",
    stars: 5,
  },
  {
    quote:
      "Had four stumps out front that had been there since we bought the place. Gone in an afternoon and you can't even tell where they were.",
    name: "Placeholder Name",
    location: "Troutman, NC",
    stars: 5,
  },
  {
    quote:
      "Regraded the driveway so it finally drains right. Hauled off the old brush pile while he was at it.",
    name: "Placeholder Name",
    location: "Mooresville, NC",
    stars: 5,
  },
];
