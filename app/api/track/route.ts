// Public: the pageview beacon. The <Analytics> client component pings this on
// every navigation. Stores nothing that identifies a person — just a count and
// a date-salted visitor hash.
import crypto from "crypto";
import { recordView, today } from "@/lib/analytics";

export const dynamic = "force-dynamic";

function visitorHash(req: Request): string {
  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "0";
  const ua = req.headers.get("user-agent") ?? "";
  const salt = process.env.ADMIN_SESSION_SECRET ?? "analytics";
  return crypto
    .createHash("sha256")
    .update(`${today()}|${ip}|${ua}|${salt}`)
    .digest("hex")
    .slice(0, 16);
}

export async function POST(req: Request) {
  let path = "";
  try {
    const body = (await req.json()) as { path?: string };
    path = (body.path ?? "").trim();
  } catch {
    return new Response(null, { status: 204 });
  }

  // Only track same-site page paths, and never the admin area itself.
  if (!path.startsWith("/") || path.startsWith("/admin")) {
    return new Response(null, { status: 204 });
  }
  // Normalize + cap length so the top-pages list stays clean.
  path = path.split("?")[0].split("#")[0].slice(0, 200);

  try {
    await recordView(path, visitorHash(req));
  } catch (err) {
    console.error("[analytics] recordView failed:", err);
  }
  return new Response(null, { status: 204 });
}
