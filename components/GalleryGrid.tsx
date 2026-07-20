import WorkPhotos from "@/components/WorkPhotos";
import { WORK_PHOTOS, FACEBOOK_URL } from "@/lib/work";

export default function GalleryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display font-bold uppercase text-3xl text-center mb-4">
        Recent Work
      </h2>
      <p className="text-center text-ink-soft mb-10 max-w-xl mx-auto">
        Real jobs, real properties. Click any photo to see it full size, or
        follow us on{" "}
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-ink underline hover:text-primary-dark"
        >
          Facebook
        </a>{" "}
        for more.
      </p>
      <WorkPhotos photos={WORK_PHOTOS} variant="grid" />
    </section>
  );
}
