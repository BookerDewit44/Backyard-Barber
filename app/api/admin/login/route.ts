import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  makeSessionValue,
  verifyPassword,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    /* fall through to invalid */
  }

  if (!(await verifyPassword(password))) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  const { value, maxAge } = makeSessionValue();
  const store = await cookies();
  store.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return Response.json({ ok: true });
}
