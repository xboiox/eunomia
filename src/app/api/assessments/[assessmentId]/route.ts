import { type NextRequest } from "next/server";

import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { getAuthSession } from "@/lib/auth/session";
import { deleteEvidenceFile } from "@/lib/evidence/storage";
import { prisma } from "@/lib/prisma/client";
import { err, ok } from "@/lib/utils/api";

interface RouteContext {
  params: Promise<{ assessmentId: string }>;
}

const ASSESSMENT_STATUSES = ["DRAFT", "IN_PROGRESS", "COMPLETED"] as const;
type AssessmentStatus = (typeof ASSESSMENT_STATUSES)[number];

// GET /api/assessments/[assessmentId]
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { assessmentId } = await params;
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      framework: { select: { code: true, name: true, version: true } },
      _count: { select: { responses: true } },
    },
  });
  if (!assessment) return err("Assessment not found", 404);

  const canAccess = await hasMinimumTenantRole(session.userId, assessment.tenantId, "ASSESSOR");
  if (!canAccess) return err("Forbidden", 403);

  return ok(assessment);
}

interface PatchBody {
  name?: string;
  description?: string;
  status?: string;
  overallDeadline?: string | null;
}

// PATCH /api/assessments/[assessmentId] — Tenant Admin only.
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { assessmentId } = await params;
  const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) return err("Assessment not found", 404);

  const canManage = await hasMinimumTenantRole(session.userId, assessment.tenantId, "ADMIN");
  if (!canManage) return err("Only a Tenant Admin can update assessments", 403);

  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return err("Invalid request body", 400);
  }

  if (body.status && !ASSESSMENT_STATUSES.includes(body.status as AssessmentStatus)) {
    return err("Invalid status", 400);
  }

  const updated = await prisma.assessment.update({
    where: { id: assessmentId },
    data: {
      ...(body.name?.trim() ? { name: body.name.trim() } : {}),
      ...(body.description !== undefined ? { description: body.description?.trim() || null } : {}),
      ...(body.status ? { status: body.status as AssessmentStatus } : {}),
      ...(body.overallDeadline !== undefined
        ? { overallDeadline: body.overallDeadline ? new Date(body.overallDeadline) : null }
        : {}),
    },
  });

  return ok(updated);
}

// DELETE /api/assessments/[assessmentId] — Tenant Admin only. Cascades responses.
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { assessmentId } = await params;
  const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) return err("Assessment not found", 404);

  const canManage = await hasMinimumTenantRole(session.userId, assessment.tenantId, "ADMIN");
  if (!canManage) return err("Only a Tenant Admin can delete assessments", 403);

  // Remove evidence files from disk before the DB cascade drops their rows.
  const evidences = await prisma.evidence.findMany({
    where: { controlResponse: { assessmentId } },
    select: { filePath: true },
  });
  await Promise.all(evidences.map((e) => deleteEvidenceFile(e.filePath)));

  await prisma.assessment.delete({ where: { id: assessmentId } });
  return ok({ deleted: true });
}
