import type { NistMaturityTableData } from "@/lib/utils/compliance";

interface NistMaturityTableProps {
  data: NistMaturityTableData;
}

// Colors per NIST CSF Function, matching the standard visual identity
const DOMAIN_COLORS: Record<string, { bg: string; text: string }> = {
  GV: { bg: "bg-[#4a7c59]",  text: "text-white" }, // Govern    — dark green
  ID: { bg: "bg-[#6b7280]",  text: "text-white" }, // Identify  — gray
  PR: { bg: "bg-[#b5860d]",  text: "text-white" }, // Protect   — olive
  DE: { bg: "bg-[#c45e2a]",  text: "text-white" }, // Detect    — orange
  RS: { bg: "bg-[#2b5ea7]",  text: "text-white" }, // Respond   — blue
  RC: { bg: "bg-[#7c8a96]",  text: "text-white" }, // Recover   — slate
};

const DEFAULT_COLOR = { bg: "bg-gray-600", text: "text-white" };

function maturityBadge(value: number): string {
  if (value === 0) return "—";
  return value.toFixed(1);
}

export function NistMaturityTable({ data }: NistMaturityTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Title */}
      <div className="bg-[#2b5ea7] px-4 py-2.5 text-center text-sm font-semibold text-white">
        Cyber Security Maturity Level Assessment
      </div>

      {data.domains.map((domain) => {
        const color = DOMAIN_COLORS[domain.domainCode] ?? DEFAULT_COLOR;
        return (
          <div key={domain.domainCode}>
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {domain.sections.map((section) => (
                  <tr key={section.sectionCode} className="bg-white dark:bg-gray-800">
                    {/* Function label — only rendered on first section row */}
                    {domain.sections.indexOf(section) === 0 && (
                      <td
                        rowSpan={domain.sections.length + 1}
                        className={`w-28 px-3 py-2 text-center text-sm font-bold align-middle ${color.bg} ${color.text}`}
                      >
                        {domain.domainName}
                      </td>
                    )}
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {section.sectionName}{" "}
                      <span className="text-xs text-gray-400">({section.sectionCode})</span>
                    </td>
                    <td className="w-16 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      {maturityBadge(section.avgMaturity)}
                    </td>
                  </tr>
                ))}
                {/* Domain average row */}
                <tr className="bg-[#2b5ea7]">
                  <td
                    colSpan={2}
                    className="px-4 py-2 text-sm font-semibold text-white"
                  >
                    Average Maturity Level {domain.domainName}
                  </td>
                  <td className="w-16 px-4 py-2 text-right text-sm font-bold text-white">
                    {maturityBadge(domain.avgMaturity)}
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Thin spacer between domain blocks */}
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
          </div>
        );
      })}

      {/* Overall score */}
      <table className="min-w-full">
        <tbody>
          <tr className="bg-gray-800 dark:bg-gray-900">
            <td className="w-28 px-3 py-3 text-center text-xs font-bold text-white">
              Overall Maturity Score
            </td>
            <td className="px-4 py-3 text-sm font-semibold text-white">All Domains</td>
            <td className="w-16 px-4 py-3 text-right text-lg font-bold text-white">
              {maturityBadge(data.overallAvg)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
