import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { getUserTenants } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import { calculateCompletion, getUpcomingDeadlines } from "@/lib/utils/compliance";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DeadlineList } from "@/components/dashboard/DeadlineList";

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  const tenants = await getUserTenants(session.userId);
  const tenantIds = session.isSuperAdmin
    ? (await prisma.tenant.findMany({ select: { id: true } })).map((t) => t.id)
    : tenants.map((t) => t.id);

  // Fetch assessments with response counts and deadlines
  const assessments = await prisma.assessment.findMany({
    where: { tenantId: { in: tenantIds } },
    orderBy: { createdAt: "desc" },
    include: {
      framework: { select: { code: true, name: true } },
      tenant: { select: { name: true } },
      responses: {
        select: {
          id: true,
          status: true,
          maturityLevel: true,
          deadline: true,
          controlId: true,
          control: {
            select: {
              id: true,
              code: true,
              name: true,
              domain: { select: { code: true, name: true, order: true } },
            },
          },
        },
      },
    },
  });

  // Build deadline items across all assessments
  const deadlineItems = assessments.flatMap((assessment) => {
    const deadlineResponses = assessment.responses.map((r) => ({
      status: r.status,
      maturityLevel: r.maturityLevel,
      deadline: r.deadline,
      domain: r.control.domain,
      controlCode: r.control.code,
      controlName: r.control.name,
    }));
    return getUpcomingDeadlines(deadlineResponses, 30).map((d) => ({
      ...d,
      assessmentId: assessment.id,
      controlId: assessment.responses.find((r) => r.control.code === d.controlCode)!.controlId,
      assessmentName: assessment.name,
      daysLeft: Math.max(0, Math.ceil((d.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
    }));
  }).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 10);

  // Stats
  const totalAssessments = assessments.length;
  const activeAssessments = assessments.filter((a) => a.status === "IN_PROGRESS").length;
  const allResponses = assessments.flatMap((a) =>
    a.responses.map((r) => ({ status: r.status, maturityLevel: r.maturityLevel, deadline: r.deadline, domain: r.control.domain, controlCode: r.control.code, controlName: r.control.name }))
  );
  const { pct: avgPct } = calculateCompletion(allResponses);

  const noTenants = tenantIds.length === 0;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Welcome back, {session.email}.
      </p>

      {/* Empty states */}
      {noTenants && !session.isSuperAdmin && (
        <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">You are not assigned to any organization yet.</p>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">Contact your administrator to be added.</p>
        </div>
      )}
      {session.isSuperAdmin && noTenants && (
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">No organizations yet.</p>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
            <Link href="/dashboard/tenants/new" className="underline">Create your first organization</Link> to get started.
          </p>
        </div>
      )}

      {!noTenants && (
        <>
          {/* Stats */}
          <div className="mt-6">
            <StatsCards
              cards={[
                { label: "Total Assessments", value: totalAssessments },
                { label: "In Progress", value: activeAssessments },
                {
                  label: "Avg Completion",
                  value: totalAssessments > 0 ? `${avgPct}%` : "—",
                  sub: "across all assessments",
                },
                { label: "Upcoming Deadlines", value: deadlineItems.length, sub: "within 30 days" },
              ]}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Recent assessments */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Assessments</h2>
                <Link href="/dashboard/assessments" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                  View all →
                </Link>
              </div>
              {assessments.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No assessments yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
                  {assessments.slice(0, 5).map((a) => {
                    const { pct } = calculateCompletion(
                      a.responses.map((r) => ({ status: r.status, maturityLevel: r.maturityLevel, deadline: r.deadline, domain: r.control.domain, controlCode: r.control.code, controlName: r.control.name }))
                    );
                    return (
                      <li key={a.id}>
                        <Link
                          href={`/dashboard/assessments/${a.id}`}
                          className="group flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                              {a.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {a.framework.name} · {a.tenant.name}
                            </p>
                          </div>
                          <div className="w-20 shrink-0 text-right">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{pct}%</span>
                            <div className="mt-1 h-1 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                              <div className="h-1 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Upcoming deadlines */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
                <DeadlineList items={deadlineItems} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
