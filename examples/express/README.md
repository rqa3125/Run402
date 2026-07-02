# run402 · Express example

A minimal Express server with one protected route.

## Prerequisites

1. Run the dashboard locally (`pnpm --filter @run402/dashboard dev` → :3001) with a database.
2. In the dashboard: create a project, then register a **`GET /premium`** sandbox endpoint.
3. Copy the project's **secret key** (Dashboard → your project → API Keys → Regenerate to reveal it). It stays server-side.

## Run

From the repo root (workspace install links `run402`):

```bash
pnpm install
RUN402_SECRET_KEY=sk_live_xxx pnpm --filter @run402/example-express dev
```

Once `run402` is published to npm, this example is fully standalone:

```bash
cd examples/express
npm install
RUN402_SECRET_KEY=sk_live_xxx npm run dev
```

## Test the flow

```bash
# 1. Unpaid → 402 with a payment_url
curl -i http://localhost:4000/premium

# 2. Open the payment_url in a browser, click "Pay", copy the token

# 3. Retry with the token → 200 OK
curl -H "x-run402-token: rt_xxx" http://localhost:4000/premium
```

Env: `RUN402_PROJECT_KEY` (required), `RUN402_BASE_URL` (default `http://localhost:3001`), `PORT` (default `4000`).
