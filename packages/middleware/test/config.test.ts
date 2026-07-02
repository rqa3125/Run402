import { describe, it, expect } from "vitest";
import { parsePrice, resolveConfig, defineConfig } from "../src/config";
import { Run402Error } from "../src/errors";

describe("parsePrice", () => {
  it("parses dollar strings and numbers to cents", () => {
    expect(parsePrice("$0.50")).toBe(50);
    expect(parsePrice("1.25")).toBe(125);
    expect(parsePrice(0.5)).toBe(50);
    expect(parsePrice(undefined)).toBeUndefined();
  });
  it("rejects negative / invalid prices", () => {
    expect(() => parsePrice(-1)).toThrow(Run402Error);
    expect(() => parsePrice("abc")).toThrow(Run402Error);
  });
});

describe("resolveConfig (new options)", () => {
  it("normalizes price to cents", () => {
    const c = resolveConfig({ projectKey: "sk", endpoint: "/x", price: "$0.50" });
    expect(c.priceCents).toBe(50);
  });
  it("rejects subscription mode with a helpful error", () => {
    expect(() =>
      resolveConfig({ projectKey: "sk", endpoint: "/x", mode: "subscription" }),
    ).toThrow(/subscription/i);
  });
  it("carries successUrl / cancelUrl through", () => {
    const c = resolveConfig({
      projectKey: "sk",
      endpoint: "/x",
      successUrl: "http://ok",
      cancelUrl: "http://no",
    });
    expect(c.successUrl).toBe("http://ok");
    expect(c.cancelUrl).toBe("http://no");
  });
});

describe("Run402Error.format", () => {
  it("renders what / fix / docs", () => {
    const err = new Run402Error({
      code: "x",
      what: "Boom",
      fix: "Do the thing",
      docs: "middleware",
    });
    const out = err.format();
    expect(out).toContain("Boom");
    expect(out).toContain("Do the thing");
    expect(out).toContain("docs.run402.com/middleware");
  });
});

describe("defineConfig", () => {
  it("returns the config unchanged (identity helper)", () => {
    const cfg = defineConfig({ projectKey: "sk", environment: "sandbox", port: 4000 });
    expect(cfg.port).toBe(4000);
  });
});
