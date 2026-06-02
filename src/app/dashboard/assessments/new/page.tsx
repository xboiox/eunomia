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

  // Only Tenant Admins (or Super Admin) can reach the create flow.
  if (adminTenants.length === 0) redirect("/dashboard/assessments");

  const frameworks = await prisma.framework.findMany({
    select: { id: true, name: true, version: true },
    orderBy: { code: "asc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Assessment</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Pick a framework — every control is added as a response you can fill in.
      </p>
      <NewAssessmentForm tenants={adminTenants} frameworks={frameworks} />
    </div>
  );
}
