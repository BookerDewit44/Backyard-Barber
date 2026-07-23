"use client";

import { useEffect, useState } from "react";
import WorkPhotos, { type Photo } from "@/components/WorkPhotos";

// Fetches the live, admin-managed gallery on the client so the pages that use
// it (currently the homepage Recent Work strip) stay statically cached and
// fast, while still reflecting admin uploads without a redeploy.
export default function LiveWorkPhotos({
  variant,
  initial = [],
}: {
  variant: "grid" | "marquee";
  initial?: Photo[];
}) {
  const [photos, setPhotos] = useState<Photo[]>(initial);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/gallery")
      .then((r) => (r.ok ? r.json() : { photos: [] }))
      .then((data: { photos?: Photo[] }) => {
        if (!cancelled && Array.isArray(data.photos)) setPhotos(data.photos);
      })
      .catch(() => {
        /* keep whatever we have */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (photos.length === 0) return null;
  return <WorkPhotos photos={photos} variant={variant} />;
}
