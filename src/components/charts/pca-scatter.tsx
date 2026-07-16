"use client";

import { SEGMENT_COLORS } from "@/config/constants";

type PcaPoint = {
  pca1: number;
  pca2: number;
  segmentLabel: string;
};

type PcaScatterProps = {
  data: PcaPoint[];
  title?: string;
};

export function PcaScatter({ data, title = "Dispersão PCA" }: PcaScatterProps) {
  const segments = Array.from(new Set(data.map((d) => d.segmentLabel)));

  if (data.length === 0) {
    return (
      <article className="card p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <div className="flex h-80 items-center justify-center text-slate-500 dark:text-slate-400">
          <p>Nenhum dado de PCA disponível. Execute a camada de ML para gerar os dados.</p>
        </div>
      </article>
    );
  }

  const pca1Values = data.map((d) => d.pca1);
  const pca2Values = data.map((d) => d.pca2);
  const minPca1 = Math.min(...pca1Values);
  const maxPca1 = Math.max(...pca1Values);
  const minPca2 = Math.min(...pca2Values);
  const maxPca2 = Math.max(...pca2Values);

  const padding = 40;
  const width = 600;
  const height = 400;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const scaleX = (value: number) => padding + ((value - minPca1) / (maxPca1 - minPca1 || 1)) * plotWidth;
  const scaleY = (value: number) => padding + plotHeight - ((value - minPca2) / (maxPca2 - minPca2 || 1)) * plotHeight;

  return (
    <article className="card p-4">
      <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <div className="h-80 overflow-hidden">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          <rect x={padding} y={padding} width={plotWidth} height={plotHeight} fill="none" stroke="var(--border)" strokeDasharray="3 3" />

          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const x = padding + tick * plotWidth;
            const y = padding + tick * plotHeight;
            const xValue = minPca1 + tick * (maxPca1 - minPca1);
            const yValue = maxPca2 - tick * (maxPca2 - minPca2);
            return (
              <g key={`grid-${tick}`}>
                <line x1={x} y1={padding} x2={x} y2={padding + plotHeight} stroke="var(--border)" strokeOpacity={0.3} />
                <line x1={padding} y1={y} x2={padding + plotWidth} y2={y} stroke="var(--border)" strokeOpacity={0.3} />
                <text x={x} y={height - 10} textAnchor="middle" fontSize="10" fill="var(--muted)">
                  {xValue.toFixed(1)}
                </text>
                <text x={10} y={y} textAnchor="middle" fontSize="10" fill="var(--muted)">
                  {yValue.toFixed(1)}
                </text>
              </g>
            );
          })}

          <text x={width / 2} y={height - 0} textAnchor="middle" fontSize="12" fill="var(--foreground)">
            Componente 1
          </text>
          <text x={15} y={height / 2} textAnchor="middle" fontSize="12" fill="var(--foreground)" transform={`rotate(-90, 15, ${height / 2})`}>
            Componente 2
          </text>

          {data.map((point, index) => (
            <circle
              key={index}
              cx={scaleX(point.pca1)}
              cy={scaleY(point.pca2)}
              r={3}
              fill={SEGMENT_COLORS[point.segmentLabel] ?? SEGMENT_COLORS.fallback}
              opacity={0.6}
            />
          ))}
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs">
        {segments.map((seg) => (
          <div key={seg} className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: SEGMENT_COLORS[seg] ?? SEGMENT_COLORS.fallback }}
            />
            <span className="text-slate-700 dark:text-slate-300">{seg}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
