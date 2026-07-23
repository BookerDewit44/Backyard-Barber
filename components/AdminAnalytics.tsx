"use client";

import { useEffect, useState } from "react";

type Summary = {
  days: number;
  totalViews: number;
  totalVisits: number;
  series: { date: string; views: number; visitors: number }[];
  topPages: { path: string; views: number }[];
};

const RANGES = [7, 30, 90] as const;

export default function AdminAnalytics() {
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics?days=${days}`);
        const d = res.ok ? ((await res.json()) as Summary) : null;
        if (active) setData(d);
      } catch {
        if (active) setData(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [days]);

  const maxViews = Math.max(1, ...(data?.series.map((d) => d.views) ?? [1]));

  return (
    <section className="bg-paper border-2 border-ink rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-display font-bold uppercase text-xl">
          Site Traffic
        </h2>
        <div className="flex rounded-md border-2 border-ink overflow-hidden">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDays(r)}
              className={`px-3 py-1 text-sm font-semibold transition-colors ${
                days === r
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink hover:bg-primary/20"
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <p className="text-ink-soft text-sm">Loading…</p>
      ) : !data ? (
        <p className="text-ink-soft text-sm">Couldn&apos;t load analytics.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Stat label={`Page views (${days}d)`} value={data.totalViews} />
            <Stat
              label={`Visits (${days}d)`}
              value={data.totalVisits}
              hint="unique visitors per day, summed"
            />
          </div>

          {/* Daily views bar chart */}
          <div className="mb-6">
            <div className="flex items-end gap-[2px] h-28">
              {data.series.map((d) => (
                <div
                  key={d.date}
                  className="group relative flex-1 flex items-end"
                  title={`${d.date}: ${d.views} views, ${d.visitors} visits`}
                >
                  <div
                    className="w-full bg-primary hover:bg-primary-dark rounded-t-sm transition-colors"
                    style={{
                      height: `${Math.max(2, (d.views / maxViews) * 100)}%`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-ink-soft mt-1">
              <span>{data.series[0]?.date}</span>
              <span>{data.series[data.series.length - 1]?.date}</span>
            </div>
          </div>

          {/* Top pages */}
          <h3 className="font-display font-bold uppercase text-sm mb-2">
            Top pages
          </h3>
          {data.topPages.length === 0 ? (
            <p className="text-ink-soft text-sm">
              No visits recorded yet in this range.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {data.topPages.map((p) => (
                <li key={p.path} className="flex justify-between gap-4">
                  <span className="truncate text-ink">{p.path}</span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {p.views}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="text-xs text-ink-soft mt-5">
            Privacy-friendly, first-party counts — no cookies, no third party.
            Your own visits to /admin aren&apos;t counted. Numbers begin from
            when this was switched on.
          </p>
        </>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-md border border-ink/20 bg-white p-4">
      <div className="font-display font-bold text-3xl tabular-nums">
        {value.toLocaleString()}
      </div>
      <div className="text-xs uppercase tracking-wide text-ink-soft mt-1">
        {label}
      </div>
      {hint && <div className="text-[11px] text-ink-soft mt-0.5">{hint}</div>}
    </div>
  );
}
