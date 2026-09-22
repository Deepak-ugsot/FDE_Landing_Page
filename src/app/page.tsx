import { CourseIntro } from "@/components/sections/CourseIntro";
import { Curriculum } from "@/components/sections/Curriculum";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { FreeCourse } from "@/components/sections/FreeCourse";
import { Hero } from "@/components/sections/Hero";
import { Mentor } from "@/components/sections/Mentor";
import { Projects } from "@/components/sections/Projects";
import { Ticker } from "@/components/sections/SiteHeader";
import { WhyPaid } from "@/components/sections/WhyPaid";
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
        <Mentor />
        <FreeCourse />
        <WhyPaid />
        <CourseIntro />
        <Curriculum />
        <Projects />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
