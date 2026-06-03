"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DomainData {
  code: string;
  name: string;
  pct: number;
}

interface DomainProgressChartProps {
  domains: DomainData[];
  /** When provided: each bar uses its domain's hex color and a legend is shown. */
  colorMap?: Record<string, string>;
}

const FALLBACK_COLOR = "#6b7280";

// Legend grid columns by domain count
function legendCols(count: number): string {
  if (count <= 4) return "grid-cols-2";
  if (count <= 6) return "grid-cols-3";
  return "grid-cols-4";
}

export function DomainProgressChart({ domains, colorMap }: DomainProgressChartProps) {
  if (domains.length === 0) return null;

  const barColor = (code: string) =>
    colorMap ? (colorMap[code] ?? FALLBACK_COLOR) : FALLBACK_COLOR;

  return (
    <div>
      <ResponsiveContainer width="100%" height={Math.max(180, domains.length * 32)}>
        <BarChart
          data={domains}
          layout="vertical"
          margin={{ top: 4, right: 32, bottom: 4, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="code"
            interval={0}
            tick={{ fontSize: 11, fontFamily: "monospace" }}
            width={38}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number, _name: string, props) => [
              `${value}%`,
              props.payload?.name ?? "",
            ]}
            contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
          />
          <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={12}>
            {domains.map((d, i) => (
              <Cell key={i} fill={barColor(d.code)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend — only shown when domain-specific colors are provided */}
      {colorMap && (
        <div className={`mt-3 grid gap-x-4 gap-y-1.5 ${legendCols(domains.length)}`}>
          {domains.map((d) => (
            <div key={d.code} className="flex min-w-0 items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: colorMap[d.code] ?? FALLBACK_COLOR }}
              />
              <span className="truncate text-xs text-gray-600 dark:text-gray-400">
                <span className="font-mono font-semibold">{d.code}</span>
                {" — "}
                {d.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
