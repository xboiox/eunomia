import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { getLicenseStatus } from "@/lib/license/check";
import { ChangeLicenseKeyForm } from "@/components/dashboard/ChangeLicenseKeyForm";
import { SecurityPolicyForm } from "@/components/dashboard/SecurityPolicyForm";
import { ChangePasswordForm } from "@/components/dashboard/ChangePasswordForm";

const EXPIRY_WARNING_DAYS = 30;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function formatDate(date: Date | null): string {
  return date ? date.toLocaleDateString() : "—";
}

function formatDateTime(date: Date | null): string {
  return date ? date.toLocaleString() : "—";
}

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / MS_PER_DAY);
}

function expiryRelativeLabel(date: Date): string {
  const days = daysUntil(date);
  if (days < 0) return `expired ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  if (days === 0) return "expires today";
  return `in ${days} day${days === 1 ? "" : "s"}`;
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

  // Warn when an active license is within the expiry window (and not perpetual).
  const expiringSoon =
    license?.activated &&
    !license.isExpired &&
    license.expiresAt !== null &&
    daysUntil(license.expiresAt) <= EXPIRY_WARNING_DAYS;

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

          <ChangePasswordForm />
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
                <dd className="text-right font-medium text-gray-900 dark:text-white">
                  {license.expiresAt ? (
                    <>
                      {formatDate(license.expiresAt)}
                      <span
                        className={`ml-1 font-normal ${
                          license.isExpired
                            ? "text-red-600 dark:text-red-400"
                            : expiringSoon
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        ({expiryRelativeLabel(license.expiresAt)})
                      </span>
                    </>
                  ) : (
                    "Never"
                  )}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Last validated</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {formatDateTime(license.lastValidatedAt)}
                </dd>
              </div>
            </dl>

            {expiringSoon && license.expiresAt && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                This license expires {expiryRelativeLabel(license.expiresAt)}. Renew it on the
                license server to avoid losing access.
              </div>
            )}

            <ChangeLicenseKeyForm />
          </section>
        )}

        {/* Security Policy — Super Admin only */}
        {session.isSuperAdmin && (
          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Security Policy</h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Password expiry and account lockout apply to all users. Changes take effect on next login.
            </p>
            <SecurityPolicyForm />
          </section>
        )}

        {/* System Configuration — Super Admin only (read-only env info) */}
        {session.isSuperAdmin && (
          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">System Configuration</h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Read-only. Change these values in your <code className="font-mono">.env</code> file and restart the server.
            </p>
            <dl className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Evidence upload path</dt>
                <dd className="font-mono text-xs font-medium text-gray-900 dark:text-white">
                  {process.env.UPLOAD_DIR ?? "./uploads"}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Max file size</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {process.env.MAX_FILE_SIZE_MB ?? "50"} MB
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Email server</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {process.env.EMAIL_SERVER_HOST
                    ? `${process.env.EMAIL_SERVER_HOST}:${process.env.EMAIL_SERVER_PORT ?? "587"}`
                    : <span className="text-amber-600 dark:text-amber-400">Not configured</span>}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Email from</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {process.env.EMAIL_FROM ?? <span className="text-gray-400 dark:text-gray-500">—</span>}
                </dd>
              </div>
            </dl>
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
