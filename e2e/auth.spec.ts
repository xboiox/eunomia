import { test, expect } from "@playwright/test";

/**
 * Auth flows: sign-in and sign-out.
 *
 * Prerequisites (run once locally before this suite):
 *   npm run db:seed
 *   Register a user at /signup and activate a license at /activate
 *   Set env vars: E2E_EMAIL, E2E_PASSWORD (defaults below work for dev)
 */

const EMAIL = process.env.E2E_EMAIL ?? "test@example.com";
const PASSWORD = process.env.E2E_PASSWORD ?? "Password123!";

test.describe("Authentication", () => {
  test("redirects unauthenticated users to /signin", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/signin/);
  });

  test("shows error on wrong credentials", async ({ page }) => {
    await page.goto("/signin");
    // Switch to password mode (the boilerplate SignIn has a toggle)
    const passwordToggle = page.getByRole("button", { name: /password/i });
    if (await passwordToggle.isVisible()) await passwordToggle.click();

    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', "wrong-password");
    await page.click('button[type="submit"]');

    await expect(page.getByText(/invalid/i)).toBeVisible({ timeout: 5000 });
  });

  test("signs in and signs out successfully", async ({ page }) => {
    // Sign in
    await page.goto("/signin");
    const passwordToggle = page.getByRole("button", { name: /password/i });
    if (await passwordToggle.isVisible()) await passwordToggle.click();

    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Sign out
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/signin/, { timeout: 5000 });
  });
});
