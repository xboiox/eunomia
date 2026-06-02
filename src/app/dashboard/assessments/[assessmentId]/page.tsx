import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import { AssessmentManageBar } from "@/components/assessments/AssessmentManageBar";

interface PageProps {
  params: Promise<{ assessmentId: string }>;
}

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  IMPLEMENTED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  NOT_APPLICABLE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

function label(status: string): string {
  return status.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
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
          sectionName: true,
          order: true,
          domain: { select: { id: true, code: true, name: true, order: true } },
        },
      },
      _count: { select: { evidences: true } },
    },
  });

  const isNist = assessment.framework.code === "NIST_CSF";
  const total = responses.length;
  const counts = responses.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  const done = (counts.IMPLEMENTED ?? 0) + (counts.NOT_APPLICABLE ?? 0);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Group responses by domain, preserving order.
  const sorted = [...responses].sort((a, b) => {
    const d = a.control.domain.order - b.control.domain.order;
    return d !== 0 ? d : a.control.order - b.control.order;
  });
  const domains = new Map<string, { code: string; name: string; rows: typeof sorted }>();
  for (const r of sorted) {
    const key = r.control.domain.id;
    if (!domains.has(key)) {
      domains.set(key, { code: r.control.domain.code, name: r.control.domain.name, rows: [] });
    }
    domains.get(key)!.rows.push(r);
  }

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

      {/* Progress */}
      <div className="mt-6 max-w-md">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">{pct}% complete</span>
          <span>{done}/{total} controls</span>
        </div>
        <div className="mt-1 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
          <div className="h-2 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["NOT_STARTED", "IN_PROGRESS", "IMPLEMENTED", "NOT_APPLICABLE"].map((s) => (
            <span key={s} className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[s]}`}>
              {label(s)}: {counts[s] ?? 0}
            </span>
          ))}
        </div>
      </div>

      {/* Controls grouped by domain */}
      <div className="mt-8 space-y-8">
        {Array.from(domains.values()).map((domain) => (
          <section key={domain.code}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              <span className="text-gray-400">{domain.code}</span> {domain.name}
            </h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {domain.rows.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/dashboard/assessments/${assessmentId}/controls/${r.control.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <span className="shrink-0 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {r.control.code}
                      </span>
                      <span className="flex-1 text-sm text-gray-900 dark:text-white">{r.control.name}</span>
                      {isNist && r.maturityLevel != null && (
                        <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">L{r.maturityLevel}</span>
                      )}
                      {r._count.evidences > 0 && (
                        <span className="shrink-0 text-xs text-gray-400" title="evidence files">
                          📎 {r._count.evidences}
                        </span>
                      )}
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                        {label(r.status)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
