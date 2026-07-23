// Public: complete a password reset. GET validates a token (so the reset page
// can show a friendly "link expired" state); POST sets the new password.
import {
  resetTokenIsValid,
  consumeResetToken,
  setPassword,
  MIN_PASSWORD_LENGTH,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  return Response.json({ valid: await resetTokenIsValid(token) });
}

export async function POST(req: Request) {
  let token = "";
  let password = "";
  try {
    const body = (await req.json()) as { token?: string; password?: string };
    token = body.token ?? "";
    password = body.password ?? "";
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return Response.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 },
    );
  }

  if (!(await resetTokenIsValid(token))) {
    return Response.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  await setPassword(password);
  await consumeResetToken();

  return Response.json({ ok: true });
}
