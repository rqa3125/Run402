import { newId } from "@run402/utils/id";
import type {
  CreatePaymentInput,
  Payment,
  PaymentProvider,
} from "../types";

const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour

/**
 * In-memory payment provider for local development and tests. Deterministic,
 * offline, no network. State lives in a process-local Map — the control plane
 * mirrors payments to the database for durability, so a restart never loses a
 * completed payment or its token.
 *
 * Beyond the shared interface it exposes `complete()` and `expire()` — the
 * levers the mock checkout page pulls to simulate a payment succeeding.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock" as const;
  private readonly store = new Map<string, Payment>();

  private touchExpiry(payment: Payment): Payment {
    if (payment.status === "pending" && Date.now() > payment.expiresAt) {
      const expired = { ...payment, status: "expired" as const };
      this.store.set(payment.id, expired);
      return expired;
    }
    return payment;
  }

  async createPayment(input: CreatePaymentInput): Promise<Payment> {
    const now = Date.now();
    const id = newId("payment");
    const payment: Payment = {
      id,
      status: "pending",
      amount: input.amount,
      currency: input.currency,
      checkoutUrl: `${input.checkoutBaseUrl.replace(/\/$/, "")}/mock-checkout?payment=${id}`,
      metadata: input.metadata ?? {},
      createdAt: now,
      expiresAt: now + (input.expiresInMs ?? DEFAULT_TTL),
    };
    this.store.set(id, payment);
    return payment;
  }

  async verifyPayment(paymentId: string): Promise<Payment> {
    const payment = this.store.get(paymentId);
    if (!payment) throw new Error(`[payments] Unknown payment: ${paymentId}`);
    return this.touchExpiry(payment);
  }

  async refund(paymentId: string): Promise<Payment> {
    const payment = this.store.get(paymentId);
    if (!payment) throw new Error(`[payments] Unknown payment: ${paymentId}`);
    if (payment.status !== "paid") {
      throw new Error("[payments] Only paid payments can be refunded");
    }
    const refunded = { ...payment, status: "refunded" as const };
    this.store.set(paymentId, refunded);
    return refunded;
  }

  // ---- mock-only levers ----------------------------------------------------

  /** Mark a pending payment as paid (what the mock checkout "Pay" triggers). */
  async complete(paymentId: string): Promise<Payment> {
    const payment = this.store.get(paymentId);
    if (!payment) throw new Error(`[payments] Unknown payment: ${paymentId}`);
    const checked = this.touchExpiry(payment);
    if (checked.status === "expired") {
      throw new Error("[payments] Payment has expired");
    }
    const paid = { ...checked, status: "paid" as const };
    this.store.set(paymentId, paid);
    return paid;
  }

  /** Force-expire a payment (for tests / manual expiry). */
  async expire(paymentId: string): Promise<Payment> {
    const payment = this.store.get(paymentId);
    if (!payment) throw new Error(`[payments] Unknown payment: ${paymentId}`);
    const expired = { ...payment, status: "expired" as const };
    this.store.set(paymentId, expired);
    return expired;
  }

  /** Test helper — clear all state. */
  reset(): void {
    this.store.clear();
  }
}
