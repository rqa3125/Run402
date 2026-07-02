import { z } from "zod";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const CONFIG_FILENAME = "run402.config.ts";

export const configSchema = z.object({
  // May be empty in the file (env-backed); resolveContext falls back if so.
  projectKey: z.string().default(""),
  environment: z.enum(["sandbox", "live"]).default("sandbox"),
  framework: z.enum(["express", "next", "fastify"]).default("express"),
  port: z.coerce.number().int().positive().default(4000),
  baseUrl: z.string().url().default("http://localhost:3001"),
});
export type Run402CliConfig = z.infer<typeof configSchema>;

/** Render a typed `run402.config.ts`. The secret is env-backed, not hardcoded. */
export function configTemplate(cfg: Run402CliConfig): string {
  return `import { defineConfig } from "run402"

export default defineConfig({
  // Keep secrets out of source — set RUN402_SECRET_KEY in your environment.
  projectKey: process.env.RUN402_SECRET_KEY ?? "",
  environment: "${cfg.environment}",
  framework: "${cfg.framework}",
  port: ${cfg.port},
  baseUrl: "${cfg.baseUrl}",
})
`;
}

export async function writeConfig(
  cfg: Run402CliConfig,
  dir = process.cwd(),
): Promise<string> {
  const path = join(dir, CONFIG_FILENAME);
  await writeFile(path, configTemplate(cfg), "utf8");
  return path;
}

export function configExists(dir = process.cwd()): boolean {
  return existsSync(join(dir, CONFIG_FILENAME));
}

export async function loadConfig(
  dir = process.cwd(),
): Promise<Run402CliConfig | null> {
  const path = join(dir, CONFIG_FILENAME);
  if (!existsSync(path)) return null;
  try {
    const mod = await import(pathToFileURL(resolve(path)).href);
    return configSchema.parse(mod.default ?? mod);
  } catch {
    return null;
  }
}

// --- credentials (~/.run402/credentials.json) --------------------------------

const CRED_DIR = join(homedir(), ".run402");
const CRED_FILE = join(CRED_DIR, "credentials.json");

const credSchema = z.object({
  projectKey: z.string().min(1),
  baseUrl: z.string().default("http://localhost:3001"),
});
export type Credentials = z.infer<typeof credSchema>;

export async function saveCredentials(c: Credentials): Promise<void> {
  await mkdir(CRED_DIR, { recursive: true });
  await writeFile(CRED_FILE, JSON.stringify(c, null, 2), "utf8");
}

export async function loadCredentials(): Promise<Credentials | null> {
  if (!existsSync(CRED_FILE)) return null;
  try {
    return credSchema.parse(JSON.parse(await readFile(CRED_FILE, "utf8")));
  } catch {
    return null;
  }
}

// --- resolved context --------------------------------------------------------

export interface CliContext {
  projectKey: string;
  baseUrl: string;
  source: "config" | "credentials" | "env";
}

/** Resolve credentials from config file → saved login → env, in that order. */
export async function resolveContext(): Promise<CliContext | null> {
  const cfg = await loadConfig();
  if (cfg?.projectKey) {
    return { projectKey: cfg.projectKey, baseUrl: cfg.baseUrl, source: "config" };
  }
  const creds = await loadCredentials();
  if (creds?.projectKey) {
    return { projectKey: creds.projectKey, baseUrl: creds.baseUrl, source: "credentials" };
  }
  const envKey = process.env.RUN402_SECRET_KEY;
  if (envKey) {
    return {
      projectKey: envKey,
      baseUrl: process.env.RUN402_BASE_URL ?? "http://localhost:3001",
      source: "env",
    };
  }
  return null;
}
