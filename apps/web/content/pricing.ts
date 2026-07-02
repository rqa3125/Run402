export type Plan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  cta: string;
  href: string;
  featured?: boolean;
  features: string[];
};

export const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to test and launch your first paid API.",
    cta: "Start for free",
    href: "/docs",
    features: [
      "Unlimited testing",
      "One project",
      "Stripe Checkout",
      "Community support",
      "Core analytics",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For teams shipping production APIs and scaling revenue.",
    cta: "Start Pro trial",
    href: "/docs",
    featured: true,
    features: [
      "Unlimited APIs & projects",
      "Advanced analytics",
      "Custom branding",
      "Webhooks & rate limiting",
      "Priority support",
      "Usage-based & subscription billing",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Dedicated infrastructure, SSO, and support for large orgs.",
    cta: "Contact sales",
    href: "/contact",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "SLA & dedicated support",
      "Self-hosting options",
      "Custom contracts",
      "Volume pricing",
    ],
  },
];
