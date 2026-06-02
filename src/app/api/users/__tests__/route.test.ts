import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({
  getAuthSession: vi.fn(),
}));

vi.mock("@/lib/auth/rbac", () => ({
  hasMinimumTenantRole: vi.fn(),
  getUserTenants: vi.fn(),
}));

vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    user: { findUnique: vi.fn(), findMany: vi.fn() },
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
  return { userId: "user-1", email: "admin@test.com", isSuperAdmin: false, ...overrides };
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
  it("returns 403 when requester is not ADMIN in tenant", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(false);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify({ email: "bob@test.com", tenantId: "t-1", role: "ASSESSOR" }),
      headers: { "Content-Type": "application/json" },
    });
    expect((await POST(req)).status).toBe(403);
  });

  it("returns 404 when invited user does not exist", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(true);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify({ email: "nobody@test.com", tenantId: "t-1", role: "ASSESSOR" }),
      headers: { "Content-Type": "application/json" },
    });
    expect((await POST(req)).status).toBe(404);
  });

  it("returns 409 when user is already a member", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(true);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u-2" } as never);
    vi.mocked(prisma.tenantUser.findUnique).mockResolvedValue({ id: "tu-1" } as never);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify({ email: "existing@test.com", tenantId: "t-1", role: "ASSESSOR" }),
      headers: { "Content-Type": "application/json" },
    });
    expect((await POST(req)).status).toBe(409);
  });
});
