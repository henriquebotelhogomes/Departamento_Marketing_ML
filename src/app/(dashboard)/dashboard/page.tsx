import Link from "next/link";

import { DashboardFilters } from "./DashboardFilters";
import { Histogram } from "@/components/charts/histogram";
import { PcaScatter } from "@/components/charts/pca-scatter";
import { ScatterPlot } from "@/components/charts/scatter-plot";
import { DonutChart } from "@/components/charts/donut-chart";
import { FrequencyBars } from "@/components/charts/frequency-bars";
import { SegmentRadar } from "@/components/charts/segment-radar";
import { Heatmap } from "@/components/charts/heatmap";
import { ModelQualityPanel } from "@/components/segments/model-quality-panel";
import { SegmentBadge } from "@/components/customers/segment-badge";
import { pearsonCorrelation } from "@/lib/metrics/correlations";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

type DashboardPageProps = {
  searchParams:
    | {
        segment?: string;
        minBalance?: string;
        maxBalance?: string;
        minPurchases?: string;
        maxPurchases?: string;
        minCreditLimit?: string;
        maxCreditLimit?: string;
        tenure?: string;
        prcFullPaymentMin?: string;
        prcFullPaymentMax?: string;
      }
    | Promise<{
        segment?: string;
        minBalance?: string;
        maxBalance?: string;
        minPurchases?: string;
        maxPurchases?: string;
    minCreditLimit?: string;
    maxCreditLimit?: string;
        tenure?: string;
        prcFullPaymentMin?: string;
        prcFullPaymentMax?: string;
      }>;
};

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;

  const parseNum = (value?: string): number | undefined => {
    if (value == null || value.trim() === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const segment = resolvedSearchParams.segment?.trim() || undefined;
  const minBalance = parseNum(resolvedSearchParams.minBalance);
  const maxBalance = parseNum(resolvedSearchParams.maxBalance);
  const minPurchases = parseNum(resolvedSearchParams.minPurchases);
  const maxPurchases = parseNum(resolvedSearchParams.maxPurchases);
  const minCreditLimit = parseNum(resolvedSearchParams.minCreditLimit);
  const maxCreditLimit = parseNum(resolvedSearchParams.maxCreditLimit);
  const tenure = parseNum(resolvedSearchParams.tenure);
  const minPrcFullPayment = parseNum(resolvedSearchParams.prcFullPaymentMin);
  const maxPrcFullPayment = parseNum(resolvedSearchParams.prcFullPaymentMax);

  const where = {
    ...(segment ? { segmentLabel: segment } : {}),
    ...(minBalance != null || maxBalance != null
      ? {
          balance: {
            ...(minBalance != null ? { gte: minBalance } : {}),
            ...(maxBalance != null ? { lte: maxBalance } : {}),
          },
        }
      : {}),
    ...(minPurchases != null || maxPurchases != null
      ? {
          purchases: {
            ...(minPurchases != null ? { gte: minPurchases } : {}),
            ...(maxPurchases != null ? { lte: maxPurchases } : {}),
          },
        }
      : {}),
    ...(minCreditLimit != null || maxCreditLimit != null
      ? {
          creditLimit: {
            ...(minCreditLimit != null ? { gte: minCreditLimit } : {}),
            ...(maxCreditLimit != null ? { lte: maxCreditLimit } : {}),
          },
        }
      : {}),
    ...(tenure != null ? { tenure } : {}),
    ...(minPrcFullPayment != null || maxPrcFullPayment != null
      ? {
          prcFullPayment: {
            ...(minPrcFullPayment != null ? { gte: minPrcFullPayment } : {}),
            ...(maxPrcFullPayment != null ? { lte: maxPrcFullPayment } : {}),
          },
        }
      : {}),
  };

  const [
    customerCount,
    segmentCount,
    clusterRun,
    topSegmentsRaw,
    agg,
    allSegments,
    pcaSample,
    cashAdvanceUsers,
    histogramCustomers,
    allCustomersForCharts,
  ] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.groupBy({
      by: ["clusterId"],
      where: { ...where, clusterId: { not: null } },
    }),
    prisma.clusterRun.findFirst({ orderBy: { trainedAt: "desc" } }),
    prisma.customer.groupBy({
      by: ["clusterId", "segmentLabel"],
      where: { ...where, clusterId: { not: null } },
      _count: { _all: true },
      _avg: { balance: true, purchases: true },
      orderBy: { clusterId: "asc" },
    }),
    prisma.customer.aggregate({
      where,
      _avg: {
        balance: true,
        purchases: true,
        creditLimit: true,
        payments: true,
        prcFullPayment: true,
        tenure: true,
      },
    }),
    prisma.segment.findMany({ orderBy: { label: "asc" } }),
    prisma.customer.findMany({
      where: { ...where, pca1: { not: null }, pca2: { not: null } },
      select: { pca1: true, pca2: true, segmentLabel: true },
      take: 800,
    }),
    prisma.customer.count({ where: { ...where, cashAdvance: { gt: 0 } } }),
    prisma.customer.findMany({
      where,
      select: { balance: true, creditLimit: true },
      take: 2000,
    }),
    prisma.customer.findMany({
      where,
      select: {
        balance: true,
        creditLimit: true,
        cashAdvance: true,
        purchases: true,
        oneoffPurchases: true,
        installmentsPurchases: true,
        purchasesFrequency: true,
        payments: true,
        minimumPayments: true,
        prcFullPayment: true,
        segmentLabel: true,
      },
      take: 2000,
    }),
  ]);

  const topSegments = topSegmentsRaw
    .map((row) => ({
      id: `${row.clusterId ?? "na"}-${row.segmentLabel ?? "na"}`,
      label: row.segmentLabel ?? "Não classificado",
      customerCount: row._count._all,
      sharePct: customerCount > 0 ? (row._count._all / customerCount) * 100 : 0,
      avgBalance: row._avg.balance ?? 0,
      avgPurchases: row._avg.purchases ?? 0,
    }))
    .sort((a, b) => b.customerCount - a.customerCount)
    .slice(0, 6);

  const ranges = [0, 2000, 4000, 6000, 8000, 10000];
  const balanceHistogram = ranges.map((start, index) => {
    const end = ranges[index + 1];
    const count = histogramCustomers.filter((c) => {
      if (end == null) return c.balance >= start;
      return c.balance >= start && c.balance < end;
    }).length;
    return { range: end == null ? `${start}+` : `${start}-${end}`, count };
  });

  const creditLimitHistogram = ranges.map((start, index) => {
    const end = ranges[index + 1];
    const count = histogramCustomers.filter((c) => {
      const limit = c.creditLimit ?? 0;
      if (end == null) return limit >= start;
      return limit >= start && limit < end;
    }).length;
    return { range: end == null ? `${start}+` : `${start}-${end}`, count };
  });

  const pcaPoints = pcaSample.map((item) => ({
    pca1: item.pca1 ?? 0,
    pca2: item.pca2 ?? 0,
    segmentLabel: item.segmentLabel ?? "Não classificado",
  }));

  const balanceVsLimitData = allCustomersForCharts.map((c) => ({
    x: c.balance,
    y: c.creditLimit ?? 0,
    segment: c.segmentLabel ?? "Não classificado",
  }));

  const cashAdvanceVsBalanceData = allCustomersForCharts.map((c) => ({
    x: c.cashAdvance,
    y: c.balance,
    segment: c.segmentLabel ?? "Não classificado",
  }));

  const totalOneoff = allCustomersForCharts.reduce((sum, c) => sum + c.oneoffPurchases, 0);
  const totalInstallments = allCustomersForCharts.reduce((sum, c) => sum + c.installmentsPurchases, 0);
  const purchaseTypeData = [
    { label: "À vista", value: totalOneoff, color: "#2563EB" },
    { label: "Parcelado", value: totalInstallments, color: "#16A34A" },
  ];

  const frequencyBuckets = [
    { bucket: "Nunca", count: allCustomersForCharts.filter((c) => c.purchasesFrequency === 0).length },
    { bucket: "Baixa", count: allCustomersForCharts.filter((c) => c.purchasesFrequency > 0 && c.purchasesFrequency < 0.25).length },
    { bucket: "Média", count: allCustomersForCharts.filter((c) => c.purchasesFrequency >= 0.25 && c.purchasesFrequency < 0.75).length },
    { bucket: "Alta", count: allCustomersForCharts.filter((c) => c.purchasesFrequency >= 0.75).length },
  ];

  const fullPaymentData = [
    { label: "Integral", value: allCustomersForCharts.filter((c) => c.prcFullPayment >= 0.95).length, color: "#16A34A" },
    { label: "Parcial", value: allCustomersForCharts.filter((c) => c.prcFullPayment < 0.95).length, color: "#EA580C" },
  ];

  const segments = Array.from(new Set(allCustomersForCharts.map((c) => c.segmentLabel ?? "Não classificado")));
  const radarVariables = ["balance", "purchases", "cashAdvance", "creditLimit", "prcFullPayment"];
  const radarData = radarVariables.map((variable) => {
    const entry: { variable: string; [key: string]: string | number } = { variable };
    segments.forEach((seg) => {
      const segCustomers = allCustomersForCharts.filter((c) => (c.segmentLabel ?? "Não classificado") === seg);
      const avg = segCustomers.reduce((sum, c) => sum + (c[variable as keyof typeof c] as number ?? 0), 0) / (segCustomers.length || 1);
      entry[seg] = avg;
    });
    return entry;
  });

  const correlationVars = [
    { key: "balance", label: "BALANCE" },
    { key: "purchases", label: "PURCHASES" },
    { key: "cashAdvance", label: "CASH_ADVANCE" },
    { key: "creditLimit", label: "CREDIT_LIMIT" },
    { key: "payments", label: "PAYMENTS" },
    { key: "prcFullPayment", label: "PRC_FULL_PAYMENT" },
  ] as const;

  const correlationData = correlationVars.flatMap((xVar) =>
    correlationVars.map((yVar) => ({
      x: xVar.label,
      y: yVar.label,
      value: pearsonCorrelation(
        allCustomersForCharts.map((c) => c[xVar.key] ?? 0),
        allCustomersForCharts.map((c) => c[yVar.key] ?? 0)
      ),
    }))
  );

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Visão geral da base e do modelo ativo.</p>
      </header>

      <DashboardFilters
        key={JSON.stringify(resolvedSearchParams)}
        allSegments={allSegments}
        searchParams={resolvedSearchParams}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total de clientes</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatNumber(customerCount)}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Segmentos</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatNumber(segmentCount.length)}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Saldo médio</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(agg._avg.balance ?? 0)}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Compras médias</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(agg._avg.purchases ?? 0)}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">% Cash Advance</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {customerCount > 0 ? formatPercent(cashAdvanceUsers / customerCount) : "0%"}
          </p>
        </article>
      </div>

      {!clusterRun ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          Segmentação ainda não gerada. Execute a camada de ML (`python -m analysis.scripts.run_clustering`).
        </p>
      ) : (
        <ModelQualityPanel
          algorithm={clusterRun.algorithm}
          modelVersion={clusterRun.modelVersion}
          nClusters={clusterRun.nClusters}
          silhouette={clusterRun.silhouette}
          daviesBouldin={clusterRun.daviesBouldin}
          calinskiHarabasz={clusterRun.calinskiHarabasz}
          inertia={clusterRun.inertia}
          usedAutoencoder={clusterRun.usedAutoencoder}
          trainedAt={clusterRun.trainedAt.toISOString()}
        />
      )}

      <section className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resumo de segmentos</h2>
          <Link href="/insights" className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-400">
            Ver insights
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topSegments.map((segment) => (
            <article key={segment.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="mb-2">
                <SegmentBadge label={segment.label} />
              </div>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{formatNumber(segment.customerCount)}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{formatPercent(segment.sharePct / 100)}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <PcaScatter data={pcaPoints} />
        <DonutChart
          data={topSegments.map((s) => ({ label: s.label, value: s.customerCount }))}
          title="Distribuição por segmento"
        />
        <Histogram data={balanceHistogram} title="Histograma de saldo" />
        <Histogram data={creditLimitHistogram} title="Histograma de limite de crédito" />
        <ScatterPlot data={balanceVsLimitData} title="Saldo vs. Limite de crédito" xLabel="Saldo" yLabel="Limite" />
        <ScatterPlot data={cashAdvanceVsBalanceData} title="Cash Advance vs. Saldo" xLabel="Cash Advance" yLabel="Saldo" />
        <DonutChart data={purchaseTypeData} title="Compras: À vista vs. Parcelado" />
        <DonutChart data={fullPaymentData} title="Pagamento de fatura" />
        <FrequencyBars data={frequencyBuckets} title="Frequência de compras" />
        <SegmentRadar data={radarData} title="Comparação de médias por segmento" segments={segments} />
        <Heatmap data={correlationData} title="Heatmap de correlação" />
      </div>
    </section>
  );
}
