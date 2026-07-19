"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BASE_PATH } from "@/lib/basePath";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/service-area", label: "Service Area" },
  { href: "/contact", label: "Contact" },
];

const PHONE_DISPLAY = "704-902-9827";
const PHONE_HREF = "tel:+17049029827";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b-4 border-ink shadow-sm">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between gap-4 h-20">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src={`${BASE_PATH}/logo.png`}
            alt="Backyard Barber Land Management logo"
            width={56}
            height={56}
            className="rounded-md bg-white object-contain"
            priority
          />
          <span className="hidden sm:block font-display font-bold text-lg tracking-wide text-ink leading-none">
            BACKYARD BARBER
            <span className="block text-[0.65rem] font-semibold tracking-[0.2em] text-ink-soft mt-1">
              LAND MANAGEMENT
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-display uppercase text-sm tracking-wide">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink-soft hover:text-primary-dark transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href={PHONE_HREF}
            className="font-display font-semibold text-ink hover:text-primary-dark transition-colors"
          >
            {PHONE_DISPLAY}
          </a>
          <Link
            href="/contact"
            className="bg-primary hover:bg-primary-dark text-ink font-display font-bold uppercase text-sm tracking-wide px-4 py-2 rounded-md border-2 border-ink transition-colors"
          >
            Free Quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 border-2 border-ink rounded-md"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-ink" />
            <span className="block w-6 h-0.5 bg-ink" />
            <span className="block w-6 h-0.5 bg-ink" />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t-2 border-ink bg-paper px-4 py-4 flex flex-col gap-4 font-display uppercase text-sm tracking-wide">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-ink-soft hover:text-primary-dark transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a href={PHONE_HREF} className="font-semibold text-ink">
            Call {PHONE_DISPLAY}
          </a>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="bg-primary hover:bg-primary-dark text-ink font-bold text-center px-4 py-2 rounded-md border-2 border-ink"
          >
            Free Quote
          </Link>
        </div>
      )}
    </header>
  );
}
