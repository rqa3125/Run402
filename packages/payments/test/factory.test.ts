import { describe, it, expect } from "vitest";
import { createPaymentProvider } from "../src/factory";
import { MockPaymentProvider } from "../src/providers/mock";
import { StripePaymentProvider } from "../src/providers/stripe";

describe("createPaymentProvider", () => {
  it("returns the mock provider by default", () => {
    const p = createPaymentProvider({ provider: "mock" });
    expect(p).toBeInstanceOf(MockPaymentProvider);
    expect(p.name).toBe("mock");
    expect(p.verifyWebhook).toBeUndefined(); // mock settles synchronously
  });

  it("returns a configured Stripe provider", () => {
    const p = createPaymentProvider({
      provider: "stripe",
      stripe: { apiKey: "sk_test_x", webhookSecret: "whsec_x" },
    });
    expect(p).toBeInstanceOf(StripePaymentProvider);
    expect(p.name).toBe("stripe");
    expect(typeof p.verifyWebhook).toBe("function"); // async settlement
  });

  it("throws when Stripe is selected without a key", () => {
    expect(() => createPaymentProvider({ provider: "stripe" })).toThrow(/STRIPE_SECRET_KEY/);
  });

  it("throws for the not-yet-available x402 provider", () => {
    expect(() => createPaymentProvider({ provider: "x402" })).toThrow(/x402/);
  });
});

describe("StripePaymentProvider", () => {
  it("rejects webhook verification without a secret", async () => {
    const p = new StripePaymentProvider({ apiKey: "sk_test_x" });
    await expect(p.verifyWebhook("{}", "sig")).rejects.toThrow(/WEBHOOK_SECRET/);
  });
});
