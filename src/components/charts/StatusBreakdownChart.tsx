"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface StatusBreakdownChartProps {
  counts: {
    NOT_STARTED: number;
    IN_PROGRESS: number;
    IMPLEMENTED: number;
    NOT_APPLICABLE: number;
  };
  isNist?: boolean;
}

const SLICES = [
  { key: "NOT_STARTED", label: "Not started", color: "#d1d5db" },
  { key: "IN_PROGRESS", label: "In progress", color: "#3b82f6" },
  { key: "IMPLEMENTED", label: "Implemented", color: "#22c55e" },
  { key: "NOT_APPLICABLE", label: "Not applicable", color: "#f59e0b" },
];

const NIST_SLICES = [
  { key: "NOT_STARTED", label: "Not started", color: "#d1d5db" },
  { key: "IN_PROGRESS", label: "In progress", color: "#3b82f6" },
  { key: "IMPLEMENTED", label: "Done", color: "#22c55e" },
];

export function StatusBreakdownChart({ counts, isNist = false }: StatusBreakdownChartProps) {
  const slices = isNist ? NIST_SLICES : SLICES;
  const data = slices
    .map((s) => ({ name: s.label, value: counts[s.key as keyof typeof counts], color: s.color }))
    .filter((d) => d.value > 0);

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="48%"
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [value, name]}
          contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
