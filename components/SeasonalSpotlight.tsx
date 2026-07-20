import Image from "next/image";
import Link from "next/link";
import { getSeason } from "@/lib/seasonal";
import { SERVICES } from "@/lib/services";
import { BASE_PATH } from "@/lib/basePath";

/** Calendar-driven "what we're on right now" banner. Server-rendered; the
 *  homepage sets `revalidate` so this doesn't freeze at build time. */
export default function SeasonalSpotlight() {
  const season = getSeason();
  const service = SERVICES.find((s) => s.slug === season.serviceSlug);

  return (
    <section className="bg-ink text-paper border-b-4 border-primary">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-2 md:items-center">
        <div className="flex flex-col items-start gap-4">
          <span className="font-display uppercase tracking-widest text-primary text-sm">
            {season.eyebrow}
          </span>
          <h2 className="font-display font-bold uppercase text-3xl sm:text-4xl leading-tight">
            {season.headline}
          </h2>
          <p className="text-paper/80">{season.blurb}</p>
          <Link
            href={`/contact?service=${encodeURIComponent(service?.name ?? "")}`}
            className="bg-primary hover:bg-primary-dark text-ink font-display font-bold uppercase tracking-wide px-6 py-3 rounded-md border-2 border-paper transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>

        {service?.image && (
          <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border-2 border-primary">
            <Image
              src={`${BASE_PATH}${service.image}`}
              alt={service.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
