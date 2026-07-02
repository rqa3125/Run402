import { z, type ZodType } from "zod";

export interface CreateEnvOptions<
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
> {
  /** Server-only variables. Never exposed to the client bundle. */
  server?: TServer;
  /** Client variables. Every key must start with `clientPrefix`. */
  client?: TClient;
  /** Prefix required on all client variables (e.g. `NEXT_PUBLIC_`). */
  clientPrefix?: string;
  /** The raw source of values, usually `process.env`. */
  runtimeEnv: Record<string, string | undefined>;
}

type Infer<T extends Record<string, ZodType>> = {
  [K in keyof T]: z.infer<T[K]>;
};

const isServer =
  typeof (globalThis as { window?: unknown }).window === "undefined";

const shouldSkip =
  process.env.SKIP_ENV_VALIDATION === "1" ||
  process.env.SKIP_ENV_VALIDATION === "true";

/**
 * Validate environment variables once, at boot, with clear errors.
 *
 * - Server variables are only parsed on the server; accessing one in a client
 *   bundle throws, preventing accidental secret leakage.
 * - `SKIP_ENV_VALIDATION=1` bypasses parsing for Docker builds / CI where
 *   secrets are injected at runtime rather than build time.
 */
export function createEnv<
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
>(
  opts: CreateEnvOptions<TServer, TClient>,
): Readonly<Infer<TServer> & Infer<TClient>> {
  const { server = {}, client = {}, clientPrefix = "", runtimeEnv } = opts;

  for (const key of Object.keys(client)) {
    if (clientPrefix && !key.startsWith(clientPrefix)) {
      throw new Error(
        `[env] Client variable "${key}" must start with "${clientPrefix}".`,
      );
    }
  }

  if (shouldSkip) {
    return runtimeEnv as unknown as Readonly<Infer<TServer> & Infer<TClient>>;
  }

  // On the client, only client vars exist in the bundle — validating server
  // vars there would always fail. Server vars are validated server-side only.
  const schema = isServer
    ? z.object({ ...server, ...client } as TServer & TClient)
    : z.object(client as TClient);

  const parsed = schema.safeParse(runtimeEnv);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `[env] Invalid environment variables:\n${issues}\n` +
        `See .env.example for the expected shape.`,
    );
  }

  return new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      if (!isServer && prop in server && !(prop in client)) {
        throw new Error(
          `[env] Attempted to access server-only variable "${prop}" on the client.`,
        );
      }
      return Reflect.get(target, prop);
    },
  }) as Readonly<Infer<TServer> & Infer<TClient>>;
}
