import { NextResponse } from "next/server";

const FALLBACK_REPLY =
  "Thanks for reaching out! Our AI assistant isn't fully connected yet — " +
  "for now, give Backyard Barber a call at 704-902-9827 and we'll help you out.";

// TODO(Phase 6): wire up the Anthropic SDK here once ANTHROPIC_API_KEY exists
// (see plan Phase 6): build the system prompt from Sanity content, expose the
// submit_booking_request tool, and persist bookings via the same lead pipeline
// used by /api/contact.
export async function POST(request: Request) {
  const { message } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }

  // Real Claude integration goes here once the API key is configured.
  return NextResponse.json({ reply: FALLBACK_REPLY });
}
