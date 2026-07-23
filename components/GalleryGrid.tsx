import WorkPhotos from "@/components/WorkPhotos";
import { FACEBOOK_URL } from "@/lib/work";
import { getGalleryPhotos } from "@/lib/gallery";

// Server component: reads the live, admin-managed gallery. The gallery page
// sets `dynamic = "force-dynamic"` so edits in /admin show up immediately.
export default async function GalleryGrid() {
  const photos = await getGalleryPhotos();

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
      {photos.length > 0 ? (
        <WorkPhotos photos={photos} variant="grid" />
      ) : (
        <p className="text-center text-ink-soft">
          New photos coming soon — follow us on{" "}
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-ink underline hover:text-primary-dark"
          >
            Facebook
          </a>{" "}
          in the meantime.
        </p>
      )}
    </section>
  );
}
