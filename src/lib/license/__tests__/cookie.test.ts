import { beforeEach, describe, expect, it, vi } from "vitest";

const TEST_SECRET = "test-nextauth-secret-32-chars-min!";

beforeEach(() => {
  vi.stubEnv("NEXTAUTH_SECRET", TEST_SECRET);
  vi.resetModules();
});

const BASE_DATA = {
  maxTenants: 5,
  licenseType: "professional",
  expiresAt: null as string | null,
};

describe("createLicenseCookie", () => {
  it("returns a JWT string with three parts", async () => {
    const { createLicenseCookie } = await import("../cookie");
    const token = await createLicenseCookie(BASE_DATA);

    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("embeds validUntil ~24 hours from now", async () => {
    const before = Math.floor(Date.now() / 1000);
    const { createLicenseCookie } = await import("../cookie");
    const token = await createLicenseCookie(BASE_DATA);

    const { verifyLicenseCookie } = await import("../cookie");
    const payload = await verifyLicenseCookie(token);

    expect(payload).not.toBeNull();
    const validUntil = payload!.validUntil;
    expect(validUntil).toBeGreaterThanOrEqual(before + 23 * 3600);
    expect(validUntil).toBeLessThanOrEqual(before + 25 * 3600);
  });

  it("sets gracePeriodStart to null by default", async () => {
    const { createLicenseCookie, verifyLicenseCookie } = await import(
      "../cookie"
    );
    const token = await createLicenseCookie(BASE_DATA);
    const payload = await verifyLicenseCookie(token);

    expect(payload?.gracePeriodStart).toBeNull();
  });
});

describe("verifyLicenseCookie", () => {
  it("returns payload for a valid cookie", async () => {
    const { createLicenseCookie, verifyLicenseCookie } = await import(
      "../cookie"
    );
    const token = await createLicenseCookie(BASE_DATA);
    const payload = await verifyLicenseCookie(token);

    expect(payload).not.toBeNull();
    expect(payload?.maxTenants).toBe(5);
    expect(payload?.licenseType).toBe("professional");
    expect(payload?.expiresAt).toBeNull();
  });

  it("returns null for a tampered token", async () => {
    const { createLicenseCookie, verifyLicenseCookie } = await import(
      "../cookie"
    );
    const token = await createLicenseCookie(BASE_DATA);
    const tampered = token.slice(0, -5) + "XXXXX";
    const payload = await verifyLicenseCookie(tampered);

    expect(payload).toBeNull();
  });

  it("returns null when NEXTAUTH_SECRET is not set", async () => {
    const { createLicenseCookie } = await import("../cookie");
    const token = await createLicenseCookie(BASE_DATA);

    vi.stubEnv("NEXTAUTH_SECRET", "");
    vi.resetModules();
    const { verifyLicenseCookie } = await import("../cookie");
    expect(await verifyLicenseCookie(token)).toBeNull();
  });

  it("returns null for a completely invalid string", async () => {
    const { verifyLicenseCookie } = await import("../cookie");
    expect(await verifyLicenseCookie("not-a-jwt")).toBeNull();
    expect(await verifyLicenseCookie("")).toBeNull();
  });

  it("preserves gracePeriodStart when set", async () => {
    const { createLicenseCookie, verifyLicenseCookie } = await import(
      "../cookie"
    );
    const gracePeriodStart = Math.floor(Date.now() / 1000) - 3600;
    const token = await createLicenseCookie({
      ...BASE_DATA,
      gracePeriodStart,
    });
    const payload = await verifyLicenseCookie(token);

    expect(payload?.gracePeriodStart).toBe(gracePeriodStart);
  });
});
