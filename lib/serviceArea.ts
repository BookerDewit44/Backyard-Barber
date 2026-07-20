// Towns inside the SERVICE_RADIUS_MILES circle around Statesville, grouped by
// county. Two jobs:
//
//  1. Local SEO. The GeoCircle in the structured data tells Google the shape of
//     the service area, but it does not tell it the *names* people actually
//     type. Someone searching "lawn care Mooresville" or "stump grinding
//     Hickory" needs those strings to exist somewhere crawlable. This is the
//     only place on the site that carries them.
//  2. It answers the real customer question — "do you come out this far?"
//
// Keep this honest: every town here must genuinely be inside the radius and
// somewhere the crew will actually travel. Padding it with far-off cities to
// chase keywords is what gets local listings demoted, and it earns calls that
// have to be turned down. Distances below are road miles from Statesville.
export type ServiceCounty = {
  county: string;
  towns: string[];
};

export const SERVICE_AREA: ServiceCounty[] = [
  {
    county: "Iredell County",
    towns: [
      "Statesville",
      "Mooresville",
      "Troutman",
      "Harmony",
      "Union Grove",
      "Olin",
      "Love Valley",
    ],
  },
  {
    county: "Alexander County",
    towns: ["Taylorsville", "Hiddenite", "Stony Point"],
  },
  {
    county: "Catawba County",
    towns: ["Hickory", "Conover", "Newton", "Claremont", "Catawba", "Maiden"],
  },
  {
    county: "Davie County",
    towns: ["Mocksville", "Cooleemee", "Advance", "Bermuda Run"],
  },
  {
    county: "Rowan County",
    towns: ["Salisbury", "China Grove", "Landis", "Cleveland", "Woodleaf"],
  },
  {
    county: "Mecklenburg County",
    towns: ["Huntersville", "Cornelius", "Davidson"],
  },
  {
    county: "Cabarrus County",
    towns: ["Kannapolis", "Concord"],
  },
  {
    county: "Lincoln County",
    towns: ["Lincolnton", "Denver"],
  },
  {
    county: "Wilkes County",
    towns: ["Wilkesboro", "North Wilkesboro"],
  },
  {
    county: "Yadkin County",
    towns: ["Yadkinville", "Jonesville", "Elkin"],
  },
];

// Flat list for the areaServed schema and anywhere else that just needs names.
export const SERVICE_AREA_TOWNS: string[] = SERVICE_AREA.flatMap(
  (entry) => entry.towns,
);
