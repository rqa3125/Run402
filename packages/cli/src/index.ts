#!/usr/bin/env node
import { buildProgram } from "./cli";
import { fail } from "./ui";

buildProgram()
  .parseAsync(process.argv)
  .catch((error: unknown) => {
    fail(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
