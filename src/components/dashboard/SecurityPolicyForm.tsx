"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Policy {
  passwordExpiryDays: number;
  lockoutAttempts: number;
  lockoutMinutes: number;
}

const inputClass =
  "w-20 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export function SecurityPolicyForm() {
  const [policy, setPolicy] = useState<Policy>({
    passwordExpiryDays: 0,
    lockoutAttempts: 5,
    lockoutMinutes: 30,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/security")
      .then((r) => r.json())
      .then((d) => { if (d.data) setPolicy(d.data); setLoading(false); });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/settings/security", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policy),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { toast.error(data.error ?? "Failed to save"); return; }
    toast.success("Security policy saved.");
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <form onSubmit={handleSave} className="mt-4 space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span>Password expires after</span>
          <input
            type="number" min={0} max={365}
            value={policy.passwordExpiryDays}
            onChange={(e) => setPolicy({ ...policy, passwordExpiryDays: Number(e.target.value) })}
            className={inputClass}
          />
          <span>days</span>
          <span className="text-xs text-gray-400">(0 = never)</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span>Lock after</span>
          <input
            type="number" min={1} max={20}
            value={policy.lockoutAttempts}
            onChange={(e) => setPolicy({ ...policy, lockoutAttempts: Number(e.target.value) })}
            className={inputClass}
          />
          <span>failed attempts</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span>Lock for</span>
          <input
            type="number" min={1} max={1440}
            value={policy.lockoutMinutes}
            onChange={(e) => setPolicy({ ...policy, lockoutMinutes: Number(e.target.value) })}
            className={inputClass}
          />
          <span>minutes</span>
        </label>
      </div>

      <button
        type="submit" disabled={saving}
        className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save policy"}
      </button>
    </form>
  );
}
