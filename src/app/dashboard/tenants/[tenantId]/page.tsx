import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";

type Props = { params: Promise<{ tenantId: string }> };

export default async function TenantDetailPage({ params }: Props) {
  const { tenantId } = await params;
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  const canAccess = await hasMinimumTenantRole(session.userId, tenantId, "ADMIN");
  if (!canAccess) redirect("/dashboard");

  const [tenant, members] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: tenantId } }),
    prisma.tenantUser.findMany({
      where: { tenantId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!tenant) notFound();

  return (
    <div className="p-8">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/tenants" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          ← Organizations
        </Link>
      </div>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tenant.name}</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">/{tenant.slug}</p>
          {tenant.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{tenant.description}</p>
          )}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          tenant.isActive
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-500"
        }`}>
          {tenant.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Members ({members.length})</h2>
          <Link href={`/dashboard/users?tenantId=${tenantId}`}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            Manage users →
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                {["Name", "Email", "Role"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {members.map((m) => (
                <tr key={m.userId}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{m.user.name ?? "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{m.user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      m.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {m.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
