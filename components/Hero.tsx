import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-ink text-paper border-b-4 border-primary">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 flex flex-col items-start gap-6">
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
