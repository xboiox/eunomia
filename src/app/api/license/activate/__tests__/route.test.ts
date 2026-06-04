import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ getAuthSession: vi.fn() }));
vi.mock("@/lib/license/validate", () => ({ validateLicenseKey: vi.fn() }));
vi.mock("@/lib/license/cookie", () => ({
  COOKIE_NAME: "eunomia-license",
  createLicenseCookie: vi.fn(async () => "signed-cookie-token"),
}));
vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    license: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

function makeSession(overrides: Record<string, unknown> = {}) {
  return { userId: "user-1", email: "u@test.com", isSuperAdmin: true, mustChangePassword: false, ...overrides };
}

function putRequest(body: unknown) {
  return new NextRequest("http://localhost/api/license/activate", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const validResult = {
  valid: true as const,
  maxTenants: 10,
  licenseType: "enterprise",
  expiresAt: null,
};

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("PUT /api/license/activate", () => {
  it("returns 401 when not authenticated", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(null);

    const { PUT } = await import("../route");
    const res = await PUT(putRequest({ licenseKey: "NEW-KEY" }));
    expect(res.status).toBe(401);
  });

  it("returns 403 when caller is not a Super Admin", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession({ isSuperAdmin: false }));

    const { PUT } = await import("../route");
    const res = await PUT(putRequest({ licenseKey: "NEW-KEY" }));
    expect(res.status).toBe(403);
  });

  it("returns 400 when license key is missing", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());

    const { PUT } = await import("../route");
    const res = await PUT(putRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 422 when the key fails validation", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { validateLicenseKey } = await import("@/lib/license/validate");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(validateLicenseKey).mockResolvedValue({ valid: false, reason: "not_found" });

    const { PUT } = await import("../route");
    const res = await PUT(putRequest({ licenseKey: "BAD-KEY" }));
    expect(res.status).toBe(422);
  });

  it("updates the existing license when valid and sets the cookie", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { validateLicenseKey } = await import("@/lib/license/validate");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(validateLicenseKey).mockResolvedValue(validResult);
    vi.mocked(prisma.license.findFirst).mockResolvedValue({ id: "lic-1" } as never);

    const { PUT } = await import("../route");
    const res = await PUT(putRequest({ licenseKey: "NEW-KEY" }));

    expect(res.status).toBe(200);
    expect(prisma.license.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "lic-1" } }),
    );
    expect(res.cookies.get("eunomia-license")?.value).toBe("signed-cookie-token");
  });

  it("creates a license when none exists yet", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { validateLicenseKey } = await import("@/lib/license/validate");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(validateLicenseKey).mockResolvedValue(validResult);
    vi.mocked(prisma.license.findFirst).mockResolvedValue(null);

    const { PUT } = await import("../route");
    const res = await PUT(putRequest({ licenseKey: "NEW-KEY" }));

    expect(res.status).toBe(200);
    expect(prisma.license.create).toHaveBeenCalled();
    expect(prisma.license.update).not.toHaveBeenCalled();
  });
});
