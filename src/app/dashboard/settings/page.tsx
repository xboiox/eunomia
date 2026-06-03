import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { getLicenseStatus } from "@/lib/license/check";
import { ChangeLicenseKeyForm } from "@/components/dashboard/ChangeLicenseKeyForm";

function formatDate(date: Date | null): string {
  return date ? date.toLocaleDateString() : "—";
}

function formatDateTime(date: Date | null): string {
  return date ? date.toLocaleString() : "—";
}

export default async function SettingsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  const license = session.isSuperAdmin ? await getLicenseStatus() : null;

  const licenseState: { label: string; className: string } = !license?.activated
    ? { label: "Not activated", className: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" }
    : license.isExpired
      ? { label: "Expired", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" }
      : { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Application settings and preferences.
      </p>

      <div className="mt-8 max-w-2xl space-y-6">
        {/* Account */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Account</h2>
          <dl className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500 dark:text-gray-400">Email</dt>
              <dd className="font-medium text-gray-900 dark:text-white">{session.email}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500 dark:text-gray-400">Role</dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {session.isSuperAdmin ? "Super Admin" : "User"}
              </dd>
            </div>
          </dl>
        </section>

        {/* License — Super Admin only. Shows status only, never the key value. */}
        {session.isSuperAdmin && license && (
          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">License</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${licenseState.className}`}>
                {licenseState.label}
              </span>
            </div>

            <dl className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {license.licenseType ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Max organizations</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {license.maxTenants ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Expires</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {license.expiresAt ? formatDate(license.expiresAt) : "Never"}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Last validated</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {formatDateTime(license.lastValidatedAt)}
                </dd>
              </div>
            </dl>

            <ChangeLicenseKeyForm />
          </section>
        )}

        {/* Coming soon */}
        <section className="rounded-xl border border-dashed border-gray-300 p-6 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Additional settings (profile, notifications, API keys) will be available in a future release.
          </p>
        </section>
      </div>
    </div>
  );
}
