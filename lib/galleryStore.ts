// Runtime storage for the admin-managed gallery.
//
// The live gallery is no longer a static list in code — it's a manifest plus a
// set of uploaded image blobs that the admin edits at runtime through /admin.
// On Netlify (production) this is backed by **Netlify Blobs** (free, no extra
// service). Locally under `next dev` there's no Blobs context, so it falls back
// to a folder on disk (`.gallery-store/`, gitignored) so the feature is fully
// testable at localhost without `netlify dev`.
//
// Two things are stored:
//   - key "manifest"     -> JSON array of ManifestPhoto, in display order
//   - key "img:<id>"     -> raw image bytes for uploaded (kind "blob") photos
import { promises as fs } from "fs";
import path from "path";
import { WORK_PHOTOS } from "@/lib/work";

export type ManifestPhoto = {
  id: string;
  /** "static" = a file committed in public/ (the seeded photos); "blob" = an
   *  admin upload whose bytes live in this store. */
  kind: "static" | "blob";
  /** Public path for static photos, e.g. "/work/work-01.jpg". */
  src?: string;
  /** MIME type for blob photos, used when serving the bytes back. */
  contentType?: string;
  /** Alt text / caption. Shown to screen readers and used for SEO. */
  alt: string;
};

const STORE_NAME = "gallery";
const MANIFEST_KEY = "manifest";
const imgKey = (id: string) => `img:${id}`;

const DEFAULT_ALT = "Recent work by Backyard Barber Land Management";

// Use Netlify Blobs whenever a Netlify runtime context is present (production
// deploys and `netlify dev`); otherwise use the on-disk dev fallback.
const useBlobs =
  process.env.NETLIFY === "true" || !!process.env.NETLIFY_BLOBS_CONTEXT;

// ---- Netlify Blobs backend ------------------------------------------------

async function blobsStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

// ---- Filesystem backend (dev only) ----------------------------------------

const FS_DIR = path.join(process.cwd(), ".gallery-store");
const FS_IMG_DIR = path.join(FS_DIR, "img");

async function fsEnsureDirs() {
  await fs.mkdir(FS_IMG_DIR, { recursive: true });
}

// ---- Manifest -------------------------------------------------------------

/** The seed manifest, used the first time the store is read (empty) so the
 *  gallery starts from the photos already committed in public/work/. */
function seedManifest(): ManifestPhoto[] {
  return WORK_PHOTOS.map((src, i) => ({
    id: `seed-${String(i + 1).padStart(2, "0")}`,
    kind: "static" as const,
    src,
    alt: DEFAULT_ALT,
  }));
}

export async function readManifest(): Promise<ManifestPhoto[]> {
  let raw: ManifestPhoto[] | null = null;

  if (useBlobs) {
    const store = await blobsStore();
    raw = (await store.get(MANIFEST_KEY, { type: "json" })) as
      | ManifestPhoto[]
      | null;
  } else {
    try {
      const text = await fs.readFile(path.join(FS_DIR, "manifest.json"), "utf8");
      raw = JSON.parse(text) as ManifestPhoto[];
    } catch {
      raw = null;
    }
  }

  if (!raw) {
    const seeded = seedManifest();
    await writeManifest(seeded);
    return seeded;
  }
  return raw;
}

export async function writeManifest(photos: ManifestPhoto[]): Promise<void> {
  if (useBlobs) {
    const store = await blobsStore();
    await store.setJSON(MANIFEST_KEY, photos);
  } else {
    await fsEnsureDirs();
    await fs.writeFile(
      path.join(FS_DIR, "manifest.json"),
      JSON.stringify(photos, null, 2),
      "utf8",
    );
  }
}

// ---- Image bytes ----------------------------------------------------------

export async function putImage(
  id: string,
  bytes: Uint8Array,
): Promise<void> {
  if (useBlobs) {
    const store = await blobsStore();
    // Netlify Blobs accepts ArrayBuffer/Blob/string, not a Uint8Array view —
    // hand it a standalone ArrayBuffer covering exactly these bytes.
    const ab = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;
    await store.set(imgKey(id), ab);
  } else {
    await fsEnsureDirs();
    await fs.writeFile(path.join(FS_IMG_DIR, id), bytes);
  }
}

export async function getImage(id: string): Promise<Uint8Array | null> {
  if (useBlobs) {
    const store = await blobsStore();
    const buf = (await store.get(imgKey(id), {
      type: "arrayBuffer",
    })) as ArrayBuffer | null;
    return buf ? new Uint8Array(buf) : null;
  }
  try {
    const buf = await fs.readFile(path.join(FS_IMG_DIR, id));
    return new Uint8Array(buf);
  } catch {
    return null;
  }
}

export async function deleteImage(id: string): Promise<void> {
  if (useBlobs) {
    const store = await blobsStore();
    await store.delete(imgKey(id));
  } else {
    try {
      await fs.unlink(path.join(FS_IMG_DIR, id));
    } catch {
      /* already gone */
    }
  }
}
