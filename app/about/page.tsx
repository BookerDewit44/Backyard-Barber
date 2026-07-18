import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Backyard Barber",
  description:
    "Backyard Barber has served Statesville, NC since 2010 with reliable lawn care, grading, and hauling.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-col items-center text-center gap-6 mb-12">
        <Image
          src="/logo.jpg"
          alt="Backyard Barber logo"
          width={140}
          height={140}
          className="rounded-full border-4 border-ink object-cover"
        />
        <h1 className="font-display font-bold uppercase text-4xl">
          Est. 2010, Statesville NC
        </h1>
      </div>

      <div className="prose max-w-none text-ink-soft space-y-4 text-lg">
        <p>
          Backyard Barber has been trimming, grading, and hauling for
          Statesville-area properties since 2010. What started as a lawn care
          outfit has grown into a full-service outdoor crew &mdash; handling
          everything from routine mowing to grading job sites and spreading
          gravel for driveways.
        </p>
        <p>
          We show up on time, do the job right, and treat every yard like
          it&apos;s our own. Whether it&apos;s a weekly mow or a one-time
          hauling job, you&apos;ll get the same straightforward service.
        </p>
      </div>
    </section>
  );
}
