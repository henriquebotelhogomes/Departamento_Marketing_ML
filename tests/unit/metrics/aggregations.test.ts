import { describe, expect, it } from "vitest";

import { aggregateMetrics } from "@/lib/metrics/aggregations";

describe("metrics/aggregations", () => {
  it("agrega metricas corretamente", () => {
    const result = aggregateMetrics([
      {
        balance: 100,
        purchases: 50,
        creditLimit: 1000,
        payments: 30,
        prcFullPayment: 0.2,
        tenure: 10,
        cashAdvance: 0,
      },
      {
        balance: 200,
        purchases: 100,
        creditLimit: 2000,
        payments: 60,
        prcFullPayment: 0.6,
        tenure: 12,
        cashAdvance: 100,
      },
    ]);

    expect(result.totalCustomers).toBe(2);
    expect(result.avgBalance).toBe(150);
    expect(result.cashAdvanceUsersPct).toBe(0.5);
  });

  it("retorna zeros quando nao ha linhas", () => {
    const result = aggregateMetrics([]);
    expect(result.totalCustomers).toBe(0);
    expect(result.avgBalance).toBe(0);
  });
});
