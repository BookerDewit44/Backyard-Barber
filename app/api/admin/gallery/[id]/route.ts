// Admin-only: delete a photo or edit its caption/alt text.
import { isAdmin } from "@/lib/adminAuth";
import { readManifest, writeManifest, deleteImage } from "@/lib/galleryStore";

export const dynamic = "force-dynamic";

async function guard(): Promise<Response | null> {
  if (!(await isAdmin())) {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }
  return null;
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/admin/gallery/[id]">,
) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await ctx.params;
  const manifest = await readManifest();
  const entry = manifest.find((p) => p.id === id);
  if (!entry) {
    return Response.json({ error: "Photo not found." }, { status: 404 });
  }

  await writeManifest(manifest.filter((p) => p.id !== id));
  // Only uploads have stored bytes; static seeds just leave the manifest.
  if (entry.kind === "blob") await deleteImage(id);

  return Response.json({ ok: true });
}

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/admin/gallery/[id]">,
) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await ctx.params;
  let alt = "";
  try {
    const body = (await req.json()) as { alt?: string };
    alt = (body.alt ?? "").trim();
  } catch {
    return Response.json({ error: "Invalid body." }, { status: 400 });
  }
  if (!alt) {
    return Response.json({ error: "Caption cannot be empty." }, { status: 400 });
  }

  const manifest = await readManifest();
  const entry = manifest.find((p) => p.id === id);
  if (!entry) {
    return Response.json({ error: "Photo not found." }, { status: 404 });
  }
  entry.alt = alt;
  await writeManifest(manifest);

  return Response.json({ ok: true, photo: entry });
}
