import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Photo Gallery — Recent Jobs",
  description: "Before and after photos of Backyard Barber Land Management's work in Statesville, NC.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return <GalleryGrid />;
}
