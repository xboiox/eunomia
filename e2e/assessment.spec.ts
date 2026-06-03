import { test, expect } from "@playwright/test";

/**
 * Assessment management flows: create, view, edit, fill a control response.
 *
 * Prerequisites: signed-in session with at least one tenant and one framework seeded.
 * Set env vars: E2E_EMAIL, E2E_PASSWORD, E2E_TENANT_ID (optional, picked from UI).
 */

const EMAIL = process.env.E2E_EMAIL ?? "test@example.com";
const PASSWORD = process.env.E2E_PASSWORD ?? "Password123!";

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/signin");
  const toggle = page.getByRole("button", { name: /password/i });
  if (await toggle.isVisible()) await toggle.click();
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard/, { timeout: 10000 });
}

test.describe("Assessment management", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("assessment list page loads", async ({ page }) => {
    await page.goto("/dashboard/assessments");
    await expect(page.getByRole("heading", { name: /assessments/i })).toBeVisible();
  });

  test("can navigate to new assessment form", async ({ page }) => {
    await page.goto("/dashboard/assessments");
    await page.getByRole("link", { name: /new assessment/i }).click();
    await expect(page).toHaveURL(/assessments\/new/);
    await expect(page.getByRole("heading", { name: /new assessment/i })).toBeVisible();
  });

  test("create assessment form validates required name", async ({ page }) => {
    await page.goto("/dashboard/assessments/new");
    // Try to submit without a name — button should be disabled
    const submitBtn = page.getByRole("button", { name: /create assessment/i });
    await expect(submitBtn).toBeDisabled();
  });

  test("shows past deadline warning", async ({ page }) => {
    await page.goto("/dashboard/assessments/new");
    await page.fill('input[type="date"]', "2020-01-01");
    await expect(page.getByText(/date is in the past/i)).toBeVisible();
  });
});
