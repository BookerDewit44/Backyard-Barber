// Public: the live gallery list. Read by the homepage marquee (client-side)
// and available to anything else that wants the current photos.
import { getGalleryPhotos } from "@/lib/gallery";

// Always reflect the current manifest, never a cached snapshot.
export const dynamic = "force-dynamic";

export async function GET() {
  const photos = await getGalleryPhotos();
  return Response.json({ photos });
}
