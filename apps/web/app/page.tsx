import { Hero } from "@/components/sections/hero";
import { WorksWith } from "@/components/sections/works-with";
import { BetaProgress } from "@/components/sections/beta-progress";
import { Install } from "@/components/sections/install";
import { HowItWorks } from "@/components/sections/how-it-works";
import { LiveDemo } from "@/components/sections/live-demo";
import { CodeExample } from "@/components/sections/code-example";
import { Features } from "@/components/sections/features";
import { Comparison } from "@/components/sections/comparison";
import { Roadmap } from "@/components/sections/roadmap";
import { BuildingInPublic } from "@/components/sections/building-in-public";
import { Founder } from "@/components/sections/founder";
import { FoundingDevelopers } from "@/components/sections/founding-developers";
import { Integrations } from "@/components/sections/integrations";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorksWith />
      <BetaProgress />
      <Install />
      <HowItWorks />
      <LiveDemo />
      <CodeExample />
      <Features />
      <Comparison />
      <Roadmap />
      <BuildingInPublic />
      <Founder />
      <FoundingDevelopers />
      <Integrations />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
