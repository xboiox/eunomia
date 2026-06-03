"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface ResponseRow {
  id: string;
  controlId: string;
  status: string;
  maturityLevel: number | null;
  evidenceCount: number;
  control: {
    code: string;
    name: string;
    order: number;
    domain: { id: string; code: string; name: string; order: number };
  };
}

interface AssessmentControlsProps {
  assessmentId: string;
  isNist: boolean;
  responses: ResponseRow[];
}

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  IMPLEMENTED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  NOT_APPLICABLE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const RING_STYLES: Record<string, string> = {
  NOT_STARTED: "ring-gray-400",
  IN_PROGRESS: "ring-blue-500",
  IMPLEMENTED: "ring-green-500",
  NOT_APPLICABLE: "ring-amber-500",
};

function statusLabel(status: string, isNist: boolean): string {
  if (status === "IMPLEMENTED" && isNist) return "Done";
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function AssessmentControls({ assessmentId, isNist, responses }: AssessmentControlsProps) {
  const [filter, setFilter] = useState<string | null>(null);

  const statuses = isNist
    ? ["NOT_STARTED", "IN_PROGRESS", "IMPLEMENTED"]
    : ["NOT_STARTED", "IN_PROGRESS", "IMPLEMENTED", "NOT_APPLICABLE"];

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of responses) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [responses]);

  const total = responses.length;
  const done = (counts.IMPLEMENTED ?? 0) + (isNist ? 0 : counts.NOT_APPLICABLE ?? 0);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const visible = filter ? responses.filter((r) => r.status === filter) : responses;

  // Group visible responses by domain, ordered.
  const domains = useMemo(() => {
    const sorted = [...visible].sort((a, b) => {
      const d = a.control.domain.order - b.control.domain.order;
      return d !== 0 ? d : a.control.order - b.control.order;
    });
    const map = new Map<string, { code: string; name: string; rows: ResponseRow[] }>();
    for (const r of sorted) {
      const key = r.control.domain.id;
      if (!map.has(key)) {
        map.set(key, { code: r.control.domain.code, name: r.control.domain.name, rows: [] });
      }
      map.get(key)!.rows.push(r);
    }
    return Array.from(map.values());
  }, [visible]);

  return (
    <div>
      {/* Progress */}
      <div className="mt-6 max-w-md">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">{pct}% complete</span>
          <span>{done}/{total} controls</span>
        </div>
        <div className="mt-1 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
          <div className="h-2 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Clickable status cards (filter) */}
      <div className="mt-4 flex flex-wrap gap-2">
        {statuses.map((s) => {
          const active = filter === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(active ? null : s)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${STATUS_STYLES[s]} ${
                active ? `ring-2 ring-offset-1 dark:ring-offset-gray-900 ${RING_STYLES[s]}` : "opacity-90 hover:opacity-100"
              }`}
            >
              {statusLabel(s, isNist)}: {counts[s] ?? 0}
            </button>
          );
        })}
        {filter && (
          <button
            type="button"
            onClick={() => setFilter(null)}
            className="rounded-full px-3 py-1 text-xs font-medium text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Controls grouped by domain */}
      <div className="mt-8 space-y-8">
        {domains.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No controls match this filter.</p>
        ) : (
          domains.map((domain) => (
            <section key={domain.code}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                <span className="text-gray-400">{domain.code}</span> {domain.name}
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {domain.rows.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/dashboard/assessments/${assessmentId}/controls/${r.controlId}`}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <span className="shrink-0 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {r.control.code}
                        </span>
                        <span className="flex-1 text-sm text-gray-900 dark:text-white">{r.control.name}</span>
                        {isNist && r.maturityLevel != null && (
                          <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">L{r.maturityLevel}</span>
                        )}
                        {r.evidenceCount > 0 && (
                          <span className="shrink-0 text-xs text-gray-400" title="evidence files">
                            📎 {r.evidenceCount}
                          </span>
                        )}
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                          {statusLabel(r.status, isNist)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
