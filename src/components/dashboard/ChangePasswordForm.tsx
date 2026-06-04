"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const mismatch = confirm.length > 0 && newPassword !== confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirm) { setError("Passwords do not match"); return; }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await res.json();
      if (!res.ok) { setError(body.error ?? "Failed to change password"); return; }
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      setOpen(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        Change password
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-sm">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Current password
        <input type="password" required value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password" className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        New password
        <input type="password" required minLength={8} value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password" className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Confirm new password
        <input type="password" required value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          className={`${inputClass} ${mismatch ? "border-red-400" : ""}`} />
        {mismatch && <span className="mt-0.5 block text-xs text-red-600 dark:text-red-400">Passwords do not match</span>}
      </label>
      <div className="flex gap-2">
        <button type="submit" disabled={submitting || !!mismatch || !currentPassword || !newPassword}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {submitting ? "Saving…" : "Save"}
        </button>
        <button type="button"
          onClick={() => { setOpen(false); setError(null); setCurrentPassword(""); setNewPassword(""); setConfirm(""); }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
          Cancel
        </button>
      </div>
    </form>
  );
}
