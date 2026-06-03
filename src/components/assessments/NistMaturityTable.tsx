import type { NistMaturityTableData } from "@/lib/utils/compliance";
import { NIST_DOMAIN_COLORS, NIST_DOMAIN_COLOR_FALLBACK } from "@/lib/utils/nist-colors";

interface NistMaturityTableProps {
  data: NistMaturityTableData;
}


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
        const color = NIST_DOMAIN_COLORS[domain.domainCode] ?? NIST_DOMAIN_COLOR_FALLBACK;
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
                        style={{ backgroundColor: color.bg }}
                        className={`w-28 px-3 py-2 text-center text-sm font-bold align-middle ${color.text}`}
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
                {/* Domain average row — same color as the domain header */}
                <tr style={{ backgroundColor: color.bg }}>
                  <td colSpan={2} className={`px-4 py-2 text-sm font-semibold ${color.text}`}>
                    Average Maturity Level {domain.domainName}
                  </td>
                  <td className={`w-16 px-4 py-2 text-right text-sm font-bold ${color.text}`}>
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
