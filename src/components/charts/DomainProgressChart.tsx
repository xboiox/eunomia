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
  /** Optional map of domain code → hex color. When provided, overrides the default pct-based coloring. */
  colorMap?: Record<string, string>;
}

function defaultBarColor(pct: number): string {
  if (pct >= 80) return "#22c55e";
  if (pct >= 40) return "#3b82f6";
  return "#d1d5db";
}

export function DomainProgressChart({ domains, colorMap }: DomainProgressChartProps) {
  if (domains.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, domains.length * 36)}>
      <BarChart
        data={domains}
        layout="vertical"
        margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
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
          tick={{ fontSize: 12, fontFamily: "monospace" }}
          width={36}
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
        <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {domains.map((d, i) => (
            <Cell
              key={i}
              fill={colorMap ? (colorMap[d.code] ?? defaultBarColor(d.pct)) : defaultBarColor(d.pct)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
