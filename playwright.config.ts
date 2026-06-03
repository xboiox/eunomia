import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests run against a locally running dev server.
 * Start it first with `npm run dev`, then run `npm run test:e2e`.
 * These tests are intentionally NOT part of CI (which has no DB).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
