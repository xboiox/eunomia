import Link from "next/link";
import { type Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use — Eunomia" };

export default function PolicyPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FF] px-4 py-16 dark:bg-dark">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm dark:bg-dark-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Terms of Use</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Last updated: June 2026</p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            Access to this system is restricted to authorized personnel of your organization.
            Unauthorized access is prohibited. All activities performed within this system may be
            logged and audited.
          </p>
          <p>
            By using this system you agree to handle all compliance data responsibly and in
            accordance with your organization&apos;s information security policies.
          </p>
          <p>
            These terms will be updated to reflect the specific usage policies of your deployment.
            Please contact your system administrator for details.
          </p>
        </div>

        <div className="mt-8">
          <Link href="/signin" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
