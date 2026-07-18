import Image from "next/image";
import Link from "next/link";

const PHONE_DISPLAY = "704-902-9827";
const PHONE_HREF = "tel:+17049029827";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper border-t-4 border-primary">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Backyard Barber logo"
            width={48}
            height={48}
            className="rounded-full border-2 border-paper object-cover"
          />
          <div className="font-display font-bold tracking-wide">
            BACKYARD BARBER
            <div className="font-sans font-normal text-sm text-paper/70 normal-case tracking-normal">
              Statesville, NC &middot; Est. 2010
            </div>
          </div>
        </div>

        <div className="text-sm space-y-2">
          <div className="font-display uppercase tracking-wide text-primary">
            Contact
          </div>
          <a href={PHONE_HREF} className="block hover:text-primary transition-colors">
            {PHONE_DISPLAY}
          </a>
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noreferrer"
            className="block hover:text-primary transition-colors"
          >
            Facebook
          </a>
        </div>

        <div className="text-sm space-y-2">
          <div className="font-display uppercase tracking-wide text-primary">
            Explore
          </div>
          <Link href="/services" className="block hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/gallery" className="block hover:text-primary transition-colors">
            Gallery
          </Link>
          <Link href="/service-area" className="block hover:text-primary transition-colors">
            Service Area
          </Link>
          <Link href="/contact" className="block hover:text-primary transition-colors">
            Contact
          </Link>
        </div>
      </div>

      <div className="border-t border-paper/20 py-4 text-center text-xs text-paper/60">
        &copy; {new Date().getFullYear()} Backyard Barber. All rights reserved.
      </div>
    </footer>
  );
}
