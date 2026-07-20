"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "@/components/Lightbox";
import { BASE_PATH } from "@/lib/basePath";

const ALT = "Recent work by Backyard Barber Land Management";

type Props = {
  photos: string[];
  /** "grid" = gallery page, "marquee" = homepage auto-scrolling strip. */
  variant: "grid" | "marquee";
};

/** The work photos, clickable to open the full-screen viewer. Owns the
 *  lightbox state for both layouts so there's only one implementation. */
export default function WorkPhotos({ photos, variant }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const tile = (src: string, i: number, sizes: string, className: string) => (
    <button
      key={i}
      type="button"
      onClick={() => setOpenIndex(i)}
      aria-label={`Open photo ${i + 1} of ${photos.length}`}
      className={`group relative block cursor-zoom-in overflow-hidden ${className}`}
    >
      <Image
        src={`${BASE_PATH}${src}`}
        alt={ALT}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </button>
  );

  return (
    <>
      {variant === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((src, i) =>
            tile(
              src,
              i,
              "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
              "aspect-[4/3] w-full rounded-lg border-2 border-ink",
            ),
          )}
        </div>
      ) : (
        // Two identical groups so translateX(-50%) loops seamlessly; pauses on
        // hover. Only the first group is interactive — the duplicate is
        // aria-hidden and must not be a tab stop.
        <div className="group relative w-full overflow-hidden">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[0, 1].map((dup) => (
              <div
                key={dup}
                className="flex gap-4 pr-4 shrink-0"
                aria-hidden={dup === 1}
              >
                {photos.map((src, i) =>
                  dup === 0 ? (
                    tile(
                      src,
                      i,
                      "288px",
                      "h-52 w-72 shrink-0 rounded-lg border-2 border-paper",
                    )
                  ) : (
                    <div
                      key={i}
                      className="relative h-52 w-72 shrink-0 rounded-lg overflow-hidden border-2 border-paper"
                    >
                      <Image
                        src={`${BASE_PATH}${src}`}
                        alt=""
                        fill
                        sizes="288px"
                        className="object-cover"
                      />
                    </div>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Lightbox
        photos={photos}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
