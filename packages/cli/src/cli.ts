import { Command } from "commander";
import { VERSION } from "./ui";
import * as cmd from "./commands";

/** Build the `run402` command tree. Exported for tests. */
export function buildProgram(): Command {
  const program = new Command();

  program
    .name("run402")
    .description("Run402 — monetize any API. CLI for local development.")
    .version(VERSION, "-v, --version", "output the CLI version")
    .showHelpAfterError();

  program
    .command("init")
    .description("interactively scaffold run402.config.ts")
    .action(cmd.initCommand);

  program
    .command("login")
    .description("save your Run402 credentials")
    .action(cmd.loginCommand);

  program
    .command("doctor")
    .description("diagnose your setup (config, network, env, dependencies)")
    .action(cmd.doctorCommand);

  program
    .command("dev")
    .description("live request stream for your project")
    .action(cmd.devCommand);

  program
    .command("test")
    .description("run the full 402 → payment → 200 flow")
    .option("-e, --endpoint <path>", "endpoint path to test")
    .action((options) => cmd.testCommand(options));

  program
    .command("status")
    .description("show project status and endpoints")
    .action(cmd.statusCommand);

  program
    .command("logs")
    .description("recent request logs")
    .option("-n, --limit <n>", "number of logs to show", "20")
    .option("-s, --status <code>", "filter by HTTP status code")
    .action((options) => cmd.logsCommand(options));

  program
    .command("version")
    .description("show CLI and Node versions")
    .action(cmd.versionCommand);

  return program;
}
