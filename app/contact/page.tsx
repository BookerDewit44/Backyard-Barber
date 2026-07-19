import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Backyard Barber Land Management",
  description: "Get a free quote from Backyard Barber Land Management in Statesville, NC. Call 704-902-9827 or send a message.",
};

export default function ContactPage() {
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
      <ContactForm />
    </section>
  );
}
