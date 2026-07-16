import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    customer: {
      count: vi.fn().mockResolvedValue(100),
      groupBy: vi.fn().mockResolvedValue([{ clusterId: 0 }, { clusterId: 1 }]),
      aggregate: vi.fn().mockResolvedValue({
        _avg: {
          balance: 1200,
          purchases: 900,
          creditLimit: 3000,
          payments: 600,
          prcFullPayment: 0.25,
          tenure: 11,
        },
      }),
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

import { GET } from "@/app/api/metrics/route";

describe("api/metrics", () => {
  it("retorna metricas agregadas", async () => {
    const response = await GET();
    const body = (await response.json()) as { kpis: { totalCustomers: number; numSegments: number } };

    expect(response.status).toBe(200);
    expect(body.kpis.totalCustomers).toBe(100);
    expect(body.kpis.numSegments).toBe(2);
  });
});
