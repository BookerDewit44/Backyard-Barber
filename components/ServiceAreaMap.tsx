"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

// Statesville, NC
const CENTER: [number, number] = [35.7826, -80.8873];
const RADIUS_MILES = 100;
const METERS_PER_MILE = 1609.34;

export default function ServiceAreaMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Import Leaflet only in the browser (it references window/document).
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const circle = L.circle(CENTER, {
        radius: RADIUS_MILES * METERS_PER_MILE,
        color: "#1a1a1a",
        weight: 2,
        fillColor: "#f5b800",
        fillOpacity: 0.15,
      }).addTo(map);

      L.circleMarker(CENTER, {
        radius: 7,
        color: "#1a1a1a",
        weight: 2,
        fillColor: "#f5b800",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip("Statesville, NC", { direction: "top" });

      map.fitBounds(circle.getBounds(), { padding: [20, 20] });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Map of Backyard Barber Land Management's service area — roughly a 100-mile radius around Statesville, NC"
      className="isolate w-full h-[26rem] sm:h-[32rem] rounded-lg border-2 border-ink overflow-hidden"
    />
  );
}
