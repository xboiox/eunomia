"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface DomainMaturity {
  code: string;
  name: string;
  avgMaturity: number;
}

interface MaturityRadarChartProps {
  domains: DomainMaturity[];
}

export function MaturityRadarChart({ domains }: MaturityRadarChartProps) {
  if (domains.length === 0) return null;

  // Short display names for the radar axes
  const data = domains.map((d) => ({
    subject: d.code,
    fullName: d.name,
    maturity: d.avgMaturity,
    fullMark: 5,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 12, fontWeight: 600 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tickCount={6}
          tick={{ fontSize: 10 }}
          tickFormatter={(v) => (v === 0 ? "" : String(v))}
        />
        <Radar
          name="Avg Maturity"
          dataKey="maturity"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.25}
          dot={{ r: 4, fill: "#3b82f6" }}
        />
        <Tooltip
          formatter={(value: number, _name: string, props) => [
            `${value} / 5 — ${props.payload?.fullName ?? ""}`,
            "Avg Maturity",
          ]}
          contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
