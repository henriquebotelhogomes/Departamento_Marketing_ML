"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { SEGMENT_COLORS } from "@/config/constants";

type SegmentRadarProps = {
  data: { variable: string; [key: string]: string | number }[];
  title: string;
  segments: string[];
};

export function SegmentRadar({ data, title, segments }: SegmentRadarProps) {
  return (
    <article className="card p-4">
      <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="variable" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={90} domain={[0, "auto"]} tick={{ fontSize: 10 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div
                    className="rounded border p-2 text-sm shadow-sm"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p className="mb-1 font-medium text-slate-700 dark:text-slate-300">
                      {label}
                    </p>
                    {payload.map((entry) => {
                      const color = entry.color
                        ?? SEGMENT_COLORS[entry.name as string]
                        ?? SEGMENT_COLORS.fallback;
                      return (
                        <p key={entry.name} style={{ color }}>
                          {entry.name}: {Number(entry.value).toFixed(2)}
                        </p>
                      );
                    })}
                  </div>
                );
              }}
            />
            <Legend />
            {segments.map((segment) => (
              <Radar
                key={segment}
                name={segment}
                dataKey={segment}
                stroke={SEGMENT_COLORS[segment] ?? SEGMENT_COLORS.fallback}
                fill={SEGMENT_COLORS[segment] ?? SEGMENT_COLORS.fallback}
                fillOpacity={0.3}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
