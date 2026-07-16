import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    customer: {
      count: vi.fn().mockResolvedValue(1),
      findMany: vi.fn().mockResolvedValue([
        {
          id: "c1",
          custId: "C10001",
          balance: 120,
          purchases: 80,
          cashAdvance: 0,
          creditLimit: 1000,
          payments: 50,
          prcFullPayment: 0.2,
          tenure: 12,
          segmentLabel: "Devedor Rotativo",
        },
      ]),
    },
  },
}));

import { GET } from "@/app/api/customers/route";

describe("api/customers", () => {
  it("retorna clientes paginados", async () => {
    const request = new Request("http://localhost/api/customers?page=1&pageSize=25");
    const response = await GET(request);
    const body = (await response.json()) as { total: number; data: Array<{ custId: string }> };

    expect(response.status).toBe(200);
    expect(body.total).toBe(1);
    expect(body.data[0]?.custId).toBe("C10001");
  });
});
