"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditAssessmentFormProps {
  assessmentId: string;
  initial: {
    name: string;
    description: string;
    overallDeadline: string; // yyyy-mm-dd or ""
  };
  // Read-only context (cannot be changed after creation)
  frameworkLabel: string;
  tenantName: string;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white";

const readonlyClass =
  "mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400";

export function EditAssessmentForm({
  assessmentId,
  initial,
  frameworkLabel,
  tenantName,
}: EditAssessmentFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [overallDeadline, setOverallDeadline] = useState(initial.overallDeadline);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/assessments/${assessmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description, // empty string clears it (route maps "" → null)
          overallDeadline: overallDeadline || null,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Failed to update assessment");
        return;
      }
      router.push(`/dashboard/assessments/${assessmentId}`);
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

      {/* Organization — read-only (cannot move an assessment between tenants) */}
      <div className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Organization
        <input type="text" value={tenantName} readOnly disabled className={readonlyClass} />
      </div>

      {/* Framework — read-only (changing it would orphan all control responses) */}
      <div className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Framework
        <input type="text" value={frameworkLabel} readOnly disabled className={readonlyClass} />
      </div>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Name
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          disabled={submitting || !name.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/dashboard/assessments/${assessmentId}`)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
