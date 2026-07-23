import type { Metadata } from "next";
import AdminClient from "@/components/AdminClient";

export const metadata: Metadata = {
  title: "Admin",
  // Keep the admin panel out of search engines and off the sitemap's radar.
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
