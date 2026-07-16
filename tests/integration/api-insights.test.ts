import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    segment: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: "1",
          label: "Devedor Rotativo",
          customerCount: 500,
          sharePct: 50,
          avgBalance: 2500,
          avgCashAdvance: 700,
          avgPrcFullPayment: 0.1,
        },
        {
          id: "2",
          label: "Bom Pagador",
          customerCount: 300,
          sharePct: 30,
          avgBalance: 900,
          avgCashAdvance: 80,
          avgPrcFullPayment: 0.8,
        },
      ]),
    },
  },
}));

import { GET } from "@/app/api/insights/route";

describe("api/insights", () => {
  it("retorna lista de insights", async () => {
    const response = await GET();
    const body = (await response.json()) as { insights: Array<{ key: string }> };

    expect(response.status).toBe(200);
    expect(body.insights.length).toBeGreaterThan(0);
    expect(body.insights[0]?.key).toBe("largest-segment");
  });
});
