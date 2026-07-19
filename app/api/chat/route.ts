import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SERVICES } from "@/lib/services";

const FALLBACK_REPLY =
  "Thanks for reaching out! Our AI assistant isn't fully connected yet — " +
  "for now, give Backyard Barber a call at 704-902-9827 and we'll help you out.";

const ERROR_REPLY =
  "Sorry, I'm having trouble right now. Please call Backyard Barber at " +
  "704-902-9827 and we'll take care of you.";

// Haiku 4.5 — cheap and fast, plenty capable for a small-business front-desk chat.
const MODEL = "claude-haiku-4-5";

const SYSTEM_PROMPT = `You are the friendly front-desk assistant for Backyard Barber Land Management, a lawn care and land management business in Statesville, NC (established 2010). Owner phone: 704-902-9827.

Services offered:
${SERVICES.map((s) => `- ${s.name}: ${s.description}`).join("\n")}

Your job:
- Answer questions about services, service area (Statesville, NC and the surrounding area), and how to get started.
- Encourage visitors to request a free quote by calling 704-902-9827 or using the Contact page.
- Collect what the job is and roughly where it is, so the owner can follow up.

Rules:
- Keep replies short and conversational — 1-3 sentences, like a text message.
- NEVER quote prices or promise specific scheduling — you don't have that info. For anything about cost, availability, or booking, tell them to call 704-902-9827 for a free quote.
- If asked something unrelated to the business, gently steer back to how Backyard Barber can help with their property.
- Be warm and local — this is a small family-run business, not a corporation.`;

type IncomingMessage = { role?: string; text?: string };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Accept either a full history ({ messages: [{role, text}] }) or a single
  // { message } string for backward compatibility.
  const history: IncomingMessage[] = Array.isArray(body.messages)
    ? body.messages
    : typeof body.message === "string"
      ? [{ role: "user", text: body.message }]
      : [];

  // Map to Anthropic message params, keeping only user/assistant turns with text.
  // The API requires the first message to be from the user, so drop any leading
  // assistant turns (e.g. the widget's canned greeting).
  const mapped: Anthropic.MessageParam[] = history
    .filter(
      (m): m is Required<IncomingMessage> =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.text === "string" &&
        m.text.trim().length > 0,
    )
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.text }));

  while (mapped.length > 0 && mapped[0].role !== "user") {
    mapped.shift();
  }

  if (mapped.length === 0) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: mapped,
    });

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    return NextResponse.json({ reply: reply || ERROR_REPLY });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ reply: ERROR_REPLY });
  }
}
