# Run402

The easiest way to monetize APIs. Production monorepo powered by pnpm workspaces + Turborepo.

> **Owned and maintained by Manoj.** © 2026 Manoj — released under the [MIT License](./LICENSE).

## Structure

```
run402/
├── apps/
│   ├── web/          # Marketing site (Next.js)
│   ├── dashboard/    # SaaS dashboard (Next.js, auth, projects, billing)
│   └── docs/         # Documentation site (Next.js)
├── packages/
│   ├── config/       # Shared TS / ESLint / Prettier / Tailwind config
│   ├── env/          # Typed environment validation (Zod)
│   ├── utils/        # Framework-agnostic helpers, types, errors
│   ├── logging/      # Structured logging (pino)
│   ├── database/     # Drizzle schema + client (PostgreSQL)
│   ├── auth/         # Better Auth config, client, session helpers
│   ├── payments/     # Provider-agnostic payments (mock, Stripe, future x402)
│   ├── ui/           # Shared component library (shadcn/ui conventions)
│   ├── sdk/          # Public typed API client (@run402/sdk)
│   └── middleware/   # Public `run402` middleware package (scaffold)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Getting started

```bash
pnpm install
cp .env.example .env          # fill in DATABASE_URL + Clerk keys
pnpm --filter @run402/database db:push   # apply schema to Postgres
pnpm dev                       # runs every app via Turborepo
```

Apps: web → `:3000`, dashboard → `:3001`, docs → `:3002`.

### Run the full stack locally (zero external services)

No Docker, no cloud account — an embedded Postgres boots from `tools/dev-db`:

```bash
node tools/dev-db/start.mjs &                 # Postgres 17 on :5432 (persistent)
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/run402
pnpm --filter @run402/database db:push        # create tables
pnpm --filter @run402/database db:seed        # demo project + endpoint + keys
```

`db:seed` prints a one-time `secretKey` (`sk_live_…`). Point the middleware or CLI
at it (`RUN402_SECRET_KEY=…`) to drive a real 402 → pay → 200 flow against the
mock provider — settlement, single-use tokens, and request logging are all live.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run all apps in dev |
| `pnpm build` | Build everything (topological, cached) |
| `pnpm typecheck` | Type-check every package/app |
| `pnpm lint` | Lint every package/app |
| `pnpm format` | Prettier write |
| `pnpm db:generate` | Generate SQL migrations from schema |
| `pnpm db:migrate` | Apply migrations |
| `pnpm --filter @run402/database db:seed` | Seed a demo project + keys |

> `SKIP_ENV_VALIDATION=1` bypasses env validation for CI/Docker builds where
> secrets are injected at runtime.

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the reasoning behind the design.

## Payment providers

- **`mock`** (default) — in-memory settlement, single-use tokens, idempotency.
  Everything runs end-to-end with no external account.
- **`stripe`** — real Stripe Checkout Sessions + webhook settlement. Code-complete
  and env-gated: set `PAYMENTS_PROVIDER=stripe`, `STRIPE_SECRET_KEY`, and
  `STRIPE_WEBHOOK_SECRET`. Falls back to `mock` when unset.

The `run402` middleware runtime, token system, request logging, and revenue
metering are fully implemented against both providers.

## Author & License

Created and owned by **Manoj**. Licensed under the [MIT License](./LICENSE) — © 2026 Manoj.
