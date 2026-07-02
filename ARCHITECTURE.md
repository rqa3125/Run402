# Architecture

The decisions behind the Run402 foundation, and the reasoning for each.

## 1. Monorepo: pnpm workspaces + Turborepo

- **pnpm** for content-addressed, symlinked installs — fast, disk-efficient, and
  strict (a package can only import what it declares). Strictness caught real
  bugs during setup (e.g. the dashboard importing `better-auth` transitively).
- **Turborepo** for the task graph: `build`, `typecheck`, `lint`, `db:*` run in
  topological order with caching. `turbo.json` declares `dependsOn: ["^build"]`
  and per-task `outputs`, which makes local runs incremental and unlocks remote
  caching later with zero code changes.
- **Package-first**: apps are thin. Everything reusable (auth, db, payments,
  logging, env, ui, utils) is a package, so a second app (docs, an admin panel,
  a worker) composes the same primitives instead of copy-pasting.

## 2. Shared configuration (`packages/config`)

One package owns TypeScript, ESLint, Prettier and the Tailwind preset. Apps
extend, never redefine. Changing a lint rule or a design token is a one-line
edit that propagates everywhere. TS bases are layered: `base` → `react-library`
/ `nextjs`, so a Node package and a Next app share strictness but differ on
`jsx`/`moduleResolution`.

Internal packages are **consumed as source** (`transpilePackages` in Next), not
prebuilt to `dist`. This removes a build step from the inner loop and is why a
few packages disable `.d.ts` emission — the consumer compiles them.

## 3. Environment validation (`packages/env`)

A tiny in-house `createEnv` (Zod) instead of a dependency. It validates once at
boot, fails with a readable list of problems, and — critically — only validates
**server** variables on the server. Accessing a server secret from client code
throws. `SKIP_ENV_VALIDATION=1` bypasses validation for Docker/CI builds where
secrets are injected at runtime. Apps compose their own schema from shared field
schemas so validation is identical everywhere.

## 4. Database (`packages/database`)

- **Drizzle ORM** — typed SQL without a heavy runtime; schema is TypeScript, so
  row types (`Project`, `User`, …) are inferred and shared.
- **Schema split by domain**: `auth` (Better Auth contract), `organization`
  (multi-tenancy), `project` (our domain), `relations` (typed query API).
- **Multi-tenant from day one**: an `organization` is the ownership/billing
  boundary; every domain row references it and every query is scoped by
  `organizationId`. Retrofitting tenancy later is painful; modelling it now is
  nearly free.
- **postgres.js** client, a singleton cached on `globalThis` to survive HMR,
  `prepare: false` for Supabase's transaction pooler.

## 5. Auth (`packages/auth`)

Better Auth with the Drizzle adapter and the organization plugin. The package
exposes four seams: `/server` (the instance), `/client` (React hooks), `/next`
(route handlers), `/session` (framework-agnostic `requireSession` /
`requireActiveOrganization`). Session helpers take a `Headers` object rather than
importing `next/headers`, so they work in any runtime; the dashboard adapts them
to Next's async `headers()` in `lib/auth.ts`. **Route protection is done in
server components/layouts** (redirect on no session) — Next middleware is
intentionally deferred per scope.

## 6. Payments (`packages/payments`)

A `PaymentProvider` interface with three implementations planned: `MockProvider`
(offline dev/tests, fully working), `StripeProvider` (client constructed, method
bodies deferred), and future `x402`. A `createPaymentProvider(config)` factory
selects one at runtime. The rest of the platform depends only on the interface —
**no vendor SDK leaks into app code** — so adding a provider never touches a call
site. No business logic yet, by design.

## 7. UI (`packages/ui`)

shadcn/ui conventions (Radix + CVA + `cn`) as a shared library with design
tokens as CSS variables. The dashboard and docs import the same components and
the same Tailwind preset, so the whole product is visually consistent. Tokens
live in CSS variables so each app owns its light/dark themes.

## 8. SDK & middleware (`packages/sdk`, `packages/middleware`)

- **SDK**: a dependency-light, publishable typed HTTP client (transport built,
  resource endpoints declared). Independent of workspace packages so it can ship
  to npm untouched.
- **middleware** (`run402`): the public package. Scaffolded with a stable
  surface (`protect`, `ProtectOptions`) and per-framework adapter entry points
  (`run402/express`, `run402/next`). Runtime deferred per scope; the shape is
  fixed so integration docs can be written today.

## 9. Error handling & logging

- **Typed errors** (`@run402/utils/errors`): `AppError` subclasses each carry an
  HTTP status + stable `code`. `expose` masks 5xx messages from clients.
- **API wrapper** (`lib/api/handler.ts`): every route runs through `apiHandler`,
  which attaches a request id, logs structured start/finish, and serializes
  errors uniformly (`AppError` → its status, `ZodError` → 422, everything else →
  masked 500). Handlers throw typed errors; they never format responses.
- **Logging** (`@run402/logging`): pino — JSON in prod, pretty in dev, with
  secret redaction and per-request child loggers carrying the correlation id.

## 10. Dashboard app structure

Route groups separate concerns: `(auth)` (public, redirects if signed in) and
`(dashboard)` (protected shell with sidebar + top nav). Data access lives in
`lib/data/*` (the projects slice is the reference pattern); routes/actions call
it and never touch Drizzle directly. Validation schemas (`lib/validations/*`)
are shared by React Hook Form on the client and the API route on the server —
one source of truth for shape.

## What is intentionally NOT built

Payment logic, the middleware runtime, metering/usage, and API-key issuance.
The seams exist; the business logic is the next phase.
