import type { Metadata } from "next";
import Image from "next/image";
import { BASE_PATH } from "@/lib/basePath";

export const metadata: Metadata = {
  title: "About | Backyard Barber Land Management",
  description:
    "Backyard Barber Land Management has served Statesville, NC since 2010 with reliable lawn care, grading, hauling, and stump grinding.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-col items-center text-center gap-6 mb-12">
        <Image
          src={`${BASE_PATH}/logo.png`}
          alt="Backyard Barber Land Management logo"
          width={200}
          height={200}
          className="rounded-lg bg-white object-contain"
        />
        <h1 className="font-display font-bold uppercase text-4xl">
          Est. 2010, Statesville NC
        </h1>
      </div>

      <div className="prose max-w-none text-ink-soft space-y-4 text-lg">
        <p>
          Backyard Barber Land Management has been trimming, grading, and
          hauling for Statesville-area properties since 2010. What started as a
          lawn care outfit has grown into a full-service land management crew
          &mdash; handling everything from routine mowing to grading job sites,
          grinding stumps, and spreading gravel for driveways.
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
