import { type NextRequest } from "next/server";

import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";
import { err, ok } from "@/lib/utils/api";

// GET /api/assessments?tenantId=... — list assessments for a tenant.
export async function GET(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const tenantId = request.nextUrl.searchParams.get("tenantId");
  if (!tenantId) return err("tenantId is required", 400);

  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ASSESSOR");
  if (!canAccess) return err("Forbidden", 403);

  const assessments = await prisma.assessment.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: {
      framework: { select: { code: true, name: true, version: true } },
      _count: { select: { responses: true } },
    },
  });

  return ok(assessments, 200, { total: assessments.length });
}

interface CreateBody {
  tenantId?: string;
  frameworkId?: string;
  name?: string;
  description?: string;
  overallDeadline?: string;
}

// POST /api/assessments — create an assessment and auto-stub a response for
// every control in the chosen framework (NOT_STARTED). Tenant Admin only.
export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  let body: CreateBody;
  try {
    body = await request.json();
  } catch {
    return err("Invalid request body", 400);
  }

  const { tenantId, frameworkId, name, description, overallDeadline } = body;
  if (!tenantId || !frameworkId || !name?.trim()) {
    return err("tenantId, frameworkId and name are required", 400);
  }

  const canManage = await hasMinimumTenantRole(session.userId, tenantId, "ADMIN");
  if (!canManage) return err("Only a Tenant Admin can create assessments", 403);

  const controls = await prisma.control.findMany({
    where: { domain: { frameworkId } },
    select: { id: true },
  });
  if (controls.length === 0) {
    return err("Framework not found or has no controls", 422);
  }

  const assessment = await prisma.assessment.create({
    data: {
      tenantId,
      frameworkId,
      name: name.trim(),
      description: description?.trim() || null,
      overallDeadline: overallDeadline ? new Date(overallDeadline) : null,
      createdById: session.userId,
      responses: {
        create: controls.map((control) => ({
          controlId: control.id,
          lastUpdatedById: session.userId,
        })),
      },
    },
    include: { _count: { select: { responses: true } } },
  });

  return ok(assessment, 201);
}
