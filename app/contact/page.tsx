import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact & Free Quote",
  description: "Get a free quote from Backyard Barber Land Management in Statesville, NC. Call 704-902-9827 or send a message.",
  alternates: { canonical: "/contact" },
};

// Service pages link here as /contact?service=<name> to preselect the dropdown.
// Read it via the Server Component searchParams prop and pass it down, rather
// than useSearchParams (which would need its own Suspense boundary).
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const service = (await searchParams).service;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display font-bold uppercase text-4xl text-center mb-4">
        Get a Free Quote
      </h1>
      <p className="text-center text-ink-soft mb-10">
        Call{" "}
        <a href="tel:+17049029827" className="font-semibold text-ink">
          704-902-9827
        </a>{" "}
        or send us a message below.
      </p>
      <ContactForm
        initialService={Array.isArray(service) ? service[0] : service}
      />
    </section>
  );
}
