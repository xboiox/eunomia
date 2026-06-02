import { type NextRequest } from "next/server";

import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma/client";
import { err, ok } from "@/lib/utils/api";

interface RouteContext {
  params: Promise<{ assessmentId: string }>;
}

// GET /api/assessments/[assessmentId]/controls — all control responses for the
// assessment, joined with control + domain info, ordered by domain then control.
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  const { assessmentId } = await params;
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { tenantId: true },
  });
  if (!assessment) return err("Assessment not found", 404);

  const canAccess = await hasMinimumTenantRole(session.userId, assessment.tenantId, "ASSESSOR");
  if (!canAccess) return err("Forbidden", 403);

  const responses = await prisma.controlResponse.findMany({
    where: { assessmentId },
    include: {
      control: {
        select: {
          id: true,
          code: true,
          name: true,
          sectionCode: true,
          sectionName: true,
          order: true,
          domain: { select: { id: true, code: true, name: true, order: true } },
        },
      },
      _count: { select: { evidences: true } },
    },
  });

  const sorted = responses.sort((a, b) => {
    const domainDiff = a.control.domain.order - b.control.domain.order;
    return domainDiff !== 0 ? domainDiff : a.control.order - b.control.order;
  });

  return ok(sorted, 200, { total: sorted.length });
}
