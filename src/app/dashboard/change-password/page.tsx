"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const mismatch = confirm && newPassword !== confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Failed to change password");
        return;
      }
      // Sign out so the next login issues a fresh JWT without mustChangePassword.
      await signOut({ callbackUrl: "/signin?passwordChanged=1" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Change your password
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Your account requires a new password before you can continue. Please
          choose a strong password of at least 8 characters.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Current (temporary) password
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            New password
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm new password
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className={`${inputClass} ${mismatch ? "border-red-400 focus:border-red-500" : ""}`}
            />
            {mismatch && (
              <span className="mt-1 text-xs text-red-600 dark:text-red-400">
                Passwords do not match
              </span>
            )}
          </label>

          <button
            type="submit"
            disabled={submitting || !!mismatch || !currentPassword || !newPassword}
            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Set new password"}
          </button>
        </form>
      </div>
    </div>
  );
}
