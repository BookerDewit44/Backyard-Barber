import Link from "next/link";
import { SERVICES } from "@/lib/services";

export default function ServicesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display font-bold uppercase text-3xl text-center mb-10">
        Our Services
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((service) => (
          <div
            key={service.slug}
            className="bg-white border-2 border-ink rounded-lg p-6 flex flex-col gap-3 shadow-[4px_4px_0_0_var(--color-ink)]"
          >
            <h3 className="font-display font-bold uppercase text-lg">
              {service.name}
            </h3>
            <p className="text-sm text-ink-soft flex-1">
              {service.description}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link
          href="/services"
          className="inline-block bg-ink hover:bg-ink-soft text-paper font-display font-bold uppercase tracking-wide px-6 py-3 rounded-md transition-colors"
        >
          View All Services
        </Link>
      </div>
    </section>
  );
}
