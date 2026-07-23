import type { Metadata } from "next";
import AdminResetClient from "@/components/AdminResetClient";

export const metadata: Metadata = {
  title: "Reset admin password",
  robots: { index: false, follow: false },
};

export default async function AdminResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <AdminResetClient token={token ?? ""} />;
}
