"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Fires a lightweight pageview beacon on every navigation. Uses sendBeacon so
// it doesn't block or get cancelled on unload; falls back to fetch. The server
// ignores /admin paths, so the owner's own visits aren't counted.
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const body = JSON.stringify({ path: pathname });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/track",
          new Blob([body], { type: "application/json" }),
        );
        return;
      }
    } catch {
      /* fall through to fetch */
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
