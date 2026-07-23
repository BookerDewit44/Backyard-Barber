// Public: serve the bytes for one uploaded (kind "blob") gallery photo.
// Static seeded photos are served straight from public/ and never hit this.
import { readManifest } from "@/lib/galleryStore";
import { getImage } from "@/lib/galleryStore";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/gallery/[id]">,
) {
  const { id } = await ctx.params;

  const manifest = await readManifest();
  const entry = manifest.find((p) => p.id === id && p.kind === "blob");
  if (!entry) {
    return new Response("Not found", { status: 404 });
  }

  const bytes = await getImage(id);
  if (!bytes) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": entry.contentType ?? "application/octet-stream",
      // Photos are immutable per id (a new upload gets a new id), so allow the
      // browser/CDN to cache aggressively.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
