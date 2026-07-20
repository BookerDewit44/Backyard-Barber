import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { BASE_PATH } from "@/lib/basePath";

export default function ServicesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="reveal font-display font-bold uppercase text-3xl text-center mb-10">
        Our Services
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Scroll-driven animations ignore animation-delay, so the reveal
            stagger comes from each card finishing later along the timeline. */}
        {SERVICES.map((service, i) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            style={{ animationRange: `entry 0% cover ${24 + i * 7}%` }}
            className="reveal group bg-white border-2 border-ink rounded-lg overflow-hidden flex flex-col shadow-[4px_4px_0_0_var(--color-ink)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-primary)]"
          >
            {service.image && (
              <div className="relative aspect-[4/3] w-full border-b-2 border-ink overflow-hidden">
                <Image
                  src={`${BASE_PATH}${service.image}`}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-6 flex flex-col gap-3 flex-1">
              <h3 className="font-display font-bold uppercase text-lg">
                {service.name}
              </h3>
              <p className="text-sm text-ink-soft flex-1">
                {service.description}
              </p>
              <span className="font-display uppercase text-xs tracking-widest text-primary-dark group-hover:text-ink transition-colors">
                Learn more &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
