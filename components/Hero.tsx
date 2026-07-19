import Image from "next/image";
import Link from "next/link";
import { BASE_PATH } from "@/lib/basePath";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper border-b-4 border-primary">
      {/* Translucent logo watermark in the background */}
      <Image
        src={`${BASE_PATH}/logo.png`}
        alt=""
        aria-hidden="true"
        width={800}
        height={800}
        priority
        className="pointer-events-none select-none absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[34rem] max-w-[75%] h-auto opacity-10"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:py-28 flex flex-col items-start gap-6">
        <span className="font-display uppercase tracking-widest text-primary text-sm">
          Statesville, NC &middot; Est. 2010
        </span>
        <h1 className="font-display font-bold uppercase text-4xl sm:text-6xl leading-tight max-w-3xl">
          Lawn Care, Grading &amp; Land Management Done Right
        </h1>
        <p className="max-w-xl text-paper/80 text-lg">
          From weekly mowing to grading, debris hauling, stump grinding, and
          gravel spreading &mdash; Backyard Barber Land Management keeps your
          property looking sharp.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href="tel:+17049029827"
            className="bg-primary hover:bg-primary-dark text-ink font-display font-bold uppercase tracking-wide px-6 py-3 rounded-md border-2 border-paper transition-colors"
          >
            Call 704-902-9827
          </a>
          <Link
            href="/contact"
            className="bg-transparent hover:bg-paper hover:text-ink text-paper font-display font-bold uppercase tracking-wide px-6 py-3 rounded-md border-2 border-paper transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
