"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type QuoteFields = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
};

type QuoteStatus = "idle" | "submitting" | "success" | "error";

const GREETING: ChatMessage = {
  role: "assistant",
  text: "Hi! I'm the Backyard Barber assistant. Ask me about services, or tell me what you need done and I'll put together a quote request for you.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [quote, setQuote] = useState<QuoteFields | null>(null);
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus>("idle");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message / the quote form whenever the
  // conversation changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, quote, quoteStatus, sending, open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply ?? "Sorry, something went wrong." },
      ]);
      // When the assistant has gathered enough info, it returns a `lead` — open
      // a pre-filled quote form for the customer to review and send.
      if (data.lead) {
        setQuote({
          name: data.lead.name ?? "",
          phone: data.lead.phone ?? "",
          email: data.lead.email ?? "",
          service: data.lead.service ?? "",
          message: data.lead.details ?? "",
        });
        setQuoteStatus("idle");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please call 704-902-9827.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function handleQuoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quote || quoteStatus === "submitting") return;
    setQuoteStatus("submitting");

    // Build multipart FormData from the form so photo uploads come through.
    // Controlled inputs serialize via their `name` attributes.
    const formData = new FormData(event.currentTarget);
    formData.set("form-name", "contact");

    try {
      // Same Netlify Forms pipeline as the Contact page form.
      // No Content-Type header — the browser sets the multipart boundary.
      const res = await fetch("/__forms.html", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Request failed");
      setQuoteStatus("success");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Your request has been sent — Backyard Barber will reach out shortly. Anything else I can help with?",
        },
      ]);
    } catch {
      setQuoteStatus("error");
    }
  }

  function updateQuote(field: keyof QuoteFields, value: string) {
    setQuote((q) => (q ? { ...q, [field]: value } : q));
  }

  const quoteInputClass =
    "border-2 border-ink/30 rounded-md px-2 py-1.5 text-sm font-sans outline-none focus:border-ink";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 w-80 max-w-[calc(100vw-2rem)] h-[28rem] bg-white border-2 border-ink rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="bg-ink text-paper font-display font-bold uppercase tracking-wide px-4 py-3 flex items-center justify-between">
            Backyard Barber Chat
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-paper/70 hover:text-paper"
            >
              &times;
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 text-sm"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.role === "assistant"
                    ? "self-start bg-paper-dim rounded-lg px-3 py-2 max-w-[85%] whitespace-pre-wrap"
                    : "self-end bg-primary rounded-lg px-3 py-2 max-w-[85%] whitespace-pre-wrap"
                }
              >
                {msg.text}
              </div>
            ))}

            {sending && (
              <div className="self-start bg-paper-dim rounded-lg px-3 py-2 text-ink-soft">
                &hellip;
              </div>
            )}

            {quote && quoteStatus !== "success" && (
              <form
                onSubmit={handleQuoteSubmit}
                encType="multipart/form-data"
                className="self-stretch bg-paper-dim border-2 border-ink rounded-lg p-3 flex flex-col gap-2 mt-1"
              >
                <div className="font-display font-bold uppercase text-xs tracking-wide">
                  Your quote request
                </div>
                <input
                  name="name"
                  value={quote.name}
                  onChange={(e) => updateQuote("name", e.target.value)}
                  placeholder="Name"
                  required
                  className={quoteInputClass}
                />
                <input
                  name="phone"
                  value={quote.phone}
                  onChange={(e) => updateQuote("phone", e.target.value)}
                  placeholder="Phone"
                  type="tel"
                  required
                  className={quoteInputClass}
                />
                <input
                  name="email"
                  value={quote.email}
                  onChange={(e) => updateQuote("email", e.target.value)}
                  placeholder="Email (optional)"
                  type="email"
                  className={quoteInputClass}
                />
                <input
                  name="service"
                  value={quote.service}
                  onChange={(e) => updateQuote("service", e.target.value)}
                  placeholder="Service"
                  className={quoteInputClass}
                />
                <textarea
                  name="message"
                  value={quote.message}
                  onChange={(e) => updateQuote("message", e.target.value)}
                  placeholder="Details"
                  rows={2}
                  className={quoteInputClass}
                />
                <label className="text-xs font-display uppercase tracking-wide text-ink-soft">
                  Photos (optional)
                  <input
                    name="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="mt-1 block w-full text-xs font-sans normal-case tracking-normal file:mr-2 file:rounded file:border-0 file:bg-ink file:text-paper file:px-2 file:py-1 file:font-display file:uppercase file:text-[0.65rem] file:cursor-pointer"
                  />
                </label>
                <button
                  type="submit"
                  disabled={quoteStatus === "submitting"}
                  className="bg-primary hover:bg-primary-dark disabled:opacity-60 text-ink font-display font-bold uppercase text-xs tracking-wide px-4 py-2 rounded-md border-2 border-ink transition-colors"
                >
                  {quoteStatus === "submitting" ? "Sending..." : "Send my request"}
                </button>
                {quoteStatus === "error" && (
                  <p className="text-accent-red text-xs">
                    Couldn&apos;t send — please call 704-902-9827.
                  </p>
                )}
              </form>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t-2 border-ink flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-primary hover:bg-primary-dark disabled:opacity-60 px-4 font-display font-bold uppercase text-xs"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary-dark border-2 border-ink shadow-lg flex items-center justify-center"
        aria-label="Open chat"
      >
        {open ? (
          <span className="text-2xl leading-none">&times;</span>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
