import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Photo Gallery — Recent Jobs",
  description: "Before and after photos of Backyard Barber Land Management's work in Statesville, NC.",
  alternates: { canonical: "/gallery" },
};

// The gallery is admin-managed at runtime, so render per-request rather than
// caching a build-time snapshot — new uploads appear without a redeploy.
export const dynamic = "force-dynamic";

export default function GalleryPage() {
  return <GalleryGrid />;
}
