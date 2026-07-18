// Prefix for static assets referenced by plain string path (e.g. "/logo.jpg").
// Only non-empty for the GitHub Pages static-export build, which serves the
// site from a /Backyard-Barber subpath. See next.config.ts.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
