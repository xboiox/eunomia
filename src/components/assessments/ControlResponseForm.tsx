"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "Not started" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "IMPLEMENTED", label: "Implemented" },
  { value: "NOT_APPLICABLE", label: "Not applicable" },
];

const MATURITY_LEVELS = [
  { value: 1, label: "1 — Partial" },
  { value: 2, label: "2 — Risk Informed" },
  { value: 3, label: "3 — Repeatable" },
  { value: 4, label: "4 — Adaptive" },
  { value: 5, label: "5 — Optimized" },
];

interface InitialState {
  status: string;
  maturityLevel: number | null;
  notes: string;
  deadline: string;
}

interface ControlResponseFormProps {
  assessmentId: string;
  controlId: string;
  isNist: boolean;
  initial: InitialState;
  lastUpdatedBy: string | null;
  updatedAt: string | null;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export function ControlResponseForm({
  assessmentId,
  controlId,
  isNist,
  initial,
  lastUpdatedBy,
  updatedAt,
}: ControlResponseFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initial.status);
  const [maturityLevel, setMaturityLevel] = useState<number | null>(initial.maturityLevel);
  const [notes, setNotes] = useState(initial.notes);
  const [deadline, setDeadline] = useState(initial.deadline);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/assessments/${assessmentId}/controls/${controlId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            maturityLevel: isNist ? maturityLevel : undefined,
            notes,
            deadline: deadline || null,
          }),
        },
      );
      const body = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: body.error ?? "Failed to save" });
        return;
      }
      setMessage({ type: "ok", text: "Saved." });
      router.refresh();
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Status
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      {isNist && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Maturity level
          <select
            value={maturityLevel ?? ""}
            onChange={(e) => setMaturityLevel(e.target.value ? Number(e.target.value) : null)}
            className={inputClass}
          >
            <option value="">— not set —</option>
            {MATURITY_LEVELS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </label>
      )}

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Notes <span className="text-gray-400">(optional)</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className={inputClass} />
      </label>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Control deadline <span className="text-gray-400">(optional)</span>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
      </label>

      {message && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            message.type === "ok"
              ? "border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save response"}
        </button>
        {lastUpdatedBy && updatedAt && (
          <span className="text-xs text-gray-400">Last updated by {lastUpdatedBy} · {updatedAt}</span>
        )}
      </div>
    </form>
  );
}
