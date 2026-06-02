import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { getUserTenants } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import { NewAssessmentForm } from "@/components/assessments/NewAssessmentForm";

export default async function NewAssessmentPage() {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  const tenants = await getUserTenants(session.userId);
  const adminTenants = session.isSuperAdmin
    ? await prisma.tenant.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
    : tenants.filter((t) => t.role === "ADMIN").map((t) => ({ id: t.id, name: t.name }));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Assessment</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Pick a framework — every control is added as a response you can fill in.
      </p>

      {adminTenants.length === 0 ? (
        <NoOrganization isSuperAdmin={session.isSuperAdmin} />
      ) : (
        <NewAssessmentFormLoader adminTenants={adminTenants} />
      )}
    </div>
  );
}

// Empty state shown when there is no organization the user can create an
// assessment in — instead of silently bouncing back to the list.
function NoOrganization({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  return (
    <div className="mt-8 max-w-lg rounded-xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
      {isSuperAdmin ? (
        <>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
            No organization yet
          </p>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
            An assessment belongs to an organization. Create one first, then come back
            here to start an assessment.
          </p>
          <Link
            href="/dashboard/tenants/new"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create an organization
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
            You can&apos;t create an assessment
          </p>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
            Only a Tenant Admin can create assessments. Ask your administrator to create
            one, or to grant you the Admin role in an organization.
          </p>
          <Link
            href="/dashboard/assessments"
            className="mt-4 inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back to assessments
          </Link>
        </>
      )}
    </div>
  );
}

async function NewAssessmentFormLoader({
  adminTenants,
}: {
  adminTenants: { id: string; name: string }[];
}) {
  const frameworks = await prisma.framework.findMany({
    select: { id: true, name: true, version: true },
    orderBy: { code: "asc" },
  });
  return <NewAssessmentForm tenants={adminTenants} frameworks={frameworks} />;
}
