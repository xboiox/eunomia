import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    license: {
      findFirst: vi.fn(),
    },
  },
}));

beforeEach(() => {
  vi.resetModules();
});

function makeDbRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "lic-1",
    licenseKey: "TEST-KEY",
    licenseType: "professional",
    maxTenants: 5,
    activatedAt: new Date(),
    expiresAt: null,
    lastValidatedAt: new Date(),
    createdAt: new Date(),
    ...overrides,
  };
}

describe("getLicenseRecord", () => {
  it("returns null when no License record in DB", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.license.findFirst).mockResolvedValue(null);

    const { getLicenseRecord } = await import("../check");
    expect(await getLicenseRecord()).toBeNull();
  });

  it("returns the license record when found", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.license.findFirst).mockResolvedValue(makeDbRecord());

    const { getLicenseRecord } = await import("../check");
    const record = await getLicenseRecord();

    expect(record).not.toBeNull();
    expect(record?.licenseKey).toBe("TEST-KEY");
    expect(record?.maxTenants).toBe(5);
    expect(record?.licenseType).toBe("professional");
  });

  it("returns null when expiresAt is in the past", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.license.findFirst).mockResolvedValue(
      makeDbRecord({ expiresAt: new Date("2020-01-01") }),
    );

    const { getLicenseRecord } = await import("../check");
    expect(await getLicenseRecord()).toBeNull();
  });

  it("returns record when expiresAt is in the future", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.license.findFirst).mockResolvedValue(
      makeDbRecord({ expiresAt: new Date("2099-01-01") }),
    );

    const { getLicenseRecord } = await import("../check");
    const record = await getLicenseRecord();
    expect(record).not.toBeNull();
  });
});
