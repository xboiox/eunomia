"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type FormState = "idle" | "loading" | "success";

export default function ActivatePage() {
  const router = useRouter();
  const [licenseKey, setLicenseKey] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFormState("loading");

    try {
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Activation failed. Please try again.");
        setFormState("idle");
        return;
      }

      setFormState("success");
      toast.success("License activated!");
      router.push("/signin");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setFormState("idle");
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Eunomia
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            IT Security Compliance Dashboard
          </p>
        </div>

        <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Activate License
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Enter the license key provided by your administrator.
        </p>

        {formState === "success" ? (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-center">
            <p className="text-green-700 dark:text-green-400 font-medium">
              License activated! Redirecting…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="licenseKey"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                License Key
              </label>
              <input
                id="licenseKey"
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                required
                disabled={formState === "loading"}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={formState === "loading" || !licenseKey.trim()}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-4 py-2.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {formState === "loading" ? "Activating…" : "Activate"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          Need a license key? Contact your Eunomia provider.
        </p>
      </div>
    </div>
  );
}
