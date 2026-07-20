import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, getService } from "@/lib/services";
import { BASE_PATH } from "@/lib/basePath";
import { CITY, PHONE_DISPLAY, PHONE_HREF, STATE } from "@/lib/site";

// One static page per service — no runtime lookups needed.
export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: `${service.name} in ${CITY}, ${STATE}`,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const quoteHref = `/contact?service=${encodeURIComponent(service.name)}`;
  const others = SERVICES.filter((other) => other.slug !== service.slug);

  return (
    <>
      {/* Photo header */}
      <section className="relative bg-ink text-paper border-b-4 border-primary">
        {service.image && (
          <Image
            src={`${BASE_PATH}${service.image}`}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
        )}
        {/* Gradient keeps the headline readable over any photo. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:py-24 flex flex-col items-start gap-4">
          <Link
            href="/services"
            className="font-display uppercase tracking-widest text-primary text-sm hover:text-paper transition-colors"
          >
            &larr; All Services
          </Link>
          <h1 className="font-display font-bold uppercase text-4xl sm:text-5xl leading-tight">
            {service.name}
          </h1>
          <p className="text-paper/80 text-lg max-w-2xl">{service.tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 flex flex-col gap-4">
        {service.details.map((paragraph, i) => (
          <p key={i} className="text-ink-soft text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
      </section>

      {/* Call to action */}
      <section className="bg-ink text-paper border-y-4 border-primary">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center flex flex-col items-center gap-5">
          <h2 className="font-display font-bold uppercase text-3xl">
            Need {service.name}?
          </h2>
          <p className="text-paper/80 max-w-xl">
            Free estimates, always. Tell us about the property and we&apos;ll
            get you a price &mdash; or call and talk it through.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={quoteHref}
              className="bg-primary hover:bg-primary-dark text-ink font-display font-bold uppercase tracking-wide px-6 py-3 rounded-md border-2 border-paper transition-colors"
            >
              Get a Free Quote
            </Link>
            <a
              href={PHONE_HREF}
              className="bg-transparent hover:bg-paper hover:text-ink text-paper font-display font-bold uppercase tracking-wide px-6 py-3 rounded-md border-2 border-paper transition-colors"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display font-bold uppercase text-2xl text-center mb-8">
          We Also Do
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/services/${other.slug}`}
              className="group bg-white border-2 border-ink rounded-lg overflow-hidden shadow-[4px_4px_0_0_var(--color-ink)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-primary)]"
            >
              {other.image && (
                <div className="relative aspect-[4/3] w-full border-b-2 border-ink overflow-hidden">
                  <Image
                    src={`${BASE_PATH}${other.image}`}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <span className="block p-4 font-display font-bold uppercase text-sm">
                {other.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
