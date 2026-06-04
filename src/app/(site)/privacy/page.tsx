import Link from "next/link";
import { type Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Eunomia" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FF] px-4 py-16 dark:bg-dark">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm dark:bg-dark-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Last updated: June 2026</p>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            Eunomia is a self-hosted IT Security Compliance Dashboard deployed and operated by your
            organization. All data entered into this system — including assessment responses, evidence
            files, and user accounts — is stored exclusively on your organization&apos;s own
            infrastructure and is not shared with any third party.
          </p>
          <p>
            This policy will be updated to reflect the specific data handling practices of your
            deployment. Please contact your system administrator for details.
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
