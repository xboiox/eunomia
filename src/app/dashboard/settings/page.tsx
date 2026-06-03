import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";

export default async function SettingsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

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
