"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { BASE_PATH } from "@/lib/basePath";

type Props = {
  photos: string[];
  /** null = closed */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/** Full-screen photo viewer with keyboard, swipe, and click navigation.
 *  Controlled — the parent owns `index`. Used by WorkPhotoLightbox. */
export default function Lightbox({
  photos,
  index,
  onClose,
  onIndexChange,
}: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const open = index !== null;

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange((index + delta + photos.length) % photos.length);
    },
    [index, photos.length, onIndexChange],
  );

  // Keyboard navigation while open.
  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, step]);

  // Lock background scrolling and move focus into the dialog.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (index === null) return null;

  // z-index sits above the sticky header (z-40) and the chat launcher (z-50,
  // which renders after <main> and would otherwise paint on top).
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-[60] bg-ink/98 flex flex-col"
      onClick={onClose}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) >= 50) step(delta < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      <div className="flex items-center justify-between p-4 text-paper shrink-0">
        <span className="font-display uppercase tracking-widest text-sm text-primary">
          {index + 1} / {photos.length}
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="w-10 h-10 rounded-md border-2 border-paper/60 hover:border-primary hover:text-primary transition-colors text-2xl leading-none"
        >
          &times;
        </button>
      </div>

      {/* Stop propagation so clicking the photo or arrows doesn't close. */}
      <div
        className="relative flex-1 flex items-center justify-center px-2 pb-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous photo"
          className="absolute left-2 sm:left-6 z-10 w-11 h-11 rounded-full bg-ink/70 border-2 border-paper/60 text-paper hover:border-primary hover:text-primary transition-colors"
        >
          &#8249;
        </button>

        <div className="relative w-full h-full max-w-5xl">
          <Image
            src={`${BASE_PATH}${photos[index]}`}
            alt={`Recent work by Backyard Barber Land Management, photo ${index + 1} of ${photos.length}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next photo"
          className="absolute right-2 sm:right-6 z-10 w-11 h-11 rounded-full bg-ink/70 border-2 border-paper/60 text-paper hover:border-primary hover:text-primary transition-colors"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
