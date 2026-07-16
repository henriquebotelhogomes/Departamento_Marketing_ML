import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  const config = await prisma.segmentationConfig.findUnique({ where: { id: "default" } });
  const activeModelVersion = config?.activeModelVersion ?? "v1";

  const [segments, clusterRun] = await Promise.all([
    prisma.segment.findMany({
      where: { modelVersion: activeModelVersion },
      orderBy: { clusterId: "asc" },
    }),
    prisma.clusterRun.findUnique({ where: { modelVersion: activeModelVersion } }),
  ]);

  return NextResponse.json({ activeModelVersion, segments, clusterRun });
}
