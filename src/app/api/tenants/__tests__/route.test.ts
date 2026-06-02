import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({
  getAuthSession: vi.fn(),
}));

vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    tenant: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    tenantUser: { findUnique: vi.fn(), create: vi.fn() },
    license: { findFirst: vi.fn() },
    user: { findUnique: vi.fn() },
  },
}));

function makeSession(overrides: Record<string, unknown> = {}) {
  return { userId: "user-1", email: "admin@test.com", isSuperAdmin: true, ...overrides };
}

function makeTenant(overrides: Record<string, unknown> = {}) {
  return {
    id: "t-1",
    name: "Acme Corp",
    slug: "acme",
    description: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("GET /api/tenants", () => {
  it("returns 401 when not authenticated", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(null);

    const { GET } = await import("../route");
    const res = await GET(new NextRequest("http://localhost/api/tenants"));
    expect(res.status).toBe(401);
  });

  it("returns all tenants for Super Admin", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(prisma.tenant.findMany).mockResolvedValue([makeTenant()]);

    const { GET } = await import("../route");
    const res = await GET(new NextRequest("http://localhost/api/tenants"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(1);
  });
});

describe("POST /api/tenants", () => {
  it("returns 403 when user is not Super Admin", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession({ isSuperAdmin: false }));

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/tenants", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "test" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("returns 422 when maxTenants limit is reached", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(prisma.license.findFirst).mockResolvedValue({ maxTenants: 1 } as never);
    vi.mocked(prisma.tenant.count).mockResolvedValue(1);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/tenants", {
      method: "POST",
      body: JSON.stringify({ name: "Over Limit", slug: "over-limit" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("creates tenant and returns 201 for Super Admin within limit", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(prisma.license.findFirst).mockResolvedValue({ maxTenants: 5 } as never);
    vi.mocked(prisma.tenant.count).mockResolvedValue(0);
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.tenant.create).mockResolvedValue(makeTenant() as never);
    vi.mocked(prisma.tenantUser.create).mockResolvedValue({} as never);

    const { POST } = await import("../route");
    const req = new NextRequest("http://localhost/api/tenants", {
      method: "POST",
      body: JSON.stringify({ name: "Acme Corp", slug: "acme" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
