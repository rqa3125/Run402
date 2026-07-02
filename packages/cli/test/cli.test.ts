import { describe, it, expect } from "vitest";
import { buildProgram } from "../src/cli";

describe("buildProgram", () => {
  it("registers every documented command", () => {
    const names = buildProgram()
      .commands.map((c) => c.name())
      .sort();
    expect(names).toEqual(
      ["dev", "doctor", "init", "login", "logs", "status", "test", "version"].sort(),
    );
  });

  it("names the program run402 and exposes a version", () => {
    const program = buildProgram();
    expect(program.name()).toBe("run402");
    expect(program.version()).toBeTruthy();
  });

  it("declares filter options on `logs`", () => {
    const logs = buildProgram().commands.find((c) => c.name() === "logs")!;
    const flags = logs.options.map((o) => o.long);
    expect(flags).toContain("--limit");
    expect(flags).toContain("--status");
  });
});
