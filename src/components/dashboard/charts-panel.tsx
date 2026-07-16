"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SEGMENT_COLORS } from "@/config/constants";

type SegmentPoint = {
  label: string;
  customerCount: number;
  avgBalance: number;
  avgPurchases: number;
};

type HistogramBin = {
  range: string;
  count: number;
};

type PcaPoint = {
  pca1: number;
  pca2: number;
  segmentLabel: string;
};

type ChartsPanelProps = {
  segmentData: SegmentPoint[];
  balanceHistogram: HistogramBin[];
  pcaPoints: PcaPoint[];
};

export function ChartsPanel({ segmentData, balanceHistogram, pcaPoints }: ChartsPanelProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="card p-4">
        <h3 className="mb-3 text-base font-semibold">Distribuição por segmento</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={segmentData} dataKey="customerCount" nameKey="label" outerRadius={95}>
                {segmentData.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={SEGMENT_COLORS[entry.label] ?? SEGMENT_COLORS.fallback}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card p-4">
        <h3 className="mb-3 text-base font-semibold">Histograma de saldo</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={balanceHistogram}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card p-4">
        <h3 className="mb-3 text-base font-semibold">Médias por segmento (saldo)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgBalance" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card p-4">
        <h3 className="mb-3 text-base font-semibold">Dispersão PCA (amostra)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="pca1" name="pca1" />
              <YAxis type="number" dataKey="pca2" name="pca2" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={pcaPoints} fill="#0f766e" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
