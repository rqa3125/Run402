export const site = {
  name: "Run402",
  domain: "run402.dev",
  url: "https://run402.dev",
  // The authenticated dashboard lives on its own subdomain. Overridable per
  // environment (e.g. preview deploys) via NEXT_PUBLIC_DASHBOARD_URL.
  dashboardUrl:
    process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://app.run402.dev",
  tagline: "Monetize Any API in Under 2 Minutes.",
  description:
    "Run402 is API infrastructure for the next generation — now in Public Beta. Install one package, wrap any route, and start charging. Built in public alongside early developers.",
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
