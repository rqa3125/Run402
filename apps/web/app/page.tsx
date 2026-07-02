import { Hero } from "@/components/sections/hero";
import { WorksWith } from "@/components/sections/works-with";
import { Stats } from "@/components/sections/stats";
import { Install } from "@/components/sections/install";
import { HowItWorks } from "@/components/sections/how-it-works";
import { LiveDemo } from "@/components/sections/live-demo";
import { CodeExample } from "@/components/sections/code-example";
import { Features } from "@/components/sections/features";
import { Comparison } from "@/components/sections/comparison";
import { Integrations } from "@/components/sections/integrations";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorksWith />
      <Stats />
      <Install />
      <HowItWorks />
      <LiveDemo />
      <CodeExample />
      <Features />
      <Comparison />
      <Integrations />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
