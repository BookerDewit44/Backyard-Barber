import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { BASE_PATH } from "@/lib/basePath";

export const metadata: Metadata = {
  title: "Lawn Care, Grading & Stump Grinding Services",
  description:
    "Lawn care, grading, debris hauling, stump grinding, and gravel spreading services from Backyard Barber Land Management in Statesville, NC.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display font-bold uppercase text-4xl text-center mb-4">
        Our Services
      </h1>
      <p className="text-center text-ink-soft max-w-xl mx-auto mb-12">
        Not sure what you need? Call{" "}
        <a href="tel:+17049029827" className="font-semibold text-ink">
          704-902-9827
        </a>{" "}
        or use the chat in the corner and we&apos;ll point you in the right
        direction.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {SERVICES.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="reveal group bg-white border-2 border-ink rounded-lg overflow-hidden shadow-[4px_4px_0_0_var(--color-ink)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-primary)]"
          >
            {service.image && (
              <div className="relative aspect-video w-full border-b-2 border-ink overflow-hidden">
                <Image
                  src={`${BASE_PATH}${service.image}`}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="font-display font-bold uppercase text-xl mb-2">
                {service.name}
              </h2>
              <p className="text-ink-soft">{service.description}</p>
              <span className="mt-3 inline-block font-display uppercase text-xs tracking-widest text-primary-dark group-hover:text-ink transition-colors">
                Learn more &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
