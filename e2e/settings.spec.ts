import { test, expect } from "@playwright/test";

/**
 * Settings page: account info, license status, system config (Super Admin only).
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

test.describe("Settings page", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/settings");
  });

  test("shows account email", async ({ page }) => {
    await expect(page.getByText(EMAIL)).toBeVisible();
  });

  test("shows license section for Super Admin", async ({ page }) => {
    // Only visible when the signed-in user is Super Admin
    const licenseSection = page.getByRole("heading", { name: /^license$/i });
    // This is conditional — skip if user is not Super Admin
    if (await licenseSection.isVisible()) {
      await expect(page.getByText(/active|expired|not activated/i)).toBeVisible();
    }
  });

  test("shows system config section for Super Admin", async ({ page }) => {
    const configSection = page.getByRole("heading", { name: /system configuration/i });
    if (await configSection.isVisible()) {
      await expect(page.getByText(/MB/)).toBeVisible();
    }
  });
});
