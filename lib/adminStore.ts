// Small JSON key/value store for admin auth state (the current password hash
// and any live password-reset token). Same backend strategy as the gallery
// store: Netlify Blobs in production, an on-disk fallback under `.admin-store/`
// for local `next dev` so the reset flow is testable without `netlify dev`.
import { promises as fs } from "fs";
import path from "path";

const STORE_NAME = "admin";

const useBlobs =
  process.env.NETLIFY === "true" || !!process.env.NETLIFY_BLOBS_CONTEXT;

async function blobsStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

const FS_DIR = path.join(process.cwd(), ".admin-store");
const fsPath = (key: string) => path.join(FS_DIR, `${key}.json`);

export async function getRecord<T>(key: string): Promise<T | null> {
  if (useBlobs) {
    const store = await blobsStore();
    return (await store.get(key, { type: "json" })) as T | null;
  }
  try {
    return JSON.parse(await fs.readFile(fsPath(key), "utf8")) as T;
  } catch {
    return null;
  }
}

export async function setRecord<T>(key: string, value: T): Promise<void> {
  if (useBlobs) {
    const store = await blobsStore();
    await store.setJSON(key, value);
  } else {
    await fs.mkdir(FS_DIR, { recursive: true });
    await fs.writeFile(fsPath(key), JSON.stringify(value, null, 2), "utf8");
  }
}

export async function delRecord(key: string): Promise<void> {
  if (useBlobs) {
    const store = await blobsStore();
    await store.delete(key);
  } else {
    try {
      await fs.unlink(fsPath(key));
    } catch {
      /* already gone */
    }
  }
}
