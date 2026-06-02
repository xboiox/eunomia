import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    tenantUser: { findUnique: vi.fn(), findMany: vi.fn() },
    license: { findFirst: vi.fn() },
  },
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("checkIsSuperAdmin", () => {
  it("returns true when user.isSuperAdmin is true", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isSuperAdmin: true,
    } as never);

    const { checkIsSuperAdmin } = await import("../rbac");
    expect(await checkIsSuperAdmin("user-1")).toBe(true);
  });

  it("returns false when user.isSuperAdmin is false", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isSuperAdmin: false,
    } as never);

    const { checkIsSuperAdmin } = await import("../rbac");
    expect(await checkIsSuperAdmin("user-1")).toBe(false);
  });

  it("returns false when user not found", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const { checkIsSuperAdmin } = await import("../rbac");
    expect(await checkIsSuperAdmin("unknown")).toBe(false);
  });
});

describe("getTenantRoleForUser", () => {
  it("returns ADMIN when user has ADMIN role in tenant", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.tenantUser.findUnique).mockResolvedValue({
      role: "ADMIN",
    } as never);

    const { getTenantRoleForUser } = await import("../rbac");
    expect(await getTenantRoleForUser("user-1", "tenant-1")).toBe("ADMIN");
  });

  it("returns null when user is not a member of the tenant", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.tenantUser.findUnique).mockResolvedValue(null);

    const { getTenantRoleForUser } = await import("../rbac");
    expect(await getTenantRoleForUser("user-1", "tenant-1")).toBeNull();
  });
});

describe("hasMinimumTenantRole", () => {
  it("returns true for Super Admin regardless of tenant membership", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ isSuperAdmin: true } as never);
    vi.mocked(prisma.tenantUser.findUnique).mockResolvedValue(null);

    const { hasMinimumTenantRole } = await import("../rbac");
    expect(await hasMinimumTenantRole("super", "any-tenant", "ADMIN")).toBe(true);
  });

  it("returns true for ADMIN user requiring ASSESSOR role", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ isSuperAdmin: false } as never);
    vi.mocked(prisma.tenantUser.findUnique).mockResolvedValue({ role: "ADMIN" } as never);

    const { hasMinimumTenantRole } = await import("../rbac");
    expect(await hasMinimumTenantRole("user-1", "tenant-1", "ASSESSOR")).toBe(true);
  });

  it("returns false for ASSESSOR user requiring ADMIN role", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ isSuperAdmin: false } as never);
    vi.mocked(prisma.tenantUser.findUnique).mockResolvedValue({ role: "ASSESSOR" } as never);

    const { hasMinimumTenantRole } = await import("../rbac");
    expect(await hasMinimumTenantRole("user-1", "tenant-1", "ADMIN")).toBe(false);
  });

  it("returns false when user has no membership", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ isSuperAdmin: false } as never);
    vi.mocked(prisma.tenantUser.findUnique).mockResolvedValue(null);

    const { hasMinimumTenantRole } = await import("../rbac");
    expect(await hasMinimumTenantRole("user-1", "tenant-1", "ASSESSOR")).toBe(false);
  });
});

describe("getUserTenants", () => {
  it("returns list of tenants with role for a user", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.tenantUser.findMany).mockResolvedValue([
      {
        role: "ADMIN",
        tenant: { id: "t-1", name: "Acme Corp", slug: "acme", isActive: true },
      },
      {
        role: "ASSESSOR",
        tenant: { id: "t-2", name: "Globex", slug: "globex", isActive: true },
      },
    ] as never);

    const { getUserTenants } = await import("../rbac");
    const tenants = await getUserTenants("user-1");

    expect(tenants).toHaveLength(2);
    expect(tenants[0]).toMatchObject({ id: "t-1", role: "ADMIN" });
    expect(tenants[1]).toMatchObject({ id: "t-2", role: "ASSESSOR" });
  });

  it("returns empty array when user has no tenants", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.tenantUser.findMany).mockResolvedValue([]);

    const { getUserTenants } = await import("../rbac");
    expect(await getUserTenants("user-1")).toEqual([]);
  });
});
