export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  featured?: boolean;
};

export const posts: Post[] = [
  {
    slug: "introducing-run402",
    title: "Introducing Run402: monetize any API in under 2 minutes",
    excerpt:
      "Today we’re launching Run402 — the fastest way to turn an API route into a paid endpoint, powered by the HTTP 402 standard.",
    date: "2026-06-24",
    readingTime: "5 min read",
    category: "Announcements",
    featured: true,
  },
  {
    slug: "http-402-explained",
    title: "HTTP 402 Payment Required, finally put to work",
    excerpt:
      "The 402 status code sat unused in the spec for decades. Here’s how Run402 turns it into a first-class payments primitive.",
    date: "2026-06-10",
    readingTime: "7 min read",
    category: "Engineering",
  },
  {
    slug: "usage-based-billing-patterns",
    title: "Four usage-based billing patterns for modern APIs",
    excerpt:
      "Per-call, prepaid credits, tiered, and hybrid — a practical guide to pricing your API without overbuilding.",
    date: "2026-05-28",
    readingTime: "6 min read",
    category: "Guides",
  },
  {
    slug: "shipping-payments-without-a-payments-team",
    title: "Shipping payments without a payments team",
    excerpt:
      "How a two-person startup added metered billing to their inference API in an afternoon.",
    date: "2026-05-14",
    readingTime: "4 min read",
    category: "Customers",
  },
  {
    slug: "securing-paid-endpoints",
    title: "Securing paid endpoints: keys, limits, and replay safety",
    excerpt:
      "A deep dive into how Run402 protects paid routes from abuse while keeping the happy path fast.",
    date: "2026-04-30",
    readingTime: "8 min read",
    category: "Engineering",
  },
];
