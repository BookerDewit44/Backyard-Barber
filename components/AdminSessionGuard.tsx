"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const isAdminPath = (p: string | null) => !!p && p.startsWith("/admin");

// Ends the admin session the moment the owner leaves the admin area, so
// returning always requires the password again. Covers:
//   - in-app navigation away from /admin (SPA route change) -> fetch logout
//   - closing the tab / reload / external navigation -> sendBeacon logout
// Lives in the root layout so it can see route changes even as the /admin page
// component itself unmounts.
export default function AdminSessionGuard() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);

  // In-app navigation out of the admin area.
  useEffect(() => {
    if (isAdminPath(prev.current) && !isAdminPath(pathname)) {
      fetch("/api/admin/logout", { method: "POST", keepalive: true }).catch(
        () => {},
      );
    }
    prev.current = pathname;
  }, [pathname]);

  // Tab close / reload / navigating to another site while in the admin area.
  useEffect(() => {
    if (!isAdminPath(pathname)) return;
    const endSession = () => {
      try {
        navigator.sendBeacon?.("/api/admin/logout");
      } catch {
        /* best effort */
      }
    };
    window.addEventListener("pagehide", endSession);
    return () => window.removeEventListener("pagehide", endSession);
  }, [pathname]);

  return null;
}
