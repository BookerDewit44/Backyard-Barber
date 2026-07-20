import type { Metadata } from "next";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import { SERVICE_AREA } from "@/lib/serviceArea";
import { SERVICE_RADIUS_MILES } from "@/lib/site";

export const metadata: Metadata = {
  title: `Service Area — Statesville, NC & ${SERVICE_RADIUS_MILES} Miles Around`,
  description: `Lawn care, grading, hauling, stump grinding, and landscaping supply delivery from Statesville, NC out to Mooresville, Hickory, Salisbury, Taylorsville, Mocksville, and the rest of a ${SERVICE_RADIUS_MILES}-mile radius.`,
  alternates: { canonical: "/service-area" },
};

export default function ServiceAreaPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display font-bold uppercase text-4xl text-center mb-4">
        Where We Work
      </h1>
      <p className="text-center text-ink-soft max-w-2xl mx-auto mb-10">
        Based in Statesville, NC, Backyard Barber Land Management serves roughly
        a{" "}
        <span className="font-semibold text-ink">
          {SERVICE_RADIUS_MILES}-mile radius
        </span>{" "}
        &mdash; Iredell County and the surrounding region. Not sure if
        you&apos;re covered? Give us a call at{" "}
        <a href="tel:+17049029827" className="font-semibold text-ink">
          704-902-9827
        </a>
        .
      </p>

      <ServiceAreaMap />

      {/* The town names are the point here — see lib/serviceArea.ts. Someone
          searching for their own town needs to find it spelled out. */}
      <h2 className="font-display font-bold uppercase text-2xl text-center mt-16 mb-2">
        Towns We Cover
      </h2>
      <p className="text-center text-ink-soft max-w-2xl mx-auto mb-10">
        Not an exhaustive list &mdash; if your town isn&apos;t here but looks
        close on the map, call and ask.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_AREA.map(({ county, towns }) => (
          <div key={county}>
            <h3 className="font-display font-semibold uppercase text-sm tracking-wide text-ink mb-2">
              {county}
            </h3>
            <ul className="text-ink-soft space-y-1">
              {towns.map((town) => (
                <li key={town}>{town}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
