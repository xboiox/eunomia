"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Option {
  id: string;
  name: string;
  version?: string;
}

interface NewAssessmentFormProps {
  tenants: Option[];
  frameworks: Option[];
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export function NewAssessmentForm({ tenants, frameworks }: NewAssessmentFormProps) {
  const router = useRouter();
  const [tenantId, setTenantId] = useState(tenants[0]?.id ?? "");
  const [frameworkId, setFrameworkId] = useState(frameworks[0]?.id ?? "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [overallDeadline, setOverallDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          frameworkId,
          name,
          description: description || undefined,
          overallDeadline: overallDeadline || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Failed to create assessment");
        return;
      }
      router.push(`/dashboard/assessments/${body.data.id}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {tenants.length > 1 && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Organization
          <select value={tenantId} onChange={(e) => setTenantId(e.target.value)} className={inputClass}>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
      )}

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Framework
        <select value={frameworkId} onChange={(e) => setFrameworkId(e.target.value)} className={inputClass}>
          {frameworks.map((f) => (
            <option key={f.id} value={f.id}>{f.name}{f.version ? ` (${f.version})` : ""}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Name
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. 2026 Annual ISO 27001 Self-Assessment"
          className={inputClass}
        />
      </label>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Description <span className="text-gray-400">(optional)</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </label>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Overall deadline <span className="text-gray-400">(optional)</span>
        <input
          type="date"
          value={overallDeadline}
          onChange={(e) => setOverallDeadline(e.target.value)}
          className={inputClass}
        />
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || !name.trim() || !tenantId || !frameworkId}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create Assessment"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/assessments")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
