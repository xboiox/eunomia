import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import { AssessmentManageBar } from "@/components/assessments/AssessmentManageBar";
import { AssessmentControls } from "@/components/assessments/AssessmentControls";

interface PageProps {
  params: Promise<{ assessmentId: string }>;
}

export default async function AssessmentDetailPage({ params }: PageProps) {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  const { assessmentId } = await params;
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { framework: true, tenant: { select: { name: true } } },
  });
  if (!assessment) notFound();

  const canAccess = await hasMinimumTenantRole(session.userId, assessment.tenantId, "ASSESSOR");
  if (!canAccess) redirect("/dashboard/assessments");

  const isAdmin = await hasMinimumTenantRole(session.userId, assessment.tenantId, "ADMIN");

  const responses = await prisma.controlResponse.findMany({
    where: { assessmentId },
    include: {
      control: {
        select: {
          id: true,
          code: true,
          name: true,
          order: true,
          domain: { select: { id: true, code: true, name: true, order: true } },
        },
      },
      _count: { select: { evidences: true } },
    },
  });

  const isNist = assessment.framework.code === "NIST_CSF";

  // Map to the plain serializable shape the client component expects.
  const rows = responses.map((r) => ({
    id: r.id,
    controlId: r.controlId,
    status: r.status,
    maturityLevel: r.maturityLevel,
    evidenceCount: r._count.evidences,
    control: {
      code: r.control.code,
      name: r.control.name,
      order: r.control.order,
      domain: r.control.domain,
    },
  }));

  return (
    <div className="p-8">
      <Link href="/dashboard/assessments" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← Assessments
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.name}</h1>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {assessment.status.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {assessment.framework.name} ({assessment.framework.version}) · {assessment.tenant.name}
        {assessment.overallDeadline
          ? ` · due ${assessment.overallDeadline.toLocaleDateString()}`
          : ""}
      </p>
      {assessment.description && (
        <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-300">{assessment.description}</p>
      )}

      {/* Manage (Tenant Admin only) */}
      {isAdmin && (
        <AssessmentManageBar
          assessmentId={assessment.id}
          currentStatus={assessment.status}
          assessmentName={assessment.name}
        />
      )}

      <AssessmentControls assessmentId={assessmentId} isNist={isNist} responses={rows} />
    </div>
  );
}
