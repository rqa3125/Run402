import pc from "picocolors";

export const VERSION = "0.1.0";
export const DOCS_URL = "https://docs.run402.com";

export const color = pc;

/** Status symbols for doctor / diagnostics. */
export const symbols = {
  ok: pc.green("✓"),
  warn: pc.yellow("⚠"),
  error: pc.red("✖"),
  arrow: pc.dim("→"),
  bullet: pc.dim("•"),
};

export function brand(text = "run402"): string {
  return pc.bold(pc.white(text));
}

/** A dim, boxed banner shown at the top of long-running commands. */
export function banner(title: string, lines: string[]): void {
  const width = Math.max(title.length, ...lines.map((l) => stripAnsi(l).length)) + 2;
  const bar = pc.dim("─".repeat(width));
  process.stdout.write(`\n${pc.bold(title)}\n${bar}\n`);
  for (const line of lines) process.stdout.write(`${line}\n`);
  process.stdout.write(`${bar}\n`);
}

export function success(message: string): void {
  process.stdout.write(`${symbols.ok} ${message}\n`);
}
export function warn(message: string): void {
  process.stdout.write(`${symbols.warn} ${pc.yellow(message)}\n`);
}
export function fail(message: string): void {
  process.stderr.write(`${symbols.error} ${pc.red(message)}\n`);
}
export function info(message: string): void {
  process.stdout.write(`${symbols.bullet} ${pc.dim(message)}\n`);
}

export function keyValue(key: string, value: string): string {
  return `${pc.dim(key.padEnd(14))} ${value}`;
}

/** Micro-dollars (1 USD = 1_000_000) → "$0.005". */
export function formatMicro(micros: number): string {
  return `$${(micros / 1_000_000).toFixed(3)}`;
}

/** HTTP status → colored string. */
export function statusColor(status: number): string {
  if (status < 300) return pc.green(String(status));
  if (status === 402) return pc.yellow(String(status));
  if (status >= 400) return pc.red(String(status));
  return pc.dim(String(status));
}

export function methodColor(method: string): string {
  const map: Record<string, (s: string) => string> = {
    GET: pc.blue,
    POST: pc.green,
    PUT: pc.yellow,
    PATCH: pc.magenta,
    DELETE: pc.red,
  };
  return (map[method] ?? pc.white)(method.padEnd(6));
}

function stripAnsi(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\[[0-9;]*m/g, "");
}
