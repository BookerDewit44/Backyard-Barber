import Hero from "@/components/Hero";
import SeasonalSpotlight from "@/components/SeasonalSpotlight";
import TrustBand from "@/components/TrustBand";
import ServicesGrid from "@/components/ServicesGrid";
import RecentWork from "@/components/RecentWork";
import Testimonials from "@/components/Testimonials";
import StripeDivider from "@/components/StripeDivider";

// SeasonalSpotlight picks its content from the current date. Without this the
// homepage would be prerendered once at build time and the banner would be
// stuck on whatever season it was when we deployed.
export const revalidate = 86400;

export default function HomePage() {
  return (
    <>
      <Hero />
      <SeasonalSpotlight />
      <TrustBand />
      <ServicesGrid />
      <StripeDivider />
      <RecentWork />
      <Testimonials />
    </>
  );
}
