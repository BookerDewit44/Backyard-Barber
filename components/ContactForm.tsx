"use client";

import { useState, type FormEvent } from "react";
import { SERVICES } from "@/lib/services";
import { appendPhotos } from "@/lib/photos";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("form-name", "contact");
    // Compress + split photos into per-field uploads (Netlify: 8MB / 1 file per field).
    await appendPhotos(
      formData,
      form.querySelector<HTMLInputElement>('input[type="file"]'),
    );

    try {
      // Submit to Netlify Forms as multipart (so photo uploads come through).
      // Netlify captures the lead + photos and emails the configured recipients.
      // Don't set Content-Type — the browser adds the multipart boundary.
      const res = await fetch("/__forms.html", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white border-2 border-ink rounded-lg p-8 text-center">
        <h3 className="font-display font-bold uppercase text-xl mb-2">
          Thanks &mdash; we got it!
        </h3>
        <p className="text-ink-soft">
          Backyard Barber will reach out shortly. For anything urgent, call{" "}
          <a href="tel:+17049029827" className="font-semibold text-ink">
            704-902-9827
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="bg-white border-2 border-ink rounded-lg p-6 sm:p-8 flex flex-col gap-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm font-display uppercase tracking-wide">
          Name
          <input
            required
            name="name"
            type="text"
            className="border-2 border-ink/30 rounded-md px-3 py-2 font-sans normal-case tracking-normal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-display uppercase tracking-wide">
          Phone
          <input
            required
            name="phone"
            type="tel"
            className="border-2 border-ink/30 rounded-md px-3 py-2 font-sans normal-case tracking-normal"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-display uppercase tracking-wide">
        Email (optional)
        <input
          name="email"
          type="email"
          className="border-2 border-ink/30 rounded-md px-3 py-2 font-sans normal-case tracking-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-display uppercase tracking-wide">
        Service Needed
        <select
          name="service"
          className="border-2 border-ink/30 rounded-md px-3 py-2 font-sans normal-case tracking-normal"
        >
          {SERVICES.map((service) => (
            <option key={service.slug} value={service.name}>
              {service.name}
            </option>
          ))}
          <option value="Other">Other / Not Sure</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-display uppercase tracking-wide">
        Message
        <textarea
          name="message"
          rows={4}
          className="border-2 border-ink/30 rounded-md px-3 py-2 font-sans normal-case tracking-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-display uppercase tracking-wide">
        Photos (optional)
        <input
          name="photos"
          type="file"
          accept="image/*"
          multiple
          className="border-2 border-ink/30 rounded-md px-3 py-2 font-sans normal-case tracking-normal text-sm file:mr-3 file:rounded file:border-0 file:bg-ink file:text-paper file:px-3 file:py-1 file:font-display file:uppercase file:text-xs file:cursor-pointer"
        />
        <span className="text-ink-soft text-xs font-sans normal-case tracking-normal">
          Snap a few pics of the job (from your phone or computer) so we can
          quote it faster.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-primary hover:bg-primary-dark disabled:opacity-60 text-ink font-display font-bold uppercase tracking-wide px-6 py-3 rounded-md border-2 border-ink transition-colors"
      >
        {status === "submitting" ? "Sending..." : "Send Request"}
      </button>

      {status === "error" && (
        <p className="text-accent-red text-sm">
          Something went wrong. Please call{" "}
          <a href="tel:+17049029827" className="font-semibold underline">
            704-902-9827
          </a>{" "}
          instead.
        </p>
      )}
    </form>
  );
}
