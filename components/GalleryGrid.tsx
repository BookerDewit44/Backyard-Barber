const PLACEHOLDER_COUNT = 6;

export default function GalleryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display font-bold uppercase text-3xl text-center mb-4">
        Recent Work
      </h2>
      <p className="text-center text-ink-soft mb-10 max-w-xl mx-auto">
        Before &amp; after photos from real jobs around Statesville &mdash;
        coming soon.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
          <div
            key={i}
            className="aspect-4/3 rounded-lg border-2 border-dashed border-ink/30 bg-paper-dim flex items-center justify-center text-ink-soft/60 font-display uppercase text-sm"
          >
            Photo Coming Soon
          </div>
        ))}
      </div>
    </section>
  );
}
