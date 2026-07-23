// Tiny self-hosted traffic analytics, stored in Netlify Blobs (dev: on-disk
// fallback, same as the other stores). One record per UTC day holds the view
// count, per-path counts, and a privacy-friendly set of daily-unique visitor
// hashes. No cookies, no third party, no PII — the visitor hash is salted with
// the date so it can't be correlated across days.
import { getRecord, setRecord } from "@/lib/adminStore";

export type DayRecord = {
  views: number;
  pages: Record<string, number>;
  visitors: string[]; // date-salted hashes; bounded to avoid runaway growth
};

const MAX_VISITORS_PER_DAY = 5000;
const dayKey = (date: string) => `analytics-${date}`;

/** UTC YYYY-MM-DD. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function datesBack(days: number): string[] {
  const out: string[] = [];
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    out.push(new Date(now - i * 86_400_000).toISOString().slice(0, 10));
  }
  return out;
}

export async function recordView(
  path: string,
  visitorId: string,
): Promise<void> {
  const key = dayKey(today());
  const rec =
    (await getRecord<DayRecord>(key)) ??
    ({ views: 0, pages: {}, visitors: [] } as DayRecord);

  rec.views += 1;
  rec.pages[path] = (rec.pages[path] ?? 0) + 1;
  if (
    visitorId &&
    rec.visitors.length < MAX_VISITORS_PER_DAY &&
    !rec.visitors.includes(visitorId)
  ) {
    rec.visitors.push(visitorId);
  }

  await setRecord(key, rec);
}

export type AnalyticsSummary = {
  days: number;
  totalViews: number;
  // Sum of per-day uniques (a returning visitor counts once per day). Labeled
  // "visits" in the UI to be honest about what it measures.
  totalVisits: number;
  series: { date: string; views: number; visitors: number }[];
  topPages: { path: string; views: number }[];
};

export async function readSummary(days: number): Promise<AnalyticsSummary> {
  const dates = datesBack(days);
  const records = await Promise.all(
    dates.map((d) => getRecord<DayRecord>(dayKey(d))),
  );

  const series: AnalyticsSummary["series"] = [];
  const pageTotals: Record<string, number> = {};
  let totalViews = 0;
  let totalVisits = 0;

  dates.forEach((date, i) => {
    const rec = records[i];
    const views = rec?.views ?? 0;
    const visitors = rec?.visitors.length ?? 0;
    totalViews += views;
    totalVisits += visitors;
    series.push({ date, views, visitors });
    if (rec) {
      for (const [path, n] of Object.entries(rec.pages)) {
        pageTotals[path] = (pageTotals[path] ?? 0) + n;
      }
    }
  });

  const topPages = Object.entries(pageTotals)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  return { days, totalViews, totalVisits, series, topPages };
}
