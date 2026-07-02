import { test, expect } from "@playwright/test";

const WEB = "http://localhost:3000";

test.describe("marketing site", () => {
  test("hero renders with headline and CTAs", async ({ page }) => {
    await page.goto(WEB);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Monetize any",
    );
    await expect(page.getByRole("link", { name: /start building/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /read the docs/i })).toBeVisible();
  });

  test("hero product scene tells the install → paid story", async ({ page }) => {
    await page.goto(WEB);
    // Step rail
    await expect(page.getByText("Install", { exact: true })).toBeVisible();
    await expect(page.getByText("Get paid", { exact: true })).toBeVisible();
    // Terminal card types the install command
    await expect(page.getByText("npm install run402").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("pricing page renders all three plans", async ({ page }) => {
    await page.goto(`${WEB}/pricing`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const plan of ["Free", "Pro", "Enterprise"]) {
      await expect(
        page.getByRole("heading", { name: plan, exact: true }),
      ).toBeVisible();
    }
  });

  test("404 page renders for unknown routes", async ({ page }) => {
    const res = await page.goto(`${WEB}/does-not-exist`);
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  });
});
