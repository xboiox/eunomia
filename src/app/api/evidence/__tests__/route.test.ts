import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ getAuthSession: vi.fn() }));
vi.mock("@/lib/auth/rbac", () => ({ hasMinimumTenantRole: vi.fn() }));
vi.mock("@/lib/evidence/storage", () => ({
  saveEvidenceFile: vi.fn(),
  readEvidenceFile: vi.fn(),
  deleteEvidenceFile: vi.fn(),
}));
vi.mock("@/lib/prisma/client", () => ({
  prisma: {
    assessment: { findUnique: vi.fn() },
    controlResponse: { findUnique: vi.fn() },
    evidence: { create: vi.fn(), findUnique: vi.fn(), delete: vi.fn() },
  },
}));

function makeSession() {
  return { userId: "user-1", email: "u@test.com", isSuperAdmin: false };
}

function uploadRequest(fields: { file?: File; assessmentId?: string; controlId?: string }) {
  const form = new FormData();
  if (fields.file) form.set("file", fields.file);
  if (fields.assessmentId) form.set("assessmentId", fields.assessmentId);
  if (fields.controlId) form.set("controlId", fields.controlId);
  return new NextRequest("http://localhost/api/evidence", { method: "POST", body: form });
}

const pdf = () => new File([Buffer.from("pdf-bytes")], "report.pdf", { type: "application/pdf" });

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("POST /api/evidence", () => {
  it("returns 401 when not authenticated", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(null);
    const { POST } = await import("../route");
    const res = await POST(uploadRequest({ file: pdf(), assessmentId: "a-1", controlId: "c-1" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when no file is provided", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    const { POST } = await import("../route");
    const res = await POST(uploadRequest({ assessmentId: "a-1", controlId: "c-1" }));
    expect(res.status).toBe(400);
  });

  it("returns 422 for a disallowed file type", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    const { POST } = await import("../route");
    const bad = new File([Buffer.from("x")], "malware.exe", { type: "application/x-msdownload" });
    const res = await POST(uploadRequest({ file: bad, assessmentId: "a-1", controlId: "c-1" }));
    expect(res.status).toBe(422);
  });

  it("returns 403 when the user is not a tenant member", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue({ tenantId: "t-1" } as never);
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(false);
    const { POST } = await import("../route");
    const res = await POST(uploadRequest({ file: pdf(), assessmentId: "a-1", controlId: "c-1" }));
    expect(res.status).toBe(403);
  });

  it("saves the file and creates an evidence record (201)", async () => {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    const { saveEvidenceFile } = await import("@/lib/evidence/storage");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue({ tenantId: "t-1" } as never);
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(true);
    vi.mocked(prisma.controlResponse.findUnique).mockResolvedValue({ id: "r-1" } as never);
    vi.mocked(saveEvidenceFile).mockResolvedValue({ relativePath: "t-1/a-1/c-1/uuid_report.pdf", storedName: "uuid_report.pdf" });
    vi.mocked(prisma.evidence.create).mockResolvedValue({ id: "e-1" } as never);

    const { POST } = await import("../route");
    const res = await POST(uploadRequest({ file: pdf(), assessmentId: "a-1", controlId: "c-1" }));
    expect(res.status).toBe(201);
    expect(vi.mocked(saveEvidenceFile)).toHaveBeenCalledOnce();
  });
});

describe("DELETE /api/evidence/[evidenceId]", () => {
  async function callDelete(role: boolean, evidence: unknown = { filePath: "t-1/a-1/c-1/x.pdf", controlResponse: { assessment: { tenantId: "t-1" } } }) {
    const { getAuthSession } = await import("@/lib/auth/session");
    const { hasMinimumTenantRole } = await import("@/lib/auth/rbac");
    const { prisma } = await import("@/lib/prisma/client");
    const { deleteEvidenceFile } = await import("@/lib/evidence/storage");
    vi.mocked(getAuthSession).mockResolvedValue(makeSession());
    vi.mocked(prisma.evidence.findUnique).mockResolvedValue(evidence as never);
    vi.mocked(hasMinimumTenantRole).mockResolvedValue(role);
    vi.mocked(prisma.evidence.delete).mockResolvedValue({ id: "e-1" } as never);
    vi.mocked(deleteEvidenceFile).mockResolvedValue();
    const { DELETE } = await import("../[evidenceId]/route");
    return DELETE(new NextRequest("http://localhost/x", { method: "DELETE" }), {
      params: Promise.resolve({ evidenceId: "e-1" }),
    });
  }

  it("deletes file and row for a tenant member (200)", async () => {
    const res = await callDelete(true);
    expect(res.status).toBe(200);
    const { deleteEvidenceFile } = await import("@/lib/evidence/storage");
    expect(vi.mocked(deleteEvidenceFile)).toHaveBeenCalledWith("t-1/a-1/c-1/x.pdf");
  });

  it("returns 404 when the evidence does not exist", async () => {
    const res = await callDelete(true, null);
    expect(res.status).toBe(404);
  });

  it("returns 403 when the user is not a tenant member", async () => {
    const res = await callDelete(false);
    expect(res.status).toBe(403);
  });
});
