"use client";

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SEGMENT_COLORS } from "@/config/constants";

type ScatterPlotProps = {
  data: { x: number; y: number; segment: string }[];
  title: string;
  xLabel: string;
  yLabel: string;
};

export function ScatterPlot({ data, title, xLabel, yLabel }: ScatterPlotProps) {
  const segments = Array.from(new Set(data.map((d) => d.segment)));

  return (
    <article className="card p-4">
      <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" dataKey="x" name={xLabel} label={{ value: xLabel, position: "bottom", offset: -5 }} />
            <YAxis type="number" dataKey="y" name={yLabel} label={{ value: yLabel, angle: -90, position: "left" }} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const first = payload[0]!;
                const segment = (first.payload as { segment: string })?.segment;
                const color = first.color
                  ?? SEGMENT_COLORS[segment]
                  ?? SEGMENT_COLORS.fallback;
                return (
                  <div
                    className="rounded border p-2 text-sm shadow-sm"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <p className="mb-1 font-semibold" style={{ color }}>
                      {segment}
                    </p>
                    {payload.map((entry) => (
                      <p key={entry.name as string} style={{ color }}>
                        {entry.name}: {String(entry.value)}
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Legend />
            {segments.map((segment) => (
              <Scatter
                key={segment}
                name={segment}
                data={data.filter((d) => d.segment === segment)}
                fill={SEGMENT_COLORS[segment] ?? SEGMENT_COLORS.fallback}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
