import { NextResponse } from "next/server";

import { pearsonCorrelation } from "@/lib/metrics/correlations";
import { prisma } from "@/lib/prisma";

export async function GET(request?: Request): Promise<Response> {
  const searchParams = request ? new URL(request.url).searchParams : new URLSearchParams();
  const segment = searchParams.get("segment");
  const minBalance = Number(searchParams.get("minBalance") ?? "");
  const maxBalance = Number(searchParams.get("maxBalance") ?? "");
  const minPurchases = Number(searchParams.get("minPurchases") ?? "");
  const maxPurchases = Number(searchParams.get("maxPurchases") ?? "");
  const minCreditLimit = Number(searchParams.get("minCreditLimit") ?? "");
  const maxCreditLimit = Number(searchParams.get("maxCreditLimit") ?? "");
  const tenure = searchParams.get("tenure");
  const minPrcFullPayment = Number(searchParams.get("prcFullPaymentMin") ?? "");
  const maxPrcFullPayment = Number(searchParams.get("prcFullPaymentMax") ?? "");

  const where = {
    ...(segment ? { segmentLabel: segment } : {}),
    ...(Number.isFinite(minBalance) || Number.isFinite(maxBalance)
      ? {
          balance: {
            ...(Number.isFinite(minBalance) ? { gte: minBalance } : {}),
            ...(Number.isFinite(maxBalance) ? { lte: maxBalance } : {}),
          },
        }
      : {}),
    ...(Number.isFinite(minPurchases) || Number.isFinite(maxPurchases)
      ? {
          purchases: {
            ...(Number.isFinite(minPurchases) ? { gte: minPurchases } : {}),
            ...(Number.isFinite(maxPurchases) ? { lte: maxPurchases } : {}),
          },
        }
      : {}),
    ...(Number.isFinite(minCreditLimit) || Number.isFinite(maxCreditLimit)
      ? {
          creditLimit: {
            ...(Number.isFinite(minCreditLimit) ? { gte: minCreditLimit } : {}),
            ...(Number.isFinite(maxCreditLimit) ? { lte: maxCreditLimit } : {}),
          },
        }
      : {}),
    ...(tenure ? { tenure: Number(tenure) } : {}),
    ...(Number.isFinite(minPrcFullPayment) || Number.isFinite(maxPrcFullPayment)
      ? {
          prcFullPayment: {
            ...(Number.isFinite(minPrcFullPayment) ? { gte: minPrcFullPayment } : {}),
            ...(Number.isFinite(maxPrcFullPayment) ? { lte: maxPrcFullPayment } : {}),
          },
        }
      : {}),
  };

  const [totalCustomers, nSegments, agg, cashAdvanceUsers, customers] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.groupBy({ by: ["clusterId"], where: { ...where, clusterId: { not: null } } }),
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
    prisma.customer.count({ where: { ...where, cashAdvance: { gt: 0 } } }),
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
        prcFullPayment: true,
      },
    }),
  ]);

  const ranges = [0, 2000, 4000, 6000, 8000, 10000];
  const balanceHistogram = ranges.map((start, index) => {
    const end = ranges[index + 1];
    const count = customers.filter((c) => {
      if (end == null) return c.balance >= start;
      return c.balance >= start && c.balance < end;
    }).length;
    return { bucket: end == null ? `${start}+` : `${start}-${end}`, count };
  });

  const creditLimitHistogram = ranges.map((start, index) => {
    const end = ranges[index + 1];
    const count = customers.filter((c) => {
      const limit = c.creditLimit ?? 0;
      if (end == null) return limit >= start;
      return limit >= start && limit < end;
    }).length;
    return { bucket: end == null ? `${start}+` : `${start}-${end}`, count };
  });

  const totalOneoff = customers.reduce((sum, c) => sum + c.oneoffPurchases, 0);
  const totalInstallments = customers.reduce((sum, c) => sum + c.installmentsPurchases, 0);
  const totalPurchases = totalOneoff + totalInstallments;
  const purchaseTypeSplit = {
    oneoff: totalPurchases > 0 ? totalOneoff / totalPurchases : 0,
    installments: totalPurchases > 0 ? totalInstallments / totalPurchases : 0,
  };

  const frequencyBuckets = [
    { bucket: "Nunca", count: customers.filter((c) => c.purchasesFrequency === 0).length },
    { bucket: "Baixa", count: customers.filter((c) => c.purchasesFrequency > 0 && c.purchasesFrequency < 0.25).length },
    { bucket: "Média", count: customers.filter((c) => c.purchasesFrequency >= 0.25 && c.purchasesFrequency < 0.75).length },
    { bucket: "Alta", count: customers.filter((c) => c.purchasesFrequency >= 0.75).length },
  ];

  const fullPaymentSplit = {
    integral: customers.filter((c) => c.prcFullPayment >= 0.95).length,
    parcial: customers.filter((c) => c.prcFullPayment < 0.95).length,
  };

  const vars = ["BALANCE", "PURCHASES", "CASH_ADVANCE", "CREDIT_LIMIT", "PAYMENTS", "PRC_FULL_PAYMENT"] as const;
  const dataMap: Record<string, number[]> = {
    BALANCE: customers.map((c) => c.balance),
    PURCHASES: customers.map((c) => c.purchases),
    CASH_ADVANCE: customers.map((c) => c.cashAdvance),
    CREDIT_LIMIT: customers.map((c) => c.creditLimit ?? 0),
    PAYMENTS: customers.map((c) => c.payments),
    PRC_FULL_PAYMENT: customers.map((c) => c.prcFullPayment),
  };

  const correlationMatrix = vars.flatMap((x) =>
    vars.map((y) => ({
      x,
      y,
      value: pearsonCorrelation(dataMap[x] ?? [], dataMap[y] ?? []),
    }))
  );

  const metrics = {
    kpis: {
      totalCustomers,
      numSegments: nSegments.length,
      avgBalance: agg._avg.balance ?? 0,
      avgPurchases: agg._avg.purchases ?? 0,
      avgCreditLimit: agg._avg.creditLimit ?? 0,
      avgPayments: agg._avg.payments ?? 0,
      avgPrcFullPayment: agg._avg.prcFullPayment ?? 0,
      avgTenure: agg._avg.tenure ?? 0,
      cashAdvanceUsersPct: totalCustomers > 0 ? cashAdvanceUsers / totalCustomers : 0,
    },
    charts: {
      balanceHistogram,
      creditLimitHistogram,
      purchaseTypeSplit,
      purchasesFrequencyBuckets: frequencyBuckets,
      fullPaymentSplit,
      correlationMatrix,
    },
    hasSegmentation: nSegments.length > 0,
  };

  return NextResponse.json(metrics);
}
