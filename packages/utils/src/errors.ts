/**
 * Typed application errors. Every expected failure maps to an HTTP status and
 * a stable machine-readable `code`, so API routes can serialise them uniformly
 * and clients/the SDK can branch on `code` rather than parsing messages.
 */

export type ErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "validation_error"
  | "rate_limited"
  | "internal_error";

export interface AppErrorOptions {
  code?: ErrorCode;
  status?: number;
  cause?: unknown;
  details?: unknown;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;
  /** Safe to surface to clients (vs. internal errors which are masked). */
  readonly expose: boolean;

  constructor(message: string, opts: AppErrorOptions = {}) {
    super(message, { cause: opts.cause });
    this.name = new.target.name;
    this.code = opts.code ?? "internal_error";
    this.status = opts.status ?? 500;
    this.details = opts.details;
    this.expose = this.status < 500;
    Error.captureStackTrace?.(this, new.target);
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.expose ? this.message : "Internal server error",
        ...(this.details ? { details: this.details } : {}),
      },
    };
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, { code: "bad_request", status: 400, details });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, { code: "unauthorized", status: 401 });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have access to this resource") {
    super(message, { code: "forbidden", status: 403 });
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, { code: "not_found", status: 404 });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists", details?: unknown) {
    super(message, { code: "conflict", status: 409, details });
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, { code: "validation_error", status: 422, details });
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests", details?: unknown) {
    super(message, { code: "rate_limited", status: 429, details });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
