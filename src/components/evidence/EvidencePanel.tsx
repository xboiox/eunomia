"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { ALLOWED_EXTENSIONS } from "@/lib/evidence/validate";

export interface EvidenceItem {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

interface EvidencePanelProps {
  assessmentId: string;
  controlId: string;
  initialEvidences: EvidenceItem[];
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPT = ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",");

export function EvidencePanel({ assessmentId, controlId, initialEvidences }: EvidencePanelProps) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [evidences, setEvidences] = useState<EvidenceItem[]>(initialEvidences);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("assessmentId", assessmentId);
      form.set("controlId", controlId);
      const res = await fetch("/api/evidence", { method: "POST", body: form });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Upload failed");
        return;
      }
      setEvidences((prev) => [
        ...prev,
        {
          id: body.data.id,
          fileName: body.data.fileName,
          fileSize: body.data.fileSize,
          uploadedAt: body.data.uploadedAt,
        },
      ]);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this evidence file?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/evidence/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Delete failed");
        return;
      }
      setEvidences((prev) => prev.filter((ev) => ev.id !== id));
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="mt-8 max-w-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Evidence <span className="text-gray-400">({evidences.length})</span>
        </h2>
        <label className="cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          {uploading ? "Uploading…" : "Upload file"}
          <input
            ref={fileInput}
            type="file"
            accept={ACCEPT}
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <p className="mt-1 text-xs text-gray-400">
        Allowed: {ALLOWED_EXTENSIONS.join(", ")}
      </p>

      {error && (
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>
      )}

      {evidences.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No evidence uploaded yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
          {evidences.map((ev) => (
            <li key={ev.id} className="flex items-center gap-3 bg-white px-4 py-2.5 dark:bg-gray-800">
              <a
                href={`/api/evidence/${ev.id}`}
                className="flex-1 truncate text-sm text-blue-600 hover:underline dark:text-blue-400"
                title={ev.fileName}
              >
                {ev.fileName}
              </a>
              <span className="shrink-0 text-xs text-gray-400">{humanSize(ev.fileSize)}</span>
              <button
                type="button"
                onClick={() => handleDelete(ev.id)}
                className="shrink-0 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
