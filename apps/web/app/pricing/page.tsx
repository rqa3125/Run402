import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing. Start free, upgrade when your API earns. No hidden fees on top of Stripe.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Pricing that scales with your revenue"
        description="Start free and only pay as your API grows. No setup fees, no lock-in, no surprises on top of Stripe."
      />
      <Pricing withHeading={false} />
      <div className="border-t border-border">
        <FAQ />
      </div>
    </>
  );
}
