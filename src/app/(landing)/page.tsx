import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCases from "@/components/landing/UseCases";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Hero />
      
      <div className="hidden md:block">
        <Features />
        <HowItWorks />
        <UseCases />
        <CTA />
      </div>
    </main>
  );
}