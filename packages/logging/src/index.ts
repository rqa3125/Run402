import { pino, type Logger } from "pino";

const level = process.env.LOG_LEVEL ?? "info";
const isProd = process.env.NODE_ENV === "production";

/**
 * Root logger. JSON in production (machine-parseable for log drains);
 * pretty-printed locally for readability. `pino-pretty` is loaded lazily and
 * only in development to avoid pulling it into production bundles.
 */
export const logger: Logger = pino({
  level,
  base: { service: "run402" },
  redact: {
    paths: [
      "*.password",
      "*.token",
      "*.secret",
      "*.authorization",
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    censor: "[redacted]",
  },
  ...(isProd
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:HH:MM:ss.l", ignore: "pid,hostname" },
        },
      }),
});

/** Create a child logger scoped to a module/subsystem. */
export function createLogger(name: string, bindings: Record<string, unknown> = {}): Logger {
  return logger.child({ module: name, ...bindings });
}

export interface RequestLogContext {
  requestId: string;
  method: string;
  path: string;
  userId?: string;
}

/** Child logger for a single HTTP request, carrying correlation fields. */
export function requestLogger(ctx: RequestLogContext): Logger {
  return logger.child({ scope: "http", ...ctx });
}

/** Normalise and log an unexpected error with structured context. */
export function logError(
  error: unknown,
  context: Record<string, unknown> = {},
  log: Logger = logger,
): void {
  const normalized =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { message: String(error) };
  log.error({ err: normalized, ...context }, normalized.message);
}

export type { Logger };
