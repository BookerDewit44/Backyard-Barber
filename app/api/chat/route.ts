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

Your main goal: answer questions AND, when a visitor wants work done, gather what's needed for a free quote:
1. their name
2. their phone number
3. which service they need
4. a short description of the job (and where they're located, if they'll say)

Ask for these naturally, one or two at a time in plain conversation — never dump a list on them. Once you have all four (name, phone, service, and a job description), call the collect_quote_details tool. That opens a pre-filled quote request the customer can review and send in one tap — so do NOT tell them to separately call or fill out another form once you have their info; just collect it and call the tool.

Rules:
- Keep replies short and conversational — 1-3 sentences, like a text message.
- NEVER quote prices or promise specific scheduling — you don't have that info. Tell them the owner will give an exact quote, and collect their details so he can.
- NEVER invent details about how the work is done, what it costs, how long it takes, or the best time of year for it. If you weren't told it here, say the owner can answer that and offer to pass their details along.
- Stump grinding is done year-round. Season, weather, and frozen ground are NOT factors — never suggest a better or worse time of year for it. What actually affects a stump job is how many stumps there are, how big around they are, and where they sit on the property (how easy it is to get the machine to them).
- Landscaping supply delivery covers mulch, gravel, stone, sand, topsoil, pine needles, manure, and other bulk materials. It can be dropped where the customer wants it or spread for them.
- If asked something unrelated to the business, gently steer back to how Backyard Barber can help with their property.
- Be warm and local — this is a small family-run business, not a corporation.`;

const QUOTE_TOOL: Anthropic.Tool = {
  name: "collect_quote_details",
  description:
    "Open a pre-filled quote request form for the customer to review and send. Call this ONLY once you have gathered the customer's name, phone number, which service they need, and a short description of the job.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "The customer's name." },
      phone: { type: "string", description: "The customer's phone number." },
      email: {
        type: "string",
        description: "The customer's email address if they gave one. Optional.",
      },
      service: {
        type: "string",
        description:
          "The service they need, e.g. Lawn Care, Stump Grinding, Grading, Debris Hauling, Gravel Spreading.",
      },
      details: {
        type: "string",
        description:
          "A short description of the job, including property location if provided.",
      },
    },
    required: ["name", "phone", "service", "details"],
  },
};

type IncomingMessage = { role?: string; text?: string };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const history: IncomingMessage[] = Array.isArray(body.messages)
    ? body.messages
    : typeof body.message === "string"
      ? [{ role: "user", text: body.message }]
      : [];

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
      tools: [QUOTE_TOOL],
      messages: mapped,
    });

    const textReply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock =>
        block.type === "tool_use" && block.name === "collect_quote_details",
    );

    if (toolUse) {
      const input = toolUse.input as Record<string, unknown>;
      const lead = {
        name: String(input.name ?? ""),
        phone: String(input.phone ?? ""),
        email: input.email ? String(input.email) : "",
        service: String(input.service ?? ""),
        details: String(input.details ?? ""),
      };
      const reply =
        textReply ||
        "Perfect — I've got everything I need! I've put together a quote request below. Just double-check it and hit Send.";
      return NextResponse.json({ reply, lead });
    }

    return NextResponse.json({ reply: textReply || ERROR_REPLY });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ reply: ERROR_REPLY });
  }
}
