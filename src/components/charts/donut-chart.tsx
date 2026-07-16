"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { SEGMENT_COLORS } from "@/config/constants";

type DonutChartProps = {
  data: { label: string; value: number; color?: string }[];
  title: string;
  formatter?: (_value: number) => string;
};

export function DonutChart({ data, title, formatter }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <article className="card p-4">
      <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={entry.color ?? SEGMENT_COLORS[entry.label] ?? SEGMENT_COLORS.fallback}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div
                    className="rounded border p-2 text-sm shadow-sm"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {payload.map((entry) => {
                      const value = entry.value as number;
                      const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
                      const formattedValue = formatter
                        ? formatter(value)
                        : value.toLocaleString("pt-BR");
                      const color = entry.color
                        ?? SEGMENT_COLORS[entry.name as string]
                        ?? SEGMENT_COLORS.fallback;
                      return (
                        <p key={entry.name} style={{ color }}>
                          {entry.name}: {formattedValue} ({pct}%)
                        </p>
                      );
                    })}
                  </div>
                );
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
