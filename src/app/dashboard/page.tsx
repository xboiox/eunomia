import Link from "next/link";
import { getAuthSession } from "@/lib/auth/session";
import { getUserTenants } from "@/lib/auth/rbac";

export default async function DashboardPage() {
  const session = await getAuthSession();
  const tenants = session ? await getUserTenants(session.userId) : [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Welcome back{session?.email ? `, ${session.email}` : ""}.
      </p>

      {tenants.length === 0 && !session?.isSuperAdmin && (
        <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 p-6">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
            You are not assigned to any organization yet.
          </p>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
            Contact your administrator to be added to an organization.
          </p>
        </div>
      )}

      {session?.isSuperAdmin && tenants.length === 0 && (
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 p-6">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            No organizations yet.
          </p>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
            <Link href="/dashboard/tenants/new" className="underline">Create your first organization</Link> to get started.
          </p>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-400 dark:text-gray-500">
        Assessment dashboards and compliance charts will appear here in Phase 6.
      </div>
    </div>
  );
}
