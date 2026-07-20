import {
  TESTIMONIALS,
  TESTIMONIALS_ARE_PLACEHOLDER,
} from "@/lib/testimonials";

export default function Testimonials() {
  // Placeholder reviews are invented people — never show them on the live
  // site. Flip TESTIMONIALS_ARE_PLACEHOLDER once real quotes are in.
  if (TESTIMONIALS_ARE_PLACEHOLDER) return null;

  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display font-bold uppercase text-3xl text-center mb-10">
        What Customers Say
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial, i) => (
          <figure
            key={i}
            className="bg-white border-2 border-ink rounded-lg shadow-[4px_4px_0_0_var(--color-ink)] p-6 flex flex-col gap-4"
          >
            <span
              aria-hidden="true"
              className="font-display font-bold text-5xl leading-none text-primary"
            >
              &ldquo;
            </span>
            <blockquote className="text-ink-soft flex-1">
              {testimonial.quote}
            </blockquote>
            <div
              className="text-primary-dark tracking-widest"
              aria-label={`${testimonial.stars} out of 5 stars`}
            >
              {"★".repeat(testimonial.stars)}
            </div>
            <figcaption className="font-display uppercase text-sm tracking-wide">
              {testimonial.name}
              <span className="block text-xs text-ink-soft normal-case tracking-normal">
                {testimonial.location}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
