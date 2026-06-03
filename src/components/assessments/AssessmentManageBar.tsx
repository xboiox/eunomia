"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
];

interface AssessmentManageBarProps {
  assessmentId: string;
  currentStatus: string;
  assessmentName: string;
}

const selectClass =
  "rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50";

export function AssessmentManageBar({
  assessmentId,
  currentStatus,
  assessmentName,
}: AssessmentManageBarProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function changeStatus(next: string) {
    const previous = status;
    setStatus(next);
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/assessments/${assessmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const body = await res.json();
      if (!res.ok) {
        setStatus(previous);
        setMessage({ type: "err", text: body.error ?? "Failed to update status" });
        return;
      }
      setMessage({ type: "ok", text: "Status updated." });
      router.refresh();
    } catch {
      setStatus(previous);
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${assessmentName}"? This permanently removes the assessment and all its control responses and evidence. This cannot be undone.`,
    );
    if (!confirmed) return;

    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/assessments/${assessmentId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json();
        setMessage({ type: "err", text: body.error ?? "Failed to delete" });
        setBusy(false);
        return;
      }
      router.push("/dashboard/assessments");
      router.refresh();
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
          <select
            value={status}
            disabled={busy}
            onChange={(e) => changeStatus(e.target.value)}
            className={selectClass}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/assessments/${assessmentId}/edit`}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Edit details
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Delete assessment
          </button>
        </div>
      </div>

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.type === "ok"
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
