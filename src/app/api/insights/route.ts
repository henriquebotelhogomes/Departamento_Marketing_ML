import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  const segments = await prisma.segment.findMany({ orderBy: { customerCount: "desc" } });
  if (segments.length === 0) {
    return NextResponse.json({ insights: [] });
  }

  const largest = segments[0];
  const highestBalance = [...segments].sort((a, b) => b.avgBalance - a.avgBalance)[0];
  const highestAdvance = [...segments].sort((a, b) => b.avgCashAdvance - a.avgCashAdvance)[0];
  const bestPayer = [...segments].sort((a, b) => b.avgPrcFullPayment - a.avgPrcFullPayment)[0];

  if (!largest || !highestBalance || !highestAdvance || !bestPayer) {
    return NextResponse.json({ insights: [] });
  }

  const insights = [
    {
      key: "largest-segment",
      title: "Maior segmento",
      text: `O segmento '${largest.label}' concentra ${largest.sharePct.toFixed(2)}% da base (${largest.customerCount} clientes).`,
      value: largest.sharePct,
    },
    {
      key: "highest-balance",
      title: "Maior saldo médio",
      text: `O segmento '${highestBalance.label}' possui o maior saldo médio da base.`,
      value: highestBalance.avgBalance,
    },
    {
      key: "highest-advance",
      title: "Maior uso de adiantamento",
      text: `O segmento '${highestAdvance.label}' lidera em uso médio de cash advance.`,
      value: highestAdvance.avgCashAdvance,
    },
    {
      key: "best-payer",
      title: "Melhor taxa de pagamento",
      text: `O segmento '${bestPayer.label}' apresenta a maior taxa média de pagamento integral.`,
      value: bestPayer.avgPrcFullPayment,
    },
  ];

  return NextResponse.json({ insights });
}
