import { test, expect } from "@playwright/test";

const DOCS = "http://localhost:3002";

test.describe("docs site", () => {
  test("quickstart renders with install steps", async ({ page }) => {
    await page.goto(DOCS);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Monetize an API in minutes",
    );
    await expect(page.getByRole("heading", { name: "Install" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Protect an endpoint" })).toBeVisible();
  });

  test("sidebar navigates to the CLI reference", async ({ page }) => {
    await page.goto(DOCS);
    await page.getByRole("link", { name: "CLI", exact: true }).click();
    await expect(page).toHaveURL(`${DOCS}/cli`);
    await expect(page.getByText("run402 doctor").first()).toBeVisible();
  });

  test("middleware page documents protect() options", async ({ page }) => {
    await page.goto(`${DOCS}/middleware`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Middleware");
    await expect(page.getByText("projectKey").first()).toBeVisible();
    await expect(page.getByText("unknown_endpoint").first()).toBeVisible();
  });

  test("troubleshooting and FAQ pages load", async ({ page }) => {
    for (const path of ["/troubleshooting", "/faq"]) {
      const res = await page.goto(`${DOCS}${path}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });
});
