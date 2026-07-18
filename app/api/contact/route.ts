import { NextResponse } from "next/server";

// TODO(Phase 5): insert into the Neon `leads` table and call lib/twilio-client.ts +
// Resend once those accounts/env vars exist (see plan Phase 5). For now this just
// logs the lead server-side so the form is testable end-to-end in dev.
export async function POST(request: Request) {
  const body = await request.json();
  const { name, phone, email, service, message } = body ?? {};

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required." },
      { status: 400 }
    );
  }

  console.log("[contact] New lead:", { name, phone, email, service, message });

  return NextResponse.json({ ok: true });
}
