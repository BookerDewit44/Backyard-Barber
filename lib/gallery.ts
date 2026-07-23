// Read side of the gallery, shared by the public pages and the /api/gallery
// endpoint. Turns the stored manifest into the plain {src, alt} shape the
// display components (WorkPhotos, Lightbox) render.
import { readManifest, type ManifestPhoto } from "@/lib/galleryStore";

export type DisplayPhoto = { src: string; alt: string };

/** Map a manifest entry to its public URL: static photos keep their public/
 *  path; uploaded photos are served by the /api/gallery/[id] byte route. */
export function toDisplay(p: ManifestPhoto): DisplayPhoto {
  return {
    src: p.kind === "blob" ? `/api/gallery/${p.id}` : (p.src ?? ""),
    alt: p.alt,
  };
}

export async function getGalleryPhotos(): Promise<DisplayPhoto[]> {
  const manifest = await readManifest();
  return manifest.map(toDisplay);
}
