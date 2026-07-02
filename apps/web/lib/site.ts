export const site = {
  name: "Run402",
  domain: "run402.com",
  url: "https://run402.com",
  tagline: "Monetize Any API in Under 2 Minutes.",
  description:
    "Run402 is the easiest way to monetize APIs. Install one package, wrap any route, and start charging. Stripe Checkout, billing, analytics, rate limiting — handled.",
  github: "https://github.com/run402/run402",
  discord: "https://discord.gg/run402",
  twitter: "https://x.com/run402",
} as const;

export const nav = [
  { label: "Features", href: "/#features" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
  { label: "GitHub", href: site.github, external: true },
] as const;
