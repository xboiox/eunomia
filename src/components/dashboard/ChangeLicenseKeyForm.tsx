"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export function ChangeLicenseKeyForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/license/activate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        setMessage({ type: "err", text: body.error ?? "Failed to update license key" });
        return;
      }
      setMessage({ type: "ok", text: "License key updated." });
      setLicenseKey("");
      setOpen(false);
      router.refresh();
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <div className="mt-4">
        {message && (
          <p
            className={`mb-2 text-sm ${
              message.type === "ok"
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Change license key
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      {message && (
        <p
          className={`text-sm ${
            message.type === "ok"
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        New license key
        <input
          type="text"
          required
          autoComplete="off"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          placeholder="Enter the new license key"
          className={inputClass}
        />
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        The key is validated against the license server before it replaces the current one.
      </p>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || !licenseKey.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Validating…" : "Save key"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setLicenseKey("");
            setMessage(null);
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
