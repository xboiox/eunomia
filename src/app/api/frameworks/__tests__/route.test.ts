import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({
  getAuthSession: vi.fn(),
}));

vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    framework: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

function makeSession(overrides: Record<string, unknown> = {}) {
  return { userId: "user-1", email: "u@test.com", isSuperAdmin: false, ...overrides };
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("GET /api/frameworks", () => {
  it("returns 401 when not authenticated", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(null);

    const { GET } = await import("../route");
    const res = await GET(new NextRequest("http://localhost/api/frameworks"));
    expect(res.status).toBe(401);
  });

  it("returns frameworks with computed domain and control counts", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(prisma.framework.findMany).mockResolvedValue([
      {
        id: "f-1",
        code: "NIST_CSF",
        name: "NIST Cybersecurity Framework",
        version: "2.0",
        description: "desc",
        _count: { domains: 2 },
        domains: [{ _count: { controls: 10 } }, { _count: { controls: 6 } }],
      },
    ] as never);

    const { GET } = await import("../route");
    const res = await GET(new NextRequest("http://localhost/api/frameworks"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].domainCount).toBe(2);
    expect(body.data[0].controlCount).toBe(16);
    expect(body.meta.total).toBe(1);
  });
});

describe("GET /api/frameworks/[frameworkId]/domains", () => {
  it("returns 401 when not authenticated", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(null);

    const { GET } = await import("../[frameworkId]/domains/route");
    const res = await GET(new NextRequest("http://localhost/api/frameworks/f-1/domains"), {
      params: Promise.resolve({ frameworkId: "f-1" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns 404 when the framework does not exist", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(prisma.framework.findUnique).mockResolvedValue(null);

    const { GET } = await import("../[frameworkId]/domains/route");
    const res = await GET(new NextRequest("http://localhost/api/frameworks/missing/domains"), {
      params: Promise.resolve({ frameworkId: "missing" }),
    });
    expect(res.status).toBe(404);
  });

  it("returns the framework with its domain/control tree", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(prisma.framework.findUnique).mockResolvedValue({
      id: "f-1",
      code: "ISO_27001",
      name: "ISO/IEC 27001",
      version: "2022",
      description: "desc",
      domains: [{ id: "d-1", code: "5", name: "Org", controls: [{ id: "c-1", code: "5.1" }] }],
    } as never);

    const { GET } = await import("../[frameworkId]/domains/route");
    const res = await GET(new NextRequest("http://localhost/api/frameworks/f-1/domains"), {
      params: Promise.resolve({ frameworkId: "f-1" }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.code).toBe("ISO_27001");
    expect(body.data.domains).toHaveLength(1);
  });
});
