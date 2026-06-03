// Server component — rendered once per page load, no client state needed.

interface MaturityCriteria {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
}

interface MaturityTableProps {
  criteria: MaturityCriteria;
  currentLevel: number | null;
}

const LEVEL_LABELS: Record<string, string> = {
  "1": "Ad-Hoc",
  "2": "Repeatable",
  "3": "Capable",
  "4": "Matured",
  "5": "Industry Best",
};

const LEVEL_STYLES: Record<string, string> = {
  "1": "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  "2": "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  "3": "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  "4": "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  "5": "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
};

export function MaturityTable({ criteria, currentLevel }: MaturityTableProps) {
  return (
    <div className="mt-6 max-w-3xl">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        Maturity Level Criteria
      </h2>
      <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="w-36 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Level
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Criteria
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {(["1", "2", "3", "4", "5"] as const).map((lvl) => {
              const isActive = currentLevel === Number(lvl);
              return (
                <tr
                  key={lvl}
                  className={isActive ? "ring-2 ring-inset ring-blue-500" : ""}
                >
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_STYLES[lvl]}`}
                    >
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                      L{lvl} — {LEVEL_LABELS[lvl]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {criteria[lvl]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
