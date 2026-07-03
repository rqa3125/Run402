import { and, db, desc, eq, gt, lt, schema } from "@run402/database";
import type { Endpoint, Payment, Project } from "@run402/database";
import { rawId } from "@run402/utils";
import { paymentProvider, asMock, checkoutBaseUrl } from "@/lib/payments";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

const checkoutUrlFor = (paymentId: string) =>
  `${checkoutBaseUrl.replace(/\/$/, "")}/mock-checkout?payment=${paymentId}`;

/**
 * Create a pending payment for an endpoint. Idempotent for rapid 402s: an
 * existing pending, unexpired payment for the same endpoint is reused instead
 * of minting a new one. Stale pending payments are expired opportunistically.
 */
export async function createPaymentForEndpoint(
  project: Pick<Project, "id" | "currency">,
  endpoint: Pick<Endpoint, "id" | "price">,
): Promise<{ paymentId: string; checkoutUrl: string }> {
  const now = new Date();

  // Idempotency only applies to the mock provider, whose checkout URL is
  // deterministic. Stripe mints a fresh session per attempt.
  if (paymentProvider.name === "mock") {
    const reusable = (
      await db
        .select({ id: schema.payment.id })
        .from(schema.payment)
        .where(
          and(
            eq(schema.payment.projectId, project.id),
            eq(schema.payment.endpointId, endpoint.id),
            eq(schema.payment.status, "pending"),
            gt(schema.payment.expiresAt, now),
          ),
        )
        .orderBy(desc(schema.payment.createdAt))
        .limit(1)
    )[0];

    if (reusable) {
      return { paymentId: reusable.id, checkoutUrl: checkoutUrlFor(reusable.id) };
    }
  }

  // Expire any stale pending payments for this endpoint (best-effort cleanup).
  await db
    .update(schema.payment)
    .set({ status: "expired", updatedAt: now })
    .where(
      and(
        eq(schema.payment.projectId, project.id),
        eq(schema.payment.endpointId, endpoint.id),
        eq(schema.payment.status, "pending"),
        lt(schema.payment.expiresAt, now),
      ),
    );

  const payment = await paymentProvider.createPayment({
    amount: endpoint.price,
    currency: project.currency,
    checkoutBaseUrl,
    metadata: { projectId: project.id, endpointId: endpoint.id },
  });

  await db.insert(schema.payment).values({
    id: payment.id,
    projectId: project.id,
    endpointId: endpoint.id,
    amount: payment.amount,
    currency: payment.currency,
    status: "pending",
    provider: paymentProvider.name,
    environment: "sandbox",
    expiresAt: new Date(payment.expiresAt),
  });

  return { paymentId: payment.id, checkoutUrl: payment.checkoutUrl };
}

export interface CheckoutDetails {
  paymentId: string;
  status: Payment["status"];
  amount: number;
  currency: string;
  projectName: string;
  projectUserId: string;
  endpointName: string;
  endpointMethod: string;
  endpointPath: string;
  expiresAt: Date;
}

/** Public: fetch checkout details by payment id (the id is the capability). */
export async function getCheckoutDetails(
  paymentId: string,
): Promise<CheckoutDetails | null> {
  const rows = await db
    .select({
      paymentId: schema.payment.id,
      status: schema.payment.status,
      amount: schema.payment.amount,
      currency: schema.payment.currency,
      expiresAt: schema.payment.expiresAt,
      projectName: schema.project.name,
      projectUserId: schema.project.userId,
      endpointName: schema.endpoint.name,
      endpointMethod: schema.endpoint.method,
      endpointPath: schema.endpoint.path,
    })
    .from(schema.payment)
    .innerJoin(schema.project, eq(schema.payment.projectId, schema.project.id))
    .innerJoin(schema.endpoint, eq(schema.payment.endpointId, schema.endpoint.id))
    .where(eq(schema.payment.id, paymentId))
    .limit(1);
  return rows[0] ?? null;
}

export interface CompletePaymentResult {
  ok: boolean;
  token?: string;
  reason?: "not_found" | "expired" | "already_done";
}

/**
 * Complete a mock payment: mark it paid and issue a single-use access token.
 * The database is authoritative; the provider's `complete()` is best-effort
 * (its in-memory state may be gone after a restart).
 */
export async function completePayment(
  paymentId: string,
): Promise<CompletePaymentResult> {
  const rows = await db
    .select()
    .from(schema.payment)
    .where(eq(schema.payment.id, paymentId))
    .limit(1);
  const payment = rows[0];
  if (!payment) return { ok: false, reason: "not_found" };
  if (payment.status === "expired" || payment.expiresAt < new Date()) {
    await db
      .update(schema.payment)
      .set({ status: "expired", updatedAt: new Date() })
      .where(eq(schema.payment.id, paymentId));
    return { ok: false, reason: "expired" };
  }
  if (payment.status !== "pending") return { ok: false, reason: "already_done" };

  // Best-effort provider simulation.
  await asMock()?.complete(paymentId).catch(() => undefined);

  const token = `rt_${rawId()}`;
  await db.transaction(async (tx) => {
    await tx
      .update(schema.payment)
      .set({ status: "paid", updatedAt: new Date() })
      .where(eq(schema.payment.id, paymentId));
    await tx.insert(schema.paymentToken).values({
      token,
      projectId: payment.projectId,
      endpointId: payment.endpointId,
      paymentId,
      status: "valid",
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    });
  });

  return { ok: true, token };
}

/** Look up a token row (or null). */
export async function findToken(token: string) {
  const rows = await db
    .select()
    .from(schema.paymentToken)
    .where(eq(schema.paymentToken.token, token))
    .limit(1);
  return rows[0] ?? null;
}

export async function markTokenUsed(token: string): Promise<void> {
  await db
    .update(schema.paymentToken)
    .set({ status: "used" })
    .where(eq(schema.paymentToken.token, token));
}

/**
 * The valid token issued for a paid payment, if any. Used by the redirect
 * (Stripe) flow: after checkout the client polls this with the payment id.
 */
export async function getTokenForPayment(paymentId: string): Promise<string | null> {
  const rows = await db
    .select({ token: schema.paymentToken.token, status: schema.paymentToken.status })
    .from(schema.paymentToken)
    .where(eq(schema.paymentToken.paymentId, paymentId))
    .orderBy(desc(schema.paymentToken.createdAt))
    .limit(1);
  const row = rows[0];
  if (!row || row.status !== "valid") return null;
  return row.token;
}

export async function markTokenExpired(token: string): Promise<void> {
  await db
    .update(schema.paymentToken)
    .set({ status: "expired" })
    .where(
      and(
        eq(schema.paymentToken.token, token),
        eq(schema.paymentToken.status, "valid"),
      ),
    );
}
