import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery | Backyard Barber",
  description: "Before and after photos of Backyard Barber's work in Statesville, NC.",
};

export default function GalleryPage() {
  return <GalleryGrid />;
}
