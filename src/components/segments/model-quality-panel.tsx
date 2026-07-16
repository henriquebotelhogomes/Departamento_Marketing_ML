"use client";

import { formatDate, formatNumber } from "@/lib/utils";

type ModelQualityPanelProps = {
  algorithm: string;
  modelVersion: string;
  nClusters: number;
  silhouette: number;
  daviesBouldin: number;
  calinskiHarabasz: number;
  inertia: number;
  usedAutoencoder: boolean;
  trainedAt: string;
};

export function ModelQualityPanel({
  algorithm,
  modelVersion,
  nClusters,
  silhouette,
  daviesBouldin,
  calinskiHarabasz,
  usedAutoencoder,
  trainedAt,
}: ModelQualityPanelProps) {
  return (
    <section className="card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Qualidade do Modelo</h2>
        <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
          {modelVersion}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {algorithm}
        </span>
        <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          k = {nClusters}
        </span>
        {usedAutoencoder && (
          <span className="rounded bg-purple-100 px-2 py-1 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            Autoencoder
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">Silhouette Score</p>
          <p className="mt-1 text-2xl font-bold text-teal-600 dark:text-teal-400">
            {silhouette.toFixed(4)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">-1 a 1 (maior é melhor)</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">Davies-Bouldin</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {daviesBouldin.toFixed(4)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">menor é melhor</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">Calinski-Harabasz</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatNumber(calinskiHarabasz)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">maior é melhor</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">Treinado em</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {formatDate(trainedAt)}
          </p>
        </div>
      </div>
    </section>
  );
}
