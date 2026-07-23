// Admin-only: traffic summary for the /admin dashboard.
import { isAdmin } from "@/lib/adminAuth";
import { readSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }
  const raw = Number(new URL(req.url).searchParams.get("days"));
  const days = [7, 30, 90].includes(raw) ? raw : 30;
  return Response.json(await readSummary(days));
}
