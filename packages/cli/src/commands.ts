import * as p from "@clack/prompts";
import {
  checkHealth,
  fetchSummary,
  payPayment,
  verifyRequest,
  type CliSummary,
} from "./api";
import {
  configExists,
  configSchema,
  loadConfig,
  resolveContext,
  saveCredentials,
  writeConfig,
} from "./config";
import { requireContext } from "./context";
import {
  banner,
  brand,
  color,
  fail,
  formatMicro,
  info,
  keyValue,
  methodColor,
  statusColor,
  success,
  symbols,
  VERSION,
  warn,
} from "./ui";

/** Exit cleanly if the user cancels a clack prompt. */
function ensure<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }
  return value as T;
}

/* ------------------------------- version -------------------------------- */

export function versionCommand(): void {
  process.stdout.write(`${brand("run402")} ${color.dim(`v${VERSION}`)}\n`);
  process.stdout.write(`${color.dim("node".padEnd(7))}${process.versions.node}\n`);
}

/* --------------------------------- init --------------------------------- */

export async function initCommand(): Promise<void> {
  p.intro(color.inverse(" run402 init "));

  if (configExists()) {
    const overwrite = ensure(
      await p.confirm({
        message: "run402.config.ts already exists. Overwrite it?",
        initialValue: false,
      }),
    );
    if (!overwrite) {
      p.cancel("Kept existing config.");
      return;
    }
  }

  ensure(await p.text({ message: "Project name", placeholder: "My API" }));

  const environment = ensure(
    await p.select({
      message: "Environment",
      initialValue: "sandbox",
      options: [
        { value: "sandbox", label: "Sandbox" },
        { value: "live", label: "Live", hint: "coming soon" },
      ],
    }),
  ) as "sandbox" | "live";

  const framework = ensure(
    await p.select({
      message: "Framework",
      initialValue: "express",
      options: [
        { value: "express", label: "Express" },
        { value: "next", label: "Next.js" },
        { value: "fastify", label: "Fastify", hint: "placeholder" },
      ],
    }),
  ) as "express" | "next" | "fastify";

  const port = ensure(
    await p.text({
      message: "Local dev port",
      initialValue: "4000",
      validate: (v) => (/^\d+$/.test(v) ? undefined : "Enter a number"),
    }),
  );

  const secretKey = ensure(
    await p.password({
      message: "Secret key (sk_…) — optional, press enter to skip",
    }),
  );

  const s = p.spinner();
  s.start("Writing run402.config.ts");
  const cfg = configSchema.parse({
    projectKey: secretKey,
    environment,
    framework,
    port,
    baseUrl: "http://localhost:3001",
  });
  await writeConfig(cfg);
  if (secretKey) await saveCredentials({ projectKey: secretKey, baseUrl: cfg.baseUrl });
  s.stop(`${symbols.ok} Created run402.config.ts`);

  p.note(
    [
      `${color.dim("1.")} export RUN402_SECRET_KEY=sk_…`,
      `${color.dim("2.")} run402 doctor`,
      `${color.dim("3.")} run402 dev`,
    ].join("\n"),
    "Next steps",
  );
  p.outro(`${brand()} is ready 🎉`);
}

/* -------------------------------- login --------------------------------- */

export async function loginCommand(): Promise<void> {
  p.intro(color.inverse(" run402 login "));

  const baseUrl = ensure(
    await p.text({
      message: "Run402 control-plane URL",
      initialValue: "http://localhost:3001",
    }),
  );
  const secretKey = ensure(
    await p.password({ message: "Secret key (sk_…)" }),
  );

  const s = p.spinner();
  s.start("Verifying credentials");
  if (!(await checkHealth(baseUrl))) {
    s.stop(color.red("Could not reach the control plane."));
    info(`Is the dashboard running at ${baseUrl}?`);
    process.exitCode = 1;
    return;
  }
  try {
    await fetchSummary({ projectKey: secretKey, baseUrl, source: "env" });
  } catch {
    s.stop(color.red("That key was rejected."));
    process.exitCode = 1;
    return;
  }
  await saveCredentials({ projectKey: secretKey, baseUrl });
  s.stop(`${symbols.ok} Logged in`);
  p.outro(`Credentials saved to ${color.dim("~/.run402/credentials.json")}`);
}

/* -------------------------------- doctor -------------------------------- */

type Check = { label: string; status: "ok" | "warn" | "error"; detail: string };

export async function doctorCommand(): Promise<void> {
  banner("run402 doctor", ["Running diagnostics…"]);
  const checks: Check[] = [];

  const nodeMajor = Number(process.versions.node.split(".")[0]);
  checks.push({
    label: "Node version",
    status: nodeMajor >= 18 ? "ok" : "error",
    detail: `${process.versions.node}${nodeMajor >= 18 ? "" : " (needs ≥ 18)"}`,
  });

  const cfg = await loadConfig();
  checks.push({
    label: "run402.config.ts",
    status: cfg ? "ok" : "warn",
    detail: cfg ? "found" : "missing — run `run402 init`",
  });

  const ctx = await resolveContext();
  checks.push({
    label: "Project key",
    status: ctx ? "ok" : "error",
    detail: ctx ? `resolved from ${ctx.source}` : "not set",
  });

  checks.push({
    label: "RUN402_SECRET_KEY",
    status: process.env.RUN402_SECRET_KEY ? "ok" : "warn",
    detail: process.env.RUN402_SECRET_KEY ? "set" : "not set (using config/login)",
  });

  if (ctx) {
    const healthy = await checkHealth(ctx.baseUrl);
    checks.push({
      label: "Control plane",
      status: healthy ? "ok" : "error",
      detail: healthy ? ctx.baseUrl : `unreachable: ${ctx.baseUrl}`,
    });
    if (healthy) {
      try {
        const summary = await fetchSummary(ctx);
        checks.push({
          label: "Project",
          status: "ok",
          detail: `${summary.project.name} · ${summary.endpoints.length} endpoint(s)`,
        });
      } catch (error) {
        checks.push({
          label: "Project",
          status: "error",
          detail: error instanceof Error ? error.message : "verification failed",
        });
      }
    }
  }

  process.stdout.write("\n");
  for (const c of checks) {
    const sym =
      c.status === "ok" ? symbols.ok : c.status === "warn" ? symbols.warn : symbols.error;
    process.stdout.write(`${sym} ${c.label.padEnd(20)} ${color.dim(c.detail)}\n`);
  }
  const errors = checks.filter((c) => c.status === "error").length;
  process.stdout.write("\n");
  if (errors > 0) {
    fail(`${errors} issue(s) found. See docs.run402.com/troubleshooting`);
    process.exitCode = 1;
  } else {
    success("Everything looks good.");
  }
}

/* -------------------------------- status -------------------------------- */

export async function statusCommand(): Promise<void> {
  const ctx = await requireContext();
  const summary = await fetchSummary(ctx);
  banner(`Project · ${summary.project.name}`, [
    keyValue("ID", summary.project.id),
    keyValue("Environment", summary.project.environment),
    keyValue("Currency", summary.project.currency.toUpperCase()),
    keyValue("Endpoints", String(summary.endpoints.length)),
  ]);
  printEndpoints(summary);
}

/* --------------------------------- logs --------------------------------- */

export async function logsCommand(opts: { limit?: string; status?: string }): Promise<void> {
  const ctx = await requireContext();
  const limit = opts.limit ? Number(opts.limit) : 20;
  const summary = await fetchSummary(ctx, limit);
  let logs = summary.logs;
  if (opts.status) logs = logs.filter((l) => String(l.statusCode) === opts.status);

  if (logs.length === 0) {
    info("No requests yet. Run `run402 test` or hit a protected route.");
    return;
  }
  for (const l of logs) printLogLine(l);
}

/* --------------------------------- dev ---------------------------------- */

export async function devCommand(): Promise<void> {
  const ctx = await requireContext();
  const summary = await fetchSummary(ctx);
  banner(`run402 dev · ${summary.project.name}`, [
    keyValue("Environment", summary.project.environment),
    keyValue("Control plane", ctx.baseUrl),
    keyValue("Endpoints", String(summary.endpoints.length)),
  ]);
  printEndpoints(summary);
  process.stdout.write(`\n${color.dim("Streaming requests… (Ctrl+C to stop)")}\n\n`);

  const seen = new Set(summary.logs.map((l) => l.id));
  const poll = async () => {
    try {
      const next = await fetchSummary(ctx, 20);
      for (const l of [...next.logs].reverse()) {
        if (seen.has(l.id)) continue;
        seen.add(l.id);
        printLogLine(l);
      }
    } catch {
      /* transient — keep polling */
    }
  };

  const interval = setInterval(poll, 2000);
  process.on("SIGINT", () => {
    clearInterval(interval);
    process.stdout.write("\n");
    info("Stopped.");
    process.exit(0);
  });
  await new Promise<void>(() => {});
}

/* --------------------------------- test --------------------------------- */

export async function testCommand(opts: { endpoint?: string }): Promise<void> {
  const ctx = await requireContext();
  const summary = await fetchSummary(ctx);
  const endpoint = opts.endpoint
    ? summary.endpoints.find((e) => e.path === opts.endpoint)
    : summary.endpoints[0];

  if (!endpoint) {
    fail("No endpoint to test. Register one in the dashboard first.");
    process.exitCode = 1;
    return;
  }

  banner("run402 test", [keyValue("Endpoint", `${endpoint.method} ${endpoint.path}`)]);

  const s1 = p.spinner();
  s1.start("Sending initial request");
  const r1 = await verifyRequest(ctx, { method: endpoint.method, path: endpoint.path });
  s1.stop(`${statusColor(r1.status)} ${r1.status === 402 ? "Payment Required" : ""}`);
  if (r1.status !== 402) {
    fail(`Expected 402, got ${r1.status}.`);
    process.exitCode = 1;
    return;
  }
  const paymentId = (r1.body as { payment_id?: string }).payment_id;
  if (!paymentId) {
    fail("No payment id returned.");
    process.exitCode = 1;
    return;
  }

  const s2 = p.spinner();
  s2.start("Completing mock payment");
  const pr = await payPayment(ctx, paymentId);
  if (pr.status !== 200) {
    s2.stop(color.red("Payment failed"));
    process.exitCode = 1;
    return;
  }
  const token = (pr.body as { token: string }).token;
  s2.stop(`${symbols.ok} Paid · token ${color.dim(`${token.slice(0, 12)}…`)}`);

  const s3 = p.spinner();
  s3.start("Retrying with token");
  const r3 = await verifyRequest(ctx, {
    method: endpoint.method,
    path: endpoint.path,
    token,
  });
  s3.stop(`${statusColor(r3.status)} ${r3.status === 200 ? "OK" : ""}`);

  process.stdout.write("\n");
  if (r3.status === 200) success("Integration works end-to-end 🎉");
  else {
    fail(`Expected 200, got ${r3.status}.`);
    process.exitCode = 1;
  }
}

/* ------------------------------- helpers -------------------------------- */

function printEndpoints(summary: CliSummary): void {
  if (summary.endpoints.length === 0) {
    warn("No endpoints registered. Create one in the dashboard.");
    return;
  }
  for (const e of summary.endpoints) {
    const disabled = e.status !== "active" ? color.dim(" (disabled)") : "";
    process.stdout.write(
      `  ${symbols.ok} ${methodColor(e.method)} ${e.path.padEnd(22)} ${color.dim(formatMicro(e.price))}${disabled}\n`,
    );
  }
}

function printLogLine(l: CliSummary["logs"][number]): void {
  const time = new Date(l.createdAt).toLocaleTimeString();
  process.stdout.write(
    `${color.dim(time)}  ${statusColor(l.statusCode)}  ${methodColor(l.method)} ${l.path.padEnd(
      22,
    )} ${color.dim(l.paymentStatus.padEnd(8))} ${color.dim(`${l.durationMs}ms`)}\n`,
  );
}
