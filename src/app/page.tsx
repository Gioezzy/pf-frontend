import { Navbar } from "@/src/components/landing/Navbar";
import { Hero } from "@/src/components/landing/Hero";
import { About } from "@/src/components/landing/About";
import { Competitions } from "@/src/components/landing/Competitions";
import { Benefits } from "@/src/components/landing/Benefits";
import { Timeline } from "@/src/components/landing/Timeline";
import { Footer } from "@/src/components/landing/Footer";
import { SmoothScroll } from "@/src/components/landing/SmoothScroll";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <About />
          <Competitions />
          <Benefits />
          <Timeline />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}