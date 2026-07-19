import Image from "next/image";
import { WORK_PHOTOS, FACEBOOK_URL } from "@/lib/work";
import { BASE_PATH } from "@/lib/basePath";

export default function RecentWork() {
  return (
    <section className="bg-ink text-paper border-y-4 border-primary py-14 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-bold uppercase text-3xl">
            Recent Work
          </h2>
          <p className="text-paper/70">Real jobs around Statesville, NC.</p>
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

      {/* Auto-scrolling strip. Two identical groups so translateX(-50%) loops
          seamlessly; pauses on hover. */}
      <div className="group relative w-full overflow-hidden">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex gap-4 pr-4 shrink-0"
              aria-hidden={dup === 1}
            >
              {WORK_PHOTOS.map((src, i) => (
                <div
                  key={i}
                  className="relative h-52 w-72 shrink-0 rounded-lg overflow-hidden border-2 border-paper"
                >
                  <Image
                    src={`${BASE_PATH}${src}`}
                    alt="Recent work by Backyard Barber Land Management"
                    fill
                    sizes="288px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
