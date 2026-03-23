// Simple Cloudinary URL helpers for the client.
// Requires Vite env vars:
// - VITE_CLOUDINARY_CLOUD_NAME
// - VITE_CLOUDINARY_BASE_FOLDER (e.g. "norte-vivo/icons")

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const baseFolder = import.meta.env.VITE_CLOUDINARY_BASE_FOLDER || "norte-vivo/icons";

// Build a delivery URL with sensible defaults (auto format/quality).
export function cloudinaryUrl(publicId: string, opts?: { w?: number; h?: number }) {
  if (!cloudName) return undefined;
  const transforms = [`f_auto`, `q_auto`];
  if (opts?.w) transforms.push(`w_${opts.w}`);
  if (opts?.h) transforms.push(`h_${opts.h}`);
  const prefix = `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}`;
  return `${prefix}/${publicId}`;
}

// Shortcut for our guide icons
export function guideIcon(id: string, size = 160) {
  // expects files like guide-health.webp inside baseFolder
  const url = cloudinaryUrl(`${baseFolder}/${id}.webp`, { w: size });
  return url;
}

// Generic helper for the category/things icons
export function thingsIcon(id: string, size = 200) {
  const url = cloudinaryUrl(`${baseFolder}/${id}.webp`, { w: size, h: size });
  return url;
}
