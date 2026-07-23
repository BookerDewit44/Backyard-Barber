import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// Lets the /admin page decide whether to show the login form or the panel.
export async function GET() {
  return Response.json({ authed: await isAdmin() });
}
