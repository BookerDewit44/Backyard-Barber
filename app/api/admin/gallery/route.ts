// Admin-only gallery management: list, upload, reorder.
// Per-photo delete and caption edits live in ./[id]/route.ts.
import crypto from "crypto";
import { isAdmin } from "@/lib/adminAuth";
import {
  readManifest,
  writeManifest,
  putImage,
  type ManifestPhoto,
} from "@/lib/galleryStore";

export const dynamic = "force-dynamic";

const ALLOWED: Record<string, true> = {
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
  "image/gif": true,
};
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

async function guard(): Promise<Response | null> {
  if (!(await isAdmin())) {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }
  return null;
}

// List every photo with its editable fields, for the admin panel.
export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return Response.json({ photos: await readManifest() });
}

// Upload a new photo (multipart form: `file`, optional `alt`).
export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Expected a file upload." }, { status: 400 });
  }

  const file = form.get("file");
  const alt = (form.get("alt") as string | null)?.trim();

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED[file.type]) {
    return Response.json(
      { error: "Unsupported image type. Use JPG, PNG, WebP, or GIF." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: "Image is larger than 10 MB." },
      { status: 413 },
    );
  }

  const id = crypto.randomUUID();
  const bytes = new Uint8Array(await file.arrayBuffer());
  await putImage(id, bytes);

  const entry: ManifestPhoto = {
    id,
    kind: "blob",
    contentType: file.type,
    alt: alt || "Recent work by Backyard Barber Land Management",
  };

  // New photos go to the front so the newest work shows first.
  const manifest = await readManifest();
  await writeManifest([entry, ...manifest]);

  return Response.json({ ok: true, photo: entry });
}

// Reorder the whole gallery (body: { order: string[] } of photo ids).
export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  let order: string[] = [];
  try {
    const body = (await req.json()) as { order?: string[] };
    order = body.order ?? [];
  } catch {
    return Response.json({ error: "Invalid body." }, { status: 400 });
  }

  const manifest = await readManifest();
  const byId = new Map(manifest.map((p) => [p.id, p]));
  // Keep only ids that exist, then append any that the client omitted so a
  // stale order can never drop photos.
  const reordered: ManifestPhoto[] = [];
  for (const id of order) {
    const p = byId.get(id);
    if (p) {
      reordered.push(p);
      byId.delete(id);
    }
  }
  for (const p of manifest) {
    if (byId.has(p.id)) reordered.push(p);
  }

  await writeManifest(reordered);
  return Response.json({ ok: true });
}
