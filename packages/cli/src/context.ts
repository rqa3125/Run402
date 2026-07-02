import { resolveContext, type CliContext } from "./config";
import { fail, info } from "./ui";

/** Resolve the CLI context or exit with guidance. */
export async function requireContext(): Promise<CliContext> {
  const ctx = await resolveContext();
  if (!ctx) {
    fail("No project key found.");
    info("Run `run402 init` or `run402 login`, or set RUN402_SECRET_KEY.");
    process.exit(1);
  }
  return ctx;
}
