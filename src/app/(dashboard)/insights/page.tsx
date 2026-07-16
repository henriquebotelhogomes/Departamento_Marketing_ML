import { prisma } from "@/lib/prisma";
import { formatCurrency, formatPercent } from "@/lib/utils";

import { PcaScatter } from "@/components/charts/pca-scatter";

export default async function InsightsPage() {
  const [segments, pcaSample, customers] = await Promise.all([
    prisma.segment.findMany({ orderBy: { customerCount: "desc" } }),
    prisma.customer.findMany({
      where: { pca1: { not: null }, pca2: { not: null } },
      select: { pca1: true, pca2: true, segmentLabel: true },
      take: 500,
    }),
    prisma.customer.findMany({
      select: {
        oneoffPurchases: true,
        installmentsPurchases: true,
        purchases: true,
        segmentLabel: true,
      },
    }),
  ]);

  if (segments.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Insights</h1>
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          Segmentação ainda não gerada. Execute `python -m analysis.scripts.run_clustering`.
        </p>
      </section>
    );
  }

  const largest = segments[0];
  const highestBalance = [...segments].sort((a, b) => b.avgBalance - a.avgBalance)[0];
  const highestAdvance = [...segments].sort((a, b) => b.avgCashAdvance - a.avgCashAdvance)[0];
  const bestPayer = [...segments].sort((a, b) => b.avgPrcFullPayment - a.avgPrcFullPayment)[0];
  const highestLimit = [...segments].sort((a, b) => b.avgCreditLimit - a.avgCreditLimit)[0];
  const lowestLimit = [...segments].sort((a, b) => a.avgCreditLimit - b.avgCreditLimit)[0];

  const totalOneoff = customers.reduce((sum, c) => sum + c.oneoffPurchases, 0);
  const totalInstallments = customers.reduce((sum, c) => sum + c.installmentsPurchases, 0);
  const oneoffPct = totalOneoff + totalInstallments > 0 ? totalOneoff / (totalOneoff + totalInstallments) : 0;

  const topBuyers = [...customers].sort((a, b) => b.purchases - a.purchases).slice(0, Math.ceil(customers.length * 0.2));
  const topBuyersVolume = topBuyers.reduce((sum, c) => sum + c.purchases, 0);
  const totalVolume = customers.reduce((sum, c) => sum + c.purchases, 0);
  const concentrationPct = totalVolume > 0 ? topBuyersVolume / totalVolume : 0;

  const pcaPoints = pcaSample.map((item) => ({
    pca1: item.pca1 ?? 0,
    pca2: item.pca2 ?? 0,
    segmentLabel: item.segmentLabel ?? "Não classificado",
  }));

  const insights = [
    {
      title: "Maior segmento da base",
      text: `${largest!.label} concentra ${formatPercent(largest!.sharePct / 100)} da base (${largest!.customerCount.toLocaleString("pt-BR")} clientes).`,
      color: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
    },
    {
      title: "Maior saldo médio devedor",
      text: `${highestBalance!.label} possui o maior saldo médio: ${formatCurrency(highestBalance!.avgBalance)}.`,
      color: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
    },
    {
      title: "Maior uso de adiantamento",
      text: `${highestAdvance!.label} tem o maior uso de adiantamento: ${formatCurrency(highestAdvance!.avgCashAdvance)} em média.`,
      color: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
    },
    {
      title: "Melhor taxa de pagamento",
      text: `${bestPayer!.label} tem a melhor taxa de pagamento integral: ${formatPercent(bestPayer!.avgPrcFullPayment)}.`,
      color: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
    },
    {
      title: "Diferença de limite médio",
      text: `${highestLimit!.label} tem o maior limite médio (${formatCurrency(highestLimit!.avgCreditLimit)}), enquanto ${lowestLimit!.label} tem o menor (${formatCurrency(lowestLimit!.avgCreditLimit)}).`,
      color: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20",
    },
    {
      title: "Compras: À vista vs. Parcelado",
      text: `${formatPercent(oneoffPct)} das compras são à vista e ${formatPercent(1 - oneoffPct)} são parceladas.`,
      color: "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20",
    },
    {
      title: "Concentração de volume de compras",
      text: `Os 20% maiores compradores concentram ${formatPercent(concentrationPct)} do volume total de compras.`,
      color: "border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-900/20",
    },
  ];

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Insights</h1>
        <p className="text-slate-600 dark:text-slate-400">Análise dos segmentos e comportamento da base.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {insights.map((insight) => (
          <article key={insight.title} className={`rounded-lg border p-4 ${insight.color}`}>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{insight.title}</h2>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{insight.text}</p>
          </article>
        ))}
      </div>

      {pcaPoints.length > 0 && (
        <PcaScatter data={pcaPoints} title="Mapa de dispersão PCA dos segmentos" />
      )}
    </section>
  );
}
