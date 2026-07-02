import {
  db,
  desc,
  eq,
  schema,
  type Payment,
  type PaymentToken,
} from "@run402/database";
import { assertProjectOwnership } from "./projects";

/**
 * Read-only queries backing the internal API Explorer. Everything is
 * ownership-scoped; payment tokens are masked before leaving the server
 * (they are bearer capabilities).
 */

export async function listPayments(
  userId: string,
  projectId: string,
  limit = 50,
): Promise<Payment[]> {
  await assertProjectOwnership(userId, projectId);
  return db
    .select()
    .from(schema.payment)
    .where(eq(schema.payment.projectId, projectId))
    .orderBy(desc(schema.payment.createdAt))
    .limit(limit);
}

export type MaskedToken = Omit<PaymentToken, "token"> & { token: string };

export async function listPaymentTokens(
  userId: string,
  projectId: string,
  limit = 50,
): Promise<MaskedToken[]> {
  await assertProjectOwnership(userId, projectId);
  const rows = await db
    .select()
    .from(schema.paymentToken)
    .where(eq(schema.paymentToken.projectId, projectId))
    .orderBy(desc(schema.paymentToken.createdAt))
    .limit(limit);
  // Mask the bearer value — the explorer is for inspection, not extraction.
  return rows.map((t) => ({ ...t, token: `${t.token.slice(0, 10)}…` }));
}
