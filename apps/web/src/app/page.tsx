import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Ticker } from "@/components/ticker";
import { StatsBand } from "@/components/stats-band";
import { Products } from "@/components/products";
import { HowItWorks } from "@/components/how-it-works";
import { Trust } from "@/components/trust";
import { Pricing } from "@/components/pricing";
import { Developers } from "@/components/developers";
import { Africa } from "@/components/africa";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <StatsBand />
      <Products />
      <HowItWorks />
      <Trust />
      <Pricing />
      <Developers />
      <Africa />
      <CTA />
      <Footer />
    </>
  );
}
