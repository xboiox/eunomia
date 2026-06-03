import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import {
  calculateCompletion,
  calculateNistMaturityByDomain,
  groupByStatus,
} from "@/lib/utils/compliance";
import { AssessmentManageBar } from "@/components/assessments/AssessmentManageBar";
import { AssessmentControls } from "@/components/assessments/AssessmentControls";
import { StatusBreakdownChart } from "@/components/charts/StatusBreakdownChart";
import { DomainProgressChart } from "@/components/charts/DomainProgressChart";
import { MaturityRadarChart } from "@/components/charts/MaturityRadarChart";

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

  // Compliance data for charts (computed server-side, passed as plain values)
  const responsesForCalc = responses.map((r) => ({
    status: r.status,
    maturityLevel: r.maturityLevel,
    deadline: r.deadline,
    domain: r.control.domain,
    controlCode: r.control.code,
    controlName: r.control.name,
  }));

  const statusCounts = groupByStatus(responsesForCalc);

  // Per-domain completion % for bar chart
  const domainMap = new Map<string, { name: string; order: number; done: number; total: number }>();
  for (const r of responses) {
    const key = r.control.domain.code;
    if (!domainMap.has(key)) {
      domainMap.set(key, { name: r.control.domain.name, order: r.control.domain.order, done: 0, total: 0 });
    }
    const d = domainMap.get(key)!;
    d.total++;
    if (r.status === "IMPLEMENTED" || r.status === "NOT_APPLICABLE") d.done++;
  }
  const domainProgress = Array.from(domainMap.entries())
    .map(([code, d]) => ({
      code,
      name: d.name,
      pct: d.total > 0 ? Math.round((d.done / d.total) * 100) : 0,
    }))
    .sort((a, b) => (domainMap.get(a.code)?.order ?? 0) - (domainMap.get(b.code)?.order ?? 0));

  const nistDomainMaturity = isNist ? calculateNistMaturityByDomain(responsesForCalc) : [];

  // Map to client component shape
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

  const { total, done, pct } = calculateCompletion(responsesForCalc);

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

      {/* ── Charts ────────────────────────────────────────────── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Status breakdown donut */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Status Breakdown</h2>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {pct}%{" "}
              <span className="text-xs font-normal text-gray-400">({done}/{total})</span>
            </span>
          </div>
          <StatusBreakdownChart counts={statusCounts} isNist={isNist} />
        </div>

        {/* NIST radar OR domain progress */}
        {isNist ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Avg Maturity by Function
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Scale 1 (Ad-Hoc) → 5 (Industry Best)
            </p>
            <MaturityRadarChart domains={nistDomainMaturity} />
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Completion by Domain
            </h2>
            <div className="mt-3">
              <DomainProgressChart domains={domainProgress} />
            </div>
          </div>
        )}
      </div>

      {/* Domain progress bar for NIST (in addition to radar) */}
      {isNist && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Completion by Function
          </h2>
          <div className="mt-3">
            <DomainProgressChart domains={domainProgress} />
          </div>
        </div>
      )}

      {/* Controls list with clickable filter */}
      <AssessmentControls assessmentId={assessmentId} isNist={isNist} responses={rows} />
    </div>
  );
}
