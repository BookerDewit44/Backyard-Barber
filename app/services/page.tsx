import type { Metadata } from "next";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services | Backyard Barber",
  description:
    "Lawn care, grading, debris hauling, and gravel spreading services from Backyard Barber in Statesville, NC.",
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
          <div
            key={service.slug}
            className="bg-white border-2 border-ink rounded-lg p-6 shadow-[4px_4px_0_0_var(--color-ink)]"
          >
            <h2 className="font-display font-bold uppercase text-xl mb-2">
              {service.name}
            </h2>
            <p className="text-ink-soft">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
