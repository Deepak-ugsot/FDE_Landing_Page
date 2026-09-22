import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/SiteHeader";
import { WhyFde } from "@/components/sections/WhyFde";

export default function Home() {
  return (
    <>
      <header>
        <Ticker />
      </header>
      <main>
        <Hero />
        <WhyFde />
      </main>
    </>
  );
}
