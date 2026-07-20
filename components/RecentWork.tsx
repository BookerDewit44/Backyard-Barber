import WorkPhotos from "@/components/WorkPhotos";
import { WORK_PHOTOS, FACEBOOK_URL } from "@/lib/work";

export default function RecentWork() {
  return (
    <section className="reveal bg-ink text-paper border-y-4 border-primary py-14 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-bold uppercase text-3xl">
            Recent Work
          </h2>
          <p className="text-paper/70">
            Real jobs, real properties. Tap a photo to enlarge.
          </p>
        </div>
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noreferrer"
          className="self-start sm:self-auto bg-primary hover:bg-primary-dark text-ink font-display font-bold uppercase tracking-wide px-5 py-2.5 rounded-md border-2 border-paper transition-colors"
        >
          See more on Facebook
        </a>
      </div>

      <WorkPhotos photos={WORK_PHOTOS} variant="marquee" />
    </section>
  );
}
