import Image from "next/image";
import { SERVICES } from "@/lib/services";
import { BASE_PATH } from "@/lib/basePath";

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
            className="bg-white border-2 border-ink rounded-lg overflow-hidden flex flex-col shadow-[4px_4px_0_0_var(--color-ink)]"
          >
            {service.image && (
              <div className="relative aspect-[4/3] w-full border-b-2 border-ink">
                <Image
                  src={`${BASE_PATH}${service.image}`}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
