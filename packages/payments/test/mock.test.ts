import { describe, it, expect, beforeEach } from "vitest";
import { MockPaymentProvider } from "../src/providers/mock";

const base = { amount: 500_000, currency: "usd", checkoutBaseUrl: "http://localhost:3001" };

describe("MockPaymentProvider", () => {
  let provider: MockPaymentProvider;
  beforeEach(() => {
    provider = new MockPaymentProvider();
  });

  it("creates a pending payment with a hosted checkout url", async () => {
    const payment = await provider.createPayment(base);
    expect(payment.status).toBe("pending");
    expect(payment.amount).toBe(500_000);
    expect(payment.checkoutUrl).toBe(
      `http://localhost:3001/mock-checkout?payment=${payment.id}`,
    );
    expect(payment.expiresAt).toBeGreaterThan(payment.createdAt);
  });

  it("completes a payment and verifies it as paid", async () => {
    const created = await provider.createPayment(base);
    const completed = await provider.complete(created.id);
    expect(completed.status).toBe("paid");
    expect((await provider.verifyPayment(created.id)).status).toBe("paid");
  });

  it("refunds a paid payment but not an unpaid one", async () => {
    const created = await provider.createPayment(base);
    await expect(provider.refund(created.id)).rejects.toThrow();
    await provider.complete(created.id);
    expect((await provider.refund(created.id)).status).toBe("refunded");
  });

  it("lazily expires a payment past its TTL", async () => {
    const created = await provider.createPayment({ ...base, expiresInMs: -1 });
    expect((await provider.verifyPayment(created.id)).status).toBe("expired");
  });

  it("cannot complete an expired payment", async () => {
    const created = await provider.createPayment({ ...base, expiresInMs: -1 });
    await expect(provider.complete(created.id)).rejects.toThrow(/expired/);
  });

  it("throws for unknown payment ids", async () => {
    await expect(provider.verifyPayment("pay_nope")).rejects.toThrow(/Unknown/);
  });
});
