export const faqs = [
  {
    q: "What is Run402?",
    a: "Run402 is a package that turns any API route into a paid endpoint. It uses the HTTP 402 Payment Required standard to gate requests, handle Stripe Checkout, and unlock access — all without you writing billing code.",
  },
  {
    q: "How does billing work?",
    a: "When an unpaid request hits a protected route, Run402 returns a 402 with a hosted Stripe Checkout link. Once the customer pays, the original request replays and your endpoint responds. Invoices, receipts, and revenue tracking are automatic.",
  },
  {
    q: "Can I use Stripe?",
    a: "Yes — Run402 is built on Stripe. Connect your Stripe account and payments flow directly to you. We never hold your funds; we simply orchestrate Checkout, webhooks, and reconciliation for you.",
  },
  {
    q: "Can I self-host?",
    a: "The SDK runs entirely inside your own server or edge runtime, so your API traffic never leaves your infrastructure. Enterprise plans add fully self-hosted control-plane options for analytics and webhooks.",
  },
  {
    q: "Does it support subscriptions?",
    a: "Absolutely. Beyond per-request pricing, Run402 supports subscriptions, metered usage, and tiered plans — configurable per route with a single options object.",
  },
];
