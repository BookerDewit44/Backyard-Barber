import type { Metadata } from "next";
import ServiceAreaMap from "@/components/ServiceAreaMap";

export const metadata: Metadata = {
  title: "Service Area — Statesville, NC & 100 Miles Around",
  description:
    "Backyard Barber Land Management serves Statesville, NC and roughly a 100-mile radius around it.",
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
        a <span className="font-semibold text-ink">100-mile radius</span> &mdash;
        Iredell County and the surrounding region. Not sure if you&apos;re
        covered? Give us a call at{" "}
        <a href="tel:+17049029827" className="font-semibold text-ink">
          704-902-9827
        </a>
        .
      </p>

      <ServiceAreaMap />
    </section>
  );
}
