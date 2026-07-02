import { defineConfig, devices } from "@playwright/test";

/**
 * E2E coverage for the two apps that run without external services:
 *  - web  (marketing) on :3000
 *  - docs             on :3002
 *
 * The dashboard needs Clerk + Postgres, so its flows are exercised by the
 * unit/integration suites and the CLI instead.
 *
 * `reuseExistingServer` means local dev servers are reused when already up;
 * CI starts them fresh.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "pnpm --filter @run402/web dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @run402/docs dev",
      url: "http://localhost:3002",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
