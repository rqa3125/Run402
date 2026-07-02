import { describe, it, expect } from "vitest";
import { configSchema, configTemplate, CONFIG_FILENAME } from "../src/config";

describe("configSchema", () => {
  it("applies sensible defaults", () => {
    const cfg = configSchema.parse({ projectKey: "sk_x" });
    expect(cfg.environment).toBe("sandbox");
    expect(cfg.framework).toBe("express");
    expect(cfg.port).toBe(4000);
    expect(cfg.baseUrl).toBe("http://localhost:3001");
  });

  it("coerces the port to a number", () => {
    const cfg = configSchema.parse({ projectKey: "sk_x", port: "5000" });
    expect(cfg.port).toBe(5000);
  });

  it("rejects an invalid environment", () => {
    expect(() => configSchema.parse({ projectKey: "sk", environment: "prod" })).toThrow();
  });
});

describe("configTemplate", () => {
  it("renders a typed, env-backed config", () => {
    const code = configTemplate(
      configSchema.parse({ projectKey: "sk_x", framework: "next", port: 3000 }),
    );
    expect(code).toContain('import { defineConfig } from "run402"');
    expect(code).toContain("process.env.RUN402_SECRET_KEY");
    expect(code).not.toContain("sk_x"); // secret never hardcoded
    expect(code).toContain('framework: "next"');
    expect(code).toContain("port: 3000");
  });
});

describe("constants", () => {
  it("uses the expected config filename", () => {
    expect(CONFIG_FILENAME).toBe("run402.config.ts");
  });
});
