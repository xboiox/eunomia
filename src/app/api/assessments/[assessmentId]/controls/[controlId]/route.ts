import { type NextRequest } from "next/server";

import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";
import { err, ok } from "@/lib/utils/api";

interface RouteContext {
  params: Promise<{ assessmentId: string; controlId: string }>;
}

const COMPLIANCE_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "IMPLEMENTED",
  "NOT_APPLICABLE",
] as const;
type ComplianceStatus = (typeof COMPLIANCE_STATUSES)[number];

const MIN_MATURITY = 1;
const MAX_MATURITY = 5;

interface PutBody {
  status?: string;
  maturityLevel?: number | null;
  notes?: string | null;
  deadline?: string | null;
}

// PUT /api/assessments/[assessmentId]/controls/[controlId] — upsert a control
// response. Any assessor in the tenant may update it (collaborative).
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { assessmentId, controlId } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { tenantId: true },
  });
  if (!assessment) return err("Assessment not found", 404);

  const canAccess = await hasMinimumTenantRole(session.userId, assessment.tenantId, "ASSESSOR");
  if (!canAccess) return err("Forbidden", 403);

  let body: PutBody;
  try {
    body = await request.json();
  } catch {
    return err("Invalid request body", 400);
  }

  if (body.status && !COMPLIANCE_STATUSES.includes(body.status as ComplianceStatus)) {
    return err("Invalid status", 400);
  }

  if (
    body.maturityLevel !== undefined &&
    body.maturityLevel !== null &&
    (body.maturityLevel < MIN_MATURITY || body.maturityLevel > MAX_MATURITY)
  ) {
    return err(`maturityLevel must be between ${MIN_MATURITY} and ${MAX_MATURITY}`, 400);
  }

  const data = {
    ...(body.status ? { status: body.status as ComplianceStatus } : {}),
    ...(body.maturityLevel !== undefined ? { maturityLevel: body.maturityLevel } : {}),
    ...(body.notes !== undefined ? { notes: body.notes?.trim() || null } : {}),
    ...(body.deadline !== undefined
      ? { deadline: body.deadline ? new Date(body.deadline) : null }
      : {}),
    lastUpdatedById: session.userId,
  };

  const response = await prisma.controlResponse.upsert({
    where: { assessmentId_controlId: { assessmentId, controlId } },
    update: data,
    create: {
      assessmentId,
      controlId,
      lastUpdatedById: session.userId,
      status: (body.status as ComplianceStatus) ?? "NOT_STARTED",
      maturityLevel: body.maturityLevel ?? null,
      notes: body.notes?.trim() || null,
      deadline: body.deadline ? new Date(body.deadline) : null,
    },
  });

  return ok(response);
}
