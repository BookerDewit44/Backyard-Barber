// Sends the admin password-reset link by reusing the same Netlify Forms
// pipeline the contact form and chatbot already use — no separate email
// service. On a deploy, we POST the hidden `password-reset` form (declared in
// public/__forms.html) to the site, and Netlify emails the configured
// recipient (set that in Netlify → Forms → password-reset → notifications).
//
// Locally there's no Netlify Forms handler, so we log the link to the server
// console instead of emailing — enough to test the whole flow at localhost.
import { SITE_URL } from "@/lib/site";

const onNetlify =
  process.env.NETLIFY === "true" || !!process.env.NETLIFY_BLOBS_CONTEXT;

export async function sendResetEmail(resetLink: string): Promise<void> {
  if (!onNetlify) {
    // Dev fallback — the "email".
    console.log(
      `\n[admin reset] Password reset link (dev only, not emailed):\n  ${resetLink}\n`,
    );
    return;
  }

  const body = new URLSearchParams({
    "form-name": "password-reset",
    resetlink: resetLink,
    requested: new Date().toISOString(),
    "bot-field": "",
  });

  const res = await fetch(`${SITE_URL}/__forms.html`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`Netlify Forms submission failed: ${res.status}`);
  }
}
