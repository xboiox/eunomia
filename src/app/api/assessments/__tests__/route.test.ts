import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ getAuthSession: vi.fn() }));
vi.mock("@/lib/auth/rbac", () => ({ hasMinimumTenantRole: vi.fn() }));
vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    assessment: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    control: { findMany: vi.fn() },
    controlResponse: { findMany: vi.fn(), upsert: vi.fn() },
  },
}));

function makeSession(overrides: Record<string, unknown> = {}) {
  return { userId: "user-1", email: "u@test.com", isSuperAdmin: false, ...overrides };
}

function jsonRequest(url: string, method: string, body: unknown) {
  return new NextRequest(url, {
    method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("GET /api/assessments", () => {
  it("returns 401 when not authenticated", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(null);
    const { GET } = await import("../route");
    const res = await GET(new NextRequest("http://localhost/api/assessments?tenantId=t-1"));
    expect(res.status).toBe(401);
  });

  it("returns 400 when tenantId is missing", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    const { GET } = await import("../route");
    const res = await GET(new NextRequest("http://localhost/api/assessments"));
    expect(res.status).toBe(400);
  });

  it("returns 403 when user is not a tenant member", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(false);
    const { GET } = await import("../route");
    const res = await GET(new NextRequest("http://localhost/api/assessments?tenantId=t-1"));
    expect(res.status).toBe(403);
  });

  it("returns assessments for a tenant member", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(true);
    vi.mocked(prisma.assessment.findMany).mockResolvedValue([{ id: "a-1" }] as never);
    const { GET } = await import("../route");
    const res = await GET(new NextRequest("http://localhost/api/assessments?tenantId=t-1"));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(1);
  });
});

describe("POST /api/assessments", () => {
  it("returns 403 when caller is not a Tenant Admin", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(false);
    const { POST } = await import("../route");
    const res = await POST(
      jsonRequest("http://localhost/api/assessments", "POST", {
        tenantId: "t-1",
        frameworkId: "f-1",
        name: "Q1 Audit",
      }),
    );
    expect(res.status).toBe(403);
  });

  it("returns 400 when required fields are missing", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    const { POST } = await import("../route");
    const res = await POST(
      jsonRequest("http://localhost/api/assessments", "POST", { tenantId: "t-1" }),
    );
    expect(res.status).toBe(400);
  });

  it("creates an assessment and auto-stubs a response for every control", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(true);
    vi.mocked(prisma.control.findMany).mockResolvedValue([
      { id: "c-1" },
      { id: "c-2" },
      { id: "c-3" },
    ] as never);
    vi.mocked(prisma.assessment.create).mockResolvedValue({ id: "a-1" } as never);

    const { POST } = await import("../route");
    const res = await POST(
      jsonRequest("http://localhost/api/assessments", "POST", {
        tenantId: "t-1",
        frameworkId: "f-1",
        name: "Q1 Audit",
      }),
    );

    expect(res.status).toBe(201);
    const createArg = vi.mocked(prisma.assessment.create).mock.calls[0][0] as {
      data: { responses: { create: Array<{ controlId: string; lastUpdatedById: string }> } };
    };
    expect(createArg.data.responses.create).toHaveLength(3);
    expect(createArg.data.responses.create[0]).toMatchObject({
      controlId: "c-1",
      lastUpdatedById: "user-1",
    });
  });

  it("returns 422 when the framework has no controls", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(true);
    vi.mocked(prisma.control.findMany).mockResolvedValue([] as never);
    const { POST } = await import("../route");
    const res = await POST(
      jsonRequest("http://localhost/api/assessments", "POST", {
        tenantId: "t-1",
        frameworkId: "bad",
        name: "X",
      }),
    );
    expect(res.status).toBe(422);
  });
});

describe("PUT /api/assessments/[assessmentId]/controls/[controlId]", () => {
  async function callPut(body: unknown, role = true, session: unknown = makeSession()) {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(session as never);
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(role);
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue({ tenantId: "t-1" } as never);
    vi.mocked(prisma.controlResponse.upsert).mockResolvedValue({ id: "r-1" } as never);
    const { PUT } = await import("../[assessmentId]/controls/[controlId]/route");
    return PUT(jsonRequest("http://localhost/x", "PUT", body), {
      params: Promise.resolve({ assessmentId: "a-1", controlId: "c-1" }),
    });
  }

  it("upserts the response and returns 200", async () => {
    const res = await callPut({ status: "IMPLEMENTED", notes: "done" });
    expect(res.status).toBe(200);
  });

  it("rejects an invalid status", async () => {
    const res = await callPut({ status: "BOGUS" });
    expect(res.status).toBe(400);
  });

  it("rejects a maturityLevel out of range", async () => {
    const res = await callPut({ maturityLevel: 9 });
    expect(res.status).toBe(400);
  });

  it("returns 403 when caller is not a tenant member", async () => {
    const res = await callPut({ status: "IMPLEMENTED" }, false);
    expect(res.status).toBe(403);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await callPut({ status: "IMPLEMENTED" }, true, null);
    expect(res.status).toBe(401);
  });
});
