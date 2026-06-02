import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { getUserTenants } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default async function AssessmentsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  const tenants = await getUserTenants(session.userId);
  const tenantIds = session.isSuperAdmin
    ? (await prisma.tenant.findMany({ select: { id: true } })).map((t) => t.id)
    : tenants.map((t) => t.id);

  const canCreate = session.isSuperAdmin || tenants.some((t) => t.role === "ADMIN");

  const assessments = await prisma.assessment.findMany({
    where: { tenantId: { in: tenantIds } },
    orderBy: { createdAt: "desc" },
    include: {
      framework: { select: { code: true, name: true } },
      tenant: { select: { name: true } },
      _count: { select: { responses: true } },
    },
  });

  // Completion = (IMPLEMENTED + NOT_APPLICABLE) / total responses, per assessment.
  const grouped = assessments.length
    ? await prisma.controlResponse.groupBy({
        by: ["assessmentId", "status"],
        where: { assessmentId: { in: assessments.map((a) => a.id) } },
        _count: { _all: true },
      })
    : [];
  const doneByAssessment = new Map<string, number>();
  for (const row of grouped) {
    if (row.status === "IMPLEMENTED" || row.status === "NOT_APPLICABLE") {
      doneByAssessment.set(
        row.assessmentId,
        (doneByAssessment.get(row.assessmentId) ?? 0) + row._count._all,
      );
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {assessments.length} assessment{assessments.length === 1 ? "" : "s"}
          </p>
        </div>
        {canCreate && (
          <Link
            href="/dashboard/assessments/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Assessment
          </Link>
        )}
      </div>

      {assessments.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No assessments yet.</p>
          {canCreate && (
            <Link
              href="/dashboard/assessments/new"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create your first assessment
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assessments.map((a) => {
            const total = a._count.responses;
            const done = doneByAssessment.get(a.id) ?? 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Link
                key={a.id}
                href={`/dashboard/assessments/${a.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-gray-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                    {a.name}
                  </h2>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[a.status] ?? ""}`}>
                    {a.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {a.framework.name} · {a.tenant.name}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{pct}% complete</span>
                    <span>{done}/{total}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                    <div className="h-1.5 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
