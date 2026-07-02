import express from "express";
import { protect } from "run402";

/**
 * Minimal Express app protected by Run402.
 *
 *   GET /          → open, returns instructions
 *   GET /premium   → protected: 402 until paid, then 200 with a token
 *
 * Set RUN402_SECRET_KEY to your project's secret key (Dashboard → API Keys →
 * regenerate to reveal it) and register a `GET /premium` sandbox endpoint.
 * The secret key stays server-side — never ship it to a browser.
 */
const SECRET_KEY = process.env.RUN402_SECRET_KEY ?? "sk_live_replace_me";
const BASE_URL = process.env.RUN402_BASE_URL ?? "http://localhost:3001";
const PORT = Number(process.env.PORT ?? 4000);

const app = express();

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    tryThis: `curl http://localhost:${PORT}/premium`,
    docs: "http://localhost:3002",
  });
});

// Everything under /premium requires payment.
app.use(
  "/premium",
  protect({
    projectKey: SECRET_KEY,
    endpoint: "/premium",
    baseUrl: BASE_URL,
  }),
);

app.get("/premium", (_req, res) => {
  res.json({ data: "🔓 premium unlocked", at: new Date().toISOString() });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`▲ run402 example listening on http://localhost:${PORT}`);
  if (SECRET_KEY === "sk_live_replace_me") {
    // eslint-disable-next-line no-console
    console.warn("⚠  Set RUN402_SECRET_KEY to your project's secret key.");
  }
});
