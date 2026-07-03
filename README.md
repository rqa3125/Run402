<div align="center">

<img src="apps/web/public/logo-mark.png" alt="Run402" width="88" height="88" />

# Run402

**The HTTP 402 payments layer for APIs.**

Monetize any API in one line — wrap a route, set a price, and start charging.
Run402 handles the `402 Payment Required` handshake, hosted checkout, single-use
access tokens, request logging, and revenue metering, so you never write billing
code.

[![License: MIT](https://img.shields.io/badge/License-MIT-111.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-4169E1.svg)](https://orm.drizzle.team/)

</div>

---

## How it works

Run402 turns any endpoint into a paid endpoint using the HTTP `402 Payment
Required` status code:

1. **Protect** a route with the `run402` middleware and set a price.
2. An **unpaid** request receives `402` with a hosted checkout URL.
3. The caller **pays**; Run402 issues a **single-use token**.
4. The request is **replayed** with the token and your endpoint responds `200`.

Settlement, token issuance, idempotency, request logging, and revenue metering
are all handled for you.

## Features

- **One-line integration** — `protect()` middleware for Express, with adapters
  for Next.js and Fastify.
- **Hosted checkout** — no payment UI to build.
- **Single-use access tokens** — issued on payment, verified on replay.
- **Provider-agnostic payments** — a mock provider for local development and a
  fully implemented Stripe provider (Checkout Sessions + signed webhooks).
- **Sub-cent pricing** — money is stored as integer micro-dollars for exact math.
- **Developer console** — projects, endpoints, API keys, request logs, and
  revenue analytics.
- **First-class DX** — a typed SDK, a CLI, and runnable examples.

## Tech stack

| Layer | Technology |
| --- | --- |
| Monorepo | pnpm workspaces + Turborepo |
| Language | TypeScript |
| Apps | Next.js 15 (App Router), React 19, Tailwind CSS |
| Database | PostgreSQL + Drizzle ORM |
| Auth | Clerk |
| Payments | Stripe (+ built-in mock provider) |
| Validation | Zod |

## Project structure

```
run402/
├── apps/
│   ├── web/           # Marketing site (Next.js)
│   ├── dashboard/     # Developer console — auth, projects, keys, analytics
│   └── docs/          # Documentation site
├── packages/
│   ├── config/        # Shared TypeScript / ESLint / Prettier / Tailwind config
│   ├── env/           # Typed environment validation (Zod)
│   ├── utils/         # Framework-agnostic helpers, types, errors
│   ├── logging/       # Structured logging
│   ├── database/      # Drizzle schema + client (PostgreSQL)
│   ├── payments/      # Provider-agnostic payments (mock, Stripe)
│   ├── ui/            # Shared component library
│   ├── sdk/           # Public typed API client (@run402/sdk)
│   ├── middleware/    # The `run402` middleware package
│   └── cli/           # The `run402` command-line tool
├── examples/          # Runnable Express / Next.js / Fastify integrations
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Getting started

Requires **Node 20+** and **pnpm 10+**.

```bash
pnpm install
cp .env.example .env          # fill in DATABASE_URL + Clerk keys
pnpm --filter @run402/database db:push   # apply schema to Postgres
pnpm dev                      # run every app via Turborepo
```

Apps run at: web → `:3000`, dashboard → `:3001`, docs → `:3002`.

### Run the full stack locally — zero external services

No Docker, no cloud account. An embedded Postgres boots from `tools/dev-db`:

```bash
node tools/dev-db/start.mjs &                 # Postgres 17 on :5432 (persistent)
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/run402
pnpm --filter @run402/database db:push        # create tables
pnpm --filter @run402/database db:seed        # demo project + endpoint + keys
```

`db:seed` prints a one-time secret key (`sk_live_…`). Point the middleware or CLI
at it (`RUN402_SECRET_KEY=…`) to drive a real `402 → pay → 200` flow against the
mock provider — settlement, single-use tokens, and request logging all run live.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run all apps in development |
| `pnpm build` | Build everything (topological, cached) |
| `pnpm typecheck` | Type-check every package and app |
| `pnpm lint` | Lint every package and app |
| `pnpm format` | Format with Prettier |
| `pnpm db:generate` | Generate SQL migrations from the schema |
| `pnpm db:migrate` | Apply migrations |
| `pnpm --filter @run402/database db:seed` | Seed a demo project + keys |

> `SKIP_ENV_VALIDATION=1` bypasses env validation for CI/Docker builds where
> secrets are injected at runtime.

## Payment providers

- **`mock`** (default) — in-memory settlement, single-use tokens, and
  idempotency. Everything runs end-to-end with no external account.
- **`stripe`** — real Stripe Checkout Sessions with signed-webhook settlement.
  Enable with `PAYMENTS_PROVIDER=stripe`, `STRIPE_SECRET_KEY`, and
  `STRIPE_WEBHOOK_SECRET`. Falls back to `mock` when unset.

The middleware runtime, token system, request logging, and revenue metering are
fully implemented against both providers.

## Documentation

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the design and the reasoning
behind the monorepo layout.

## License

Created and maintained by **Manoj**. Released under the
[MIT License](./LICENSE) — © 2026 Manoj.
