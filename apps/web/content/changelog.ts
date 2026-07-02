export type ChangelogEntry = {
  version: string;
  date: string;
  tag: "New" | "Improved" | "Fixed";
  title: string;
  points: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "1.4.0",
    date: "2026-06-24",
    tag: "New",
    title: "Subscriptions & metered billing",
    points: [
      "protect() now accepts subscription and metered pricing models",
      "New usage dashboard with per-key breakdowns",
      "Edge runtime support for Vercel and Cloudflare Workers",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-05-30",
    tag: "Improved",
    title: "Faster checkout & analytics v2",
    points: [
      "40% faster hosted Checkout hand-off",
      "Redesigned analytics with revenue cohorts",
      "Configurable rate limits per plan",
    ],
  },
  {
    version: "1.2.1",
    date: "2026-05-12",
    tag: "Fixed",
    title: "Webhook reliability",
    points: [
      "Signed webhook retries with exponential backoff",
      "Resolved a rare double-charge on concurrent replays",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-04-28",
    tag: "New",
    title: "Fastify & Next.js adapters",
    points: [
      "First-class adapters for Fastify and Next.js route handlers",
      "Typed SDK with full IntelliSense",
    ],
  },
];
