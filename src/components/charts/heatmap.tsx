"use client";

type CorrelationCell = {
  x: string;
  y: string;
  value: number;
};

type HeatmapProps = {
  data: CorrelationCell[];
  title: string;
};

function getColor(value: number): string {
  const abs = Math.abs(value);
  if (value >= 0) {
    const alpha = 0.1 + abs * 0.8;
    return `rgba(22, 163, 74, ${alpha})`;
  }
  const alpha = 0.1 + abs * 0.8;
  return `rgba(220, 38, 38, ${alpha})`;
}

export function Heatmap({ data, title }: HeatmapProps) {
  const xLabels = Array.from(new Set(data.map((d) => d.x)));
  const yLabels = Array.from(new Set(data.map((d) => d.y)));

  const getCell = (x: string, y: string): CorrelationCell | undefined =>
    data.find((d) => d.x === x && d.y === y);

  return (
    <article className="card p-4">
      <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr>
              <th className="p-1" />
              {xLabels.map((label) => (
                <th key={label} className="p-1 text-center font-medium text-slate-700 dark:text-slate-300">
                  {label.length > 8 ? label.slice(0, 8) + "…" : label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yLabels.map((yLabel) => (
              <tr key={yLabel}>
                <td className="p-1 font-medium text-slate-700 dark:text-slate-300">
                  {yLabel.length > 10 ? yLabel.slice(0, 10) + "…" : yLabel}
                </td>
                {xLabels.map((xLabel) => {
                  const cell = getCell(xLabel, yLabel);
                  const value = cell?.value ?? 0;
                  return (
                    <td
                      key={xLabel}
                      className="p-1 text-center"
                      style={{ backgroundColor: getColor(value) }}
                      title={`${xLabel} × ${yLabel}: ${value.toFixed(3)}`}
                    >
                      <span className="font-mono text-slate-900 dark:text-slate-100">
                        {value.toFixed(2)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: "rgba(220, 38, 38, 0.5)" }} />
          <span>Correlação negativa</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: "rgba(22, 163, 74, 0.5)" }} />
          <span>Correlação positiva</span>
        </div>
      </div>
    </article>
  );
}
