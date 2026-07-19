import Image from "next/image";
import { WORK_PHOTOS, FACEBOOK_URL } from "@/lib/work";
import { BASE_PATH } from "@/lib/basePath";

export default function GalleryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display font-bold uppercase text-3xl text-center mb-4">
        Recent Work
      </h2>
      <p className="text-center text-ink-soft mb-10 max-w-xl mx-auto">
        Real jobs around Statesville, NC. Follow us on{" "}
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WORK_PHOTOS.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-ink"
          >
            <Image
              src={`${BASE_PATH}${src}`}
              alt="Recent work by Backyard Barber Land Management"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
