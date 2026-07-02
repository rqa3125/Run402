import { describe, it, expect, vi, beforeEach } from "vitest";
import { protect } from "../src/express";
import { resolveConfig } from "../src/config";

interface FakeRes {
  statusCode: number;
  body: unknown;
  status(code: number): FakeRes;
  json(body: unknown): void;
}

function fakeRes(): FakeRes {
  return {
    statusCode: 0,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };
}

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), { status });

describe("resolveConfig", () => {
  it("throws when projectKey is missing", () => {
    expect(() => resolveConfig({ endpoint: "/x" } as never)).toThrow(/project key/i);
  });
  it("throws when endpoint is missing", () => {
    expect(() => resolveConfig({ projectKey: "pk" } as never)).toThrow(/endpoint/i);
  });
  it("applies defaults", () => {
    const c = resolveConfig({ projectKey: "pk", endpoint: "/x" });
    expect(c.baseUrl).toBe("http://localhost:3001");
    expect(c.tokenHeader).toBe("x-run402-token");
    expect(c.mode).toBe("payment");
  });
});

describe("protect() Express middleware", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("calls next() when the control plane allows the request", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ status: "paid" }, 200)));
    const mw = protect({ projectKey: "pk", endpoint: "/premium" });
    const next = vi.fn();
    await mw({ method: "GET", headers: {} }, fakeRes(), next);
    expect(next).toHaveBeenCalledOnce();
  });

  it("relays a 402 with payment_url when unpaid", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json({ error: "Payment Required", payment_url: "http://pay" }, 402)),
    );
    const mw = protect({ projectKey: "pk", endpoint: "/premium" });
    const res = fakeRes();
    const next = vi.fn();
    await mw({ method: "GET", headers: {} }, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(402);
    expect((res.body as { payment_url: string }).payment_url).toBe("http://pay");
  });

  it("relays token errors (e.g. 401 invalid_token)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json({ error: { code: "invalid_token" } }, 401)),
    );
    const mw = protect({ projectKey: "pk", endpoint: "/premium" });
    const res = fakeRes();
    await mw({ method: "GET", headers: { "x-run402-token": "bad" } }, res, vi.fn());
    expect(res.statusCode).toBe(401);
  });

  it("forwards the payment token from the request header", async () => {
    const fetchMock = vi.fn(async () => json({ status: "paid" }, 200));
    vi.stubGlobal("fetch", fetchMock);
    const mw = protect({ projectKey: "pk", endpoint: "/premium" });
    await mw({ method: "GET", headers: { "x-run402-token": "rt_abc" } }, fakeRes(), vi.fn());
    const sent = JSON.parse((fetchMock.mock.calls[0]![1] as { body: string }).body);
    expect(sent.token).toBe("rt_abc");
    expect(sent.projectKey).toBe("pk");
  });

  it("fails closed with 502 when the control plane is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    const mw = protect({ projectKey: "pk", endpoint: "/premium" });
    const res = fakeRes();
    await mw({ method: "GET", headers: {} }, res, vi.fn());
    expect(res.statusCode).toBe(502);
  });
});
