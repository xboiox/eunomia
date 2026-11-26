import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("GET /api/health", () => {
  it("returns 200 with status ok when the database responds", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ "?column?": 1 }]);

    const { GET } = await import("../route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ success: true, data: { status: "ok", database: "up" } });
  });

  it("returns 503 without leaking error details when the database is unreachable", async () => {
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error("connect ECONNREFUSED 10.0.0.5:5432"));

    const { GET } = await import("../route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body).toEqual({ success: false, error: "Database unavailable" });
    expect(JSON.stringify(body)).not.toContain("ECONNREFUSED");
  });
});
