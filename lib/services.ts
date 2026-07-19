export type Service = {
  slug: string;
  name: string;
  description: string;
  image?: string;
};

export const SERVICES: Service[] = [
  {
    slug: "lawn-care",
    name: "Lawn Care & Maintenance",
    description:
      "Mowing, edging, trimming, and seasonal cleanup to keep your lawn looking its best all year.",
    image: "/services/lawn-care.jpg",
  },
  {
    slug: "grading",
    name: "Grading & Land Leveling",
    description:
      "Site grading and land leveling for drainage, new lawns, driveways, and building pads.",
    image: "/services/grading.jpg",
  },
  {
    slug: "stump-grinding",
    name: "Stump Grinding",
    description:
      "Grinding tree stumps down below grade so you can reclaim your yard, replant, or build without the eyesore.",
    image: "/services/stump-grinding.jpg",
  },
  {
    slug: "debris-hauling",
    name: "Debris Hauling",
    description:
      "Fast removal of yard waste, brush, construction debris, and unwanted materials from your property.",
    image: "/services/debris-hauling.jpg",
  },
  {
    slug: "gravel-spreading",
    name: "Gravel Spreading",
    description:
      "Driveway and pathway gravel delivery and spreading, built to last and drain well.",
    image: "/services/gravel-spreading.jpg",
  },
];
