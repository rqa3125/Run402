# run402

Monetize any API endpoint. Wrap a route, set a price in the Run402 dashboard, get paid.

> Express is the only supported framework in this release.

## Install

```bash
npm install run402
```

## Protect an endpoint

```ts
import express from "express";
import { protect } from "run402";

const app = express();

app.use(
  "/premium",
  protect({
    projectKey: "pk_live_…", // your project's publishable key
    endpoint: "/premium",    // must match an endpoint registered in the dashboard
    baseUrl: "http://localhost:3001", // Run402 control plane (default)
  }),
);

app.get("/premium", (_req, res) => {
  res.json({ data: "🔓 premium unlocked" });
});

app.listen(4000);
```

## Expected flow

1. Client requests `GET /premium` → **402 Payment Required**

   ```json
   { "error": "Payment Required", "payment_url": "http://localhost:3001/mock-checkout?payment=pay_…" }
   ```

2. Client opens `payment_url`, completes the (mock) checkout, and receives a token.

3. Client retries with the token:

   ```bash
   curl -H "x-run402-token: rt_…" http://localhost:4000/premium
   # → 200 OK  { "data": "🔓 premium unlocked" }
   ```

## Errors

The middleware relays clean JSON errors from the control plane:

| Status | `error.code`        | When                                    |
| ------ | ------------------- | --------------------------------------- |
| 401    | `invalid_key`       | `projectKey` doesn't match a project    |
| 401    | `invalid_token`     | token not found                         |
| 402    | (`payment_url`)     | no/expired token — payment required     |
| 403    | `token_mismatch`    | token is for a different endpoint       |
| 404    | `unknown_endpoint`  | route not registered in the dashboard   |
| 502    | `run402_unavailable`| control plane unreachable               |

Missing `projectKey`/`endpoint` throws at setup (**Missing Configuration**).
