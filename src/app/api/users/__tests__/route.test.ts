import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({
  getAuthSession: vi.fn(),
}));

vi.mock("@/lib/auth/rbac", () => ({
  hasMinimumTenantRole: vi.fn(),
  getUserTenants: vi.fn(),
}));

vi.mock("@/lib/auth/generatePassword", () => ({
  generateTemporaryPassword: vi.fn(() => "TempPass1!"),
}));

vi.mock("bcrypt", () => ({
  default: { hash: vi.fn(async () => "hashed"), compare: vi.fn(async () => true) },
}));

vi.mock("@/lib/email/send", () => ({
  sendTenantAddedEmail: vi.fn(async () => {}),
}));

vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    user: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn() },
    tenant: { findUnique: vi.fn() },
    tenantUser: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

function makeSession(overrides: Record<string, unknown> = {}) {
  return { userId: "user-1", email: "admin@test.com", isSuperAdmin: false, mustChangePassword: false, ...overrides };
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("GET /api/users", () => {
  it("returns 401 when not authenticated", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(null);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/users?tenantId=t-1");
    expect((await GET(req)).status).toBe(401);
  });

  it("returns 400 when tenantId is missing", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/users");
    expect((await GET(req)).status).toBe(400);
  });

  it("returns 403 when user has no access to tenant", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(false);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/users?tenantId=t-1");
    expect((await GET(req)).status).toBe(403);
  });

  it("returns users list when user has access", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(true);
    vi.mocked(prisma.tenantUser.findMany).mockResolvedValue([
      {
        role: "ADMIN",
        user: { id: "u-1", name: "Alice", email: "alice@test.com", createdAt: new Date() },
      },
    ] as never);

    const { GET } = await import("../route");
    const req = new NextRequest("http://localhost/api/users?tenantId=t-1");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(1);
  });
});

describe("POST /api/users", () => {
  const newUserBody = { name: "Bob", email: "bob@test.com", tenantId: "t-1", role: "ASSESSOR" };
  const existingUserBody = { email: "alice@test.com", tenantId: "t-1", role: "ASSESSOR" };

  function mockTenant() {
    return { id: "t-1", name: "Acme Corp" };
  }

  it("returns 403 when requester is not ADMIN in tenant", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(false);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify(newUserBody),
      headers: { "Content-Type": "application/json" },
    });
    expect((await POST(req)).status).toBe(403);
  });

  it("creates new user account and returns 201 with temporaryPassword", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(true);
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue(mockTenant() as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "u-new", name: "Bob", email: "bob@test.com", createdAt: new Date(),
    } as never);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify(newUserBody),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.created).toBe(true);
    expect(body.data.temporaryPassword).toBe("TempPass1!");
  });

  it("adds existing user to tenant and returns 200 without temporaryPassword", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(true);
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue(mockTenant() as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "u-existing", name: "Alice", email: "alice@test.com", createdAt: new Date(),
    } as never);
    vi.mocked(prisma.tenantUser.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.tenantUser.create).mockResolvedValue({} as never);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify(existingUserBody),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.created).toBe(false);
    expect(body.data.temporaryPassword).toBeUndefined();
  });

  it("returns 409 when user is already a member of this tenant", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(true);
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue(mockTenant() as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u-2", name: "Alice", email: "alice@test.com", createdAt: new Date() } as never);
    vi.mocked(prisma.tenantUser.findUnique).mockResolvedValue({ id: "tu-1" } as never);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify(existingUserBody),
      headers: { "Content-Type": "application/json" },
    });
    expect((await POST(req)).status).toBe(409);
  });
});
