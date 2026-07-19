import { NextResponse } from "next/server";
import twilio from "twilio";

// Where lead alerts are texted. Overridable via env, defaults to the owner's cell.
const OWNER_PHONE = process.env.OWNER_PHONE ?? "+17044986214";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { name, phone, email, service, message } = body ?? {};

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required." },
      { status: 400 },
    );
  }

  // Always log server-side so leads are captured even if SMS isn't configured.
  console.log("[contact] New lead:", { name, phone, email, service, message });

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (sid && token && from) {
    const smsBody =
      `New Backyard Barber lead\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      (email ? `Email: ${email}\n` : "") +
      (service ? `Service: ${service}\n` : "") +
      (message ? `Message: ${message}` : "");

    try {
      await twilio(sid, token).messages.create({
        to: OWNER_PHONE,
        from,
        body: smsBody,
      });
    } catch (error) {
      // Don't fail the visitor's submission if the text can't be sent —
      // the lead is already logged above. Surface the error in the logs.
      console.error("[contact] Twilio SMS failed:", error);
    }
  } else {
    console.warn(
      "[contact] Twilio env vars not set — lead logged but no SMS sent.",
    );
  }

  return NextResponse.json({ ok: true });
}
