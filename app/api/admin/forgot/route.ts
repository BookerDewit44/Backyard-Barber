// Public: start a password reset. Anyone can call this (it's the "forgot
// password" button), so it must never leak whether/what it sent — it always
// returns the same generic response, and the reset link goes ONLY to the
// owner's inbox, never back to the caller.
import { createResetToken } from "@/lib/adminAuth";
import { sendResetEmail } from "@/lib/sendResetEmail";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const GENERIC = {
  ok: true,
  message:
    "If an admin account exists, a reset link has been sent to the owner's email.",
};

export async function POST() {
  try {
    const token = await createResetToken();
    // token is null when one was just sent (cooldown) — stay silent either way.
    if (token) {
      const link = `${SITE_URL}/admin/reset?token=${encodeURIComponent(token)}`;
      await sendResetEmail(link);
    }
  } catch (err) {
    // Log server-side but still return the generic message so failures don't
    // reveal anything to the caller.
    console.error("[admin reset] failed to send reset email:", err);
  }
  return Response.json(GENERIC);
}
