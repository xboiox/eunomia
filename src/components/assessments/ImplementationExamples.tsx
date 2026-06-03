"use client";

import { useState } from "react";

interface ImplementationExamplesProps {
  text: string;
}

// Parse the raw implementation examples text into labelled entries.
// Lines starting with "Ex\d+:" are examples; others are category tags (e.g. "1st: ...").
function parseEntries(raw: string): { tag: string; text: string }[] {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const entries: { tag: string; text: string }[] = [];

  for (const line of lines) {
    const match = line.match(/^((?:Ex\d+|[A-Za-z0-9]+st|[A-Za-z0-9]+rd|[A-Za-z0-9]+th):\s*)(.*)/);
    if (match) {
      entries.push({ tag: match[1].trim(), text: match[2].trim() });
    } else if (entries.length > 0) {
      // continuation of previous entry
      entries[entries.length - 1].text += " " + line;
    } else {
      entries.push({ tag: "", text: line });
    }
  }
  return entries;
}

export function ImplementationExamples({ text }: ImplementationExamplesProps) {
  const [expanded, setExpanded] = useState(false);
  const entries = parseEntries(text);
  const isExample = (tag: string) => /^Ex\d+:/.test(tag);

  return (
    <div className="mt-6 max-w-3xl">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/60"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Implementation Examples
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({entries.filter((e) => isExample(e.tag)).length} examples)
          </span>
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {entries.map((entry, i) => (
              <li key={i} className="flex gap-3 px-4 py-3">
                {entry.tag && (
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${
                      isExample(entry.tag)
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {entry.tag.replace(/:$/, "")}
                  </span>
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300">{entry.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
