import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Area | Backyard Barber",
  description: "Backyard Barber proudly serves Statesville, NC and the surrounding area.",
};

// Placeholder list until the owner confirms the exact service radius/towns (plan open question #1).
const TOWNS = ["Statesville", "Mooresville", "Troutman", "Iredell County"];

export default function ServiceAreaPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-display font-bold uppercase text-4xl mb-6">
        Where We Work
      </h1>
      <p className="text-ink-soft text-lg mb-8">
        Backyard Barber is based in Statesville, NC and proudly serves the
        surrounding area, including:
      </p>
      <ul className="flex flex-wrap justify-center gap-3 mb-10">
        {TOWNS.map((town) => (
          <li
            key={town}
            className="bg-primary border-2 border-ink rounded-full px-4 py-2 font-display font-bold uppercase text-sm"
          >
            {town}
          </li>
        ))}
      </ul>
      <p className="text-ink-soft">
        Not sure if we cover your area? Give us a call at{" "}
        <a href="tel:+17049029827" className="font-semibold text-ink">
          704-902-9827
        </a>
        .
      </p>
    </section>
  );
}
