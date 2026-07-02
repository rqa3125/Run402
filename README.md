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
cp .env.example .env          # fill in DATABASE_URL + BETTER_AUTH_SECRET
pnpm --filter @run402/database db:push   # apply schema to Postgres
pnpm dev                       # runs every app via Turborepo
```

Apps: web → `:3000`, dashboard → `:3001`, docs → `:3002`.

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

> `SKIP_ENV_VALIDATION=1` bypasses env validation for CI/Docker builds where
> secrets are injected at runtime.

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the reasoning behind the design.

## Not implemented yet (by design)

- Payment business logic (`@run402/payments` defines the seams only)
- The `run402` middleware runtime (scaffold + adapters only)
- Metering / usage / API-key issuance logic

## Author & License

Created and owned by **Manoj**. Licensed under the [MIT License](./LICENSE) — © 2026 Manoj.
