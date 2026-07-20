"use client";

import { useEffect, useRef, useState } from "react";
import { FOUNDED_YEAR, SERVICE_RADIUS_MILES } from "@/lib/site";

const YEARS_IN_BUSINESS = new Date().getFullYear() - Number(FOUNDED_YEAR);

// value === null means "don't count it up, just show the suffix" — a year
// ticking up from 0 reads as broken rather than impressive.
const STATS: { value: number | null; suffix: string; label: string }[] = [
  { value: null, suffix: FOUNDED_YEAR, label: "Established" },
  { value: YEARS_IN_BUSINESS, suffix: "+", label: "Years in Business" },
  { value: SERVICE_RADIUS_MILES, suffix: "-Mile", label: "Service Radius" },
  { value: null, suffix: "Free", label: "Estimates, Always" },
];

const COUNT_MS = 900;

export default function TrustBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0); // 0 -> 1

  // Count up once, the first time the band scrolls into view.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        // Reduced motion: skip straight to the final numbers.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setProgress(1);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / COUNT_MS, 1);
          // ease-out so it decelerates into the final number
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-paper-dim border-y-2 border-ink/10"
      aria-label="Why choose Backyard Barber"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-display font-bold text-3xl sm:text-4xl text-ink">
              {stat.value === null
                ? stat.suffix
                : `${Math.round(stat.value * progress)}${stat.suffix}`}
            </span>
            <span className="font-display uppercase tracking-wide text-xs text-ink-soft">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
