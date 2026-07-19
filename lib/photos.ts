// Client-side photo handling for Netlify Forms uploads.
//
// Netlify Forms has two hard limits that break naive phone-photo uploads:
//   1. Max request size is 8 MB — a single modern phone photo can exceed that.
//   2. Only ONE file per form field — a `multiple` field silently drops extras.
//
// So before submitting we resize + JPEG-compress each image in a canvas (which
// also converts iPhone HEIC to a universally viewable JPEG) and append each one
// as its own field: photo1, photo2, ... (declared in public/__forms.html).

const MAX_DIM = 1600; // px on the long edge
const QUALITY = 0.72;
const MAX_PHOTOS = 5;

async function compressImage(file: File): Promise<Blob> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });

  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("decode failed"));
    image.src = dataUrl;
  });

  let width = img.naturalWidth;
  let height = img.naturalHeight;
  const scale = Math.min(1, MAX_DIM / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas context");
  ctx.drawImage(img, 0, 0, width, height);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );
  if (!blob) throw new Error("encode failed");
  return blob;
}

/**
 * Compress each selected image and append it to `formData` as its own field
 * (photo1..photoN). Removes the raw multi-file `photos` field. Falls back to
 * the original file if compression fails for a given image.
 */
export async function appendPhotos(
  formData: FormData,
  input: HTMLInputElement | null,
): Promise<void> {
  formData.delete("photos");
  const files = input?.files ? Array.from(input.files).slice(0, MAX_PHOTOS) : [];

  for (let i = 0; i < files.length; i++) {
    const field = `photo${i + 1}`;
    try {
      const blob = await compressImage(files[i]);
      formData.append(field, blob, `${field}.jpg`);
    } catch {
      formData.append(field, files[i], files[i].name);
    }
  }
}
