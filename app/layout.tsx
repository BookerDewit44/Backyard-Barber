import type { Metadata } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import StructuredData from "@/components/StructuredData";
import { BUSINESS_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

// Google truncates titles around 60 characters, so this front-loads the two
// things worth winning — the brand and the city — and leaves the individual
// services to rank through their own /services/[slug] pages, which each carry
// a focused title. Cramming all six in here competed with all of them.
const TITLE =
  "Backyard Barber Land Management — Lawn Care & Stump Grinding in Statesville, NC";
const DESCRIPTION =
  "Lawn care, grading, debris hauling, stump grinding, gravel spreading, and landscaping supply delivery in Statesville, NC and 50 miles around. Serving the area since 2010. Call 704-902-9827 for a free quote.";

export const metadata: Metadata = {
  // Lets child pages declare canonical/OG URLs as relative paths.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Child pages set a bare title (e.g. "Services") and get the brand appended.
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  // The share card is app/opengraph-image.png; Next fills in the image tags.
  openGraph: {
    type: "website",
    siteName: BUSINESS_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Netlify to verify ownership in
  // Google Search Console; omitted entirely when the variable is unset.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <StructuredData />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
