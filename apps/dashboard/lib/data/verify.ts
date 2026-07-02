import { and, db, eq, schema } from "@run402/database";
import { getProjectByKey } from "./projects";
import {
  createPaymentForEndpoint,
  findToken,
  markTokenExpired,
  markTokenUsed,
} from "./payments";
import { writeRequestLog } from "./logs";

/**
 * The control-plane decision engine. The Express middleware POSTs here and
 * simply relays the returned status + body to its caller, so all policy
 * (endpoint lookup, token verification, payment creation) lives server-side and
 * is provider-agnostic.
 */

export interface VerifyInput {
  projectKey: string;
  method: string;
  path: string;
  token?: string | null;
}

export interface VerifyResult {
  httpStatus: number;
  body: Record<string, unknown>;
}

const errBody = (code: string, message: string) => ({ error: { code, message } });
const payBody = (error: string, payment_url: string, payment_id: string) => ({
  error,
  payment_url,
  payment_id,
});

export async function verifyRequest(input: VerifyInput): Promise<VerifyResult> {
  const started = Date.now();
  const method = input.method.toUpperCase();
  const path = input.path;

  // 1. Resolve project by secret or publishable key.
  const project = await getProjectByKey(input.projectKey);

  if (!project) {
    return { httpStatus: 401, body: errBody("invalid_key", "Invalid project key") };
  }

  const finish = async (
    httpStatus: number,
    body: Record<string, unknown>,
    endpointId: string | null,
    paymentStatus: string,
  ): Promise<VerifyResult> => {
    await writeRequestLog({
      projectId: project.id,
      endpointId,
      method,
      path,
      statusCode: httpStatus,
      paymentStatus,
      durationMs: Date.now() - started,
    });
    return { httpStatus, body };
  };

  // 2. Look up the registered endpoint (sandbox only for now).
  const endpoint = (
    await db
      .select()
      .from(schema.endpoint)
      .where(
        and(
          eq(schema.endpoint.projectId, project.id),
          eq(schema.endpoint.method, method as (typeof schema.httpMethod.enumValues)[number]),
          eq(schema.endpoint.path, path),
          eq(schema.endpoint.environment, "sandbox"),
        ),
      )
      .limit(1)
  )[0];

  if (!endpoint) {
    return finish(
      404,
      errBody("unknown_endpoint", `No sandbox endpoint registered for ${method} ${path}`),
      null,
      "unpaid",
    );
  }
  if (endpoint.status !== "active") {
    return finish(403, errBody("endpoint_disabled", "This endpoint is disabled"), endpoint.id, "unpaid");
  }

  // 3. Token presented → verify it.
  if (input.token) {
    const token = await findToken(input.token);
    if (!token) {
      return finish(401, errBody("invalid_token", "Invalid payment token"), endpoint.id, "error");
    }
    if (token.projectId !== project.id || token.endpointId !== endpoint.id) {
      return finish(403, errBody("token_mismatch", "Token is not valid for this endpoint"), endpoint.id, "error");
    }
    if (token.status !== "valid" || token.expiresAt < new Date()) {
      await markTokenExpired(input.token);
      const payment = await createPaymentForEndpoint(project, endpoint);
      return finish(
        402,
        payBody("Payment token expired", payment.checkoutUrl, payment.paymentId),
        endpoint.id,
        "expired",
      );
    }
    // Valid → consume (single-use) and allow.
    await markTokenUsed(input.token);
    return finish(200, { status: "paid" }, endpoint.id, "paid");
  }

  // 4. No token → require payment.
  const payment = await createPaymentForEndpoint(project, endpoint);
  return finish(
    402,
    payBody("Payment Required", payment.checkoutUrl, payment.paymentId),
    endpoint.id,
    "unpaid",
  );
}
