import { type NextRequest, NextResponse } from "next/server";

import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { getAuthSession } from "@/lib/auth/session";
import { deleteEvidenceFile, readEvidenceFile } from "@/lib/evidence/storage";
import { prisma } from "@/lib/prisma/client";
import { err, ok } from "@/lib/utils/api";

interface RouteContext {
  params: Promise<{ evidenceId: string }>;
}

async function loadEvidenceWithTenant(evidenceId: string) {
  return prisma.evidence.findUnique({
    where: { id: evidenceId },
    include: {
      controlResponse: {
        select: { assessment: { select: { tenantId: true } } },
      },
    },
  });
}

// GET /api/evidence/[evidenceId] — stream the file (auth-gated; direct path access is blocked).
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { evidenceId } = await params;
  const evidence = await loadEvidenceWithTenant(evidenceId);
  if (!evidence) return err("Evidence not found", 404);

  const tenantId = evidence.controlResponse.assessment.tenantId;
  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ASSESSOR");
  if (!canAccess) return err("Forbidden", 403);

  let bytes: Buffer;
  try {
    bytes = await readEvidenceFile(evidence.filePath);
  } catch {
    return err("Evidence file is missing on disk", 410);
  }

  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": evidence.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(evidence.fileName)}"`,
      "Content-Length": String(bytes.length),
    },
  });
}

// DELETE /api/evidence/[evidenceId] — remove the DB row and the file on disk.
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { evidenceId } = await params;
  const evidence = await loadEvidenceWithTenant(evidenceId);
  if (!evidence) return err("Evidence not found", 404);

  const tenantId = evidence.controlResponse.assessment.tenantId;
  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ASSESSOR");
  if (!canAccess) return err("Forbidden", 403);

  await deleteEvidenceFile(evidence.filePath);
  await prisma.evidence.delete({ where: { id: evidenceId } });

  return ok({ deleted: true });
}
