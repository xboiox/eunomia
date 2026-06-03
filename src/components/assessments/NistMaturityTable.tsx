import type { NistMaturityTableData } from "@/lib/utils/compliance";

interface NistMaturityTableProps {
  data: NistMaturityTableData;
}

// Colors per NIST CSF 2.0 official visual identity
const DOMAIN_COLORS: Record<string, { bg: string; text: string }> = {
  GV: { bg: "bg-[#7030A0]", text: "text-white" }, // Govern   — purple
  ID: { bg: "bg-[#4472C4]", text: "text-white" }, // Identify — blue
  PR: { bg: "bg-[#70AD47]", text: "text-white" }, // Protect  — green
  DE: { bg: "bg-[#FFC000]", text: "text-gray-900" }, // Detect — amber (dark text)
  RS: { bg: "bg-[#C55A11]", text: "text-white" }, // Respond  — orange-red
  RC: { bg: "bg-[#00B0F0]", text: "text-white" }, // Recover  — sky blue
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
