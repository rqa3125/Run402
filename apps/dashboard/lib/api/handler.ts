import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { AppError, ValidationError, isAppError } from "@run402/utils/errors";
import { logError, requestLogger, type Logger } from "@run402/logging";

export interface ApiContext {
  requestId: string;
  log: Logger;
}

type RouteHandler<C> = (
  req: NextRequest,
  api: ApiContext,
  ctx: C,
) => Promise<Response> | Response;

/**
 * Wraps a route handler with:
 *  - a per-request correlation id (`x-request-id`)
 *  - structured request logging
 *  - uniform error serialization (AppError → its status; ZodError → 422;
 *    everything else → masked 500)
 *
 * Handlers throw typed errors from `@run402/utils/errors`; they never format
 * error responses themselves.
 */
export function apiHandler<C = unknown>(handler: RouteHandler<C>) {
  return async (req: NextRequest, ctx: C): Promise<Response> => {
    const requestId = crypto.randomUUID();
    const url = new URL(req.url);
    const log = requestLogger({
      requestId,
      method: req.method,
      path: url.pathname,
    });

    const started = Date.now();
    try {
      const res = await handler(req, { requestId, log }, ctx);
      res.headers.set("x-request-id", requestId);
      log.info({ status: res.status, ms: Date.now() - started }, "request completed");
      return res;
    } catch (error) {
      return handleError(error, requestId, log);
    }
  };
}

function handleError(error: unknown, requestId: string, log: Logger): NextResponse {
  const headers = { "x-request-id": requestId };

  if (error instanceof ZodError) {
    const appError = new ValidationError("Invalid request", error.flatten());
    log.warn({ code: appError.code }, "validation failed");
    return NextResponse.json(appError.toJSON(), { status: appError.status, headers });
  }

  if (isAppError(error)) {
    const level = error.status >= 500 ? "error" : "warn";
    log[level]({ code: error.code, status: error.status }, error.message);
    return NextResponse.json(error.toJSON(), { status: error.status, headers });
  }

  logError(error, { requestId }, log);
  const fallback = new AppError("Internal server error");
  return NextResponse.json(fallback.toJSON(), { status: 500, headers });
}
