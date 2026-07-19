import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery | Backyard Barber Land Management",
  description: "Before and after photos of Backyard Barber Land Management's work in Statesville, NC.",
};

export default function GalleryPage() {
  return <GalleryGrid />;
}
