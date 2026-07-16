import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });

  if (!customer) {
    return NextResponse.json({ error: { message: "Cliente não encontrado", code: "NOT_FOUND" } }, { status: 404 });
  }

  let segment = null;
  if (customer.clusterId != null && customer.modelVersion != null) {
    segment = await prisma.segment.findUnique({
      where: {
        modelVersion_clusterId: {
          modelVersion: customer.modelVersion,
          clusterId: customer.clusterId,
        },
      },
    });
  }

  const overallAgg = await prisma.customer.aggregate({
    _avg: { balance: true, purchases: true, cashAdvance: true, creditLimit: true, prcFullPayment: true },
  });

  const segmentAgg = customer.clusterId != null
    ? await prisma.customer.aggregate({
        where: { clusterId: customer.clusterId },
        _avg: { balance: true, purchases: true, cashAdvance: true, creditLimit: true, prcFullPayment: true },
      })
    : null;

  const features = ["balance", "purchases", "cashAdvance", "creditLimit", "prcFullPayment"] as const;
  const comparison = features.map((feature) => ({
    feature: feature.toUpperCase(),
    customer: customer[feature],
    segmentAvg: segmentAgg?._avg[feature] ?? 0,
    overallAvg: overallAgg._avg[feature] ?? 0,
  }));

  return NextResponse.json({ customer, segment, comparison });
}
