import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { settingsPatchSchema } from "@/lib/validations/settings.schema";

export async function GET(): Promise<Response> {
  const config = await prisma.segmentationConfig.findUnique({ where: { id: "default" } });
  const activeModelVersion = config?.activeModelVersion ?? "v1";
  const segments = await prisma.segment.findMany({
    where: { modelVersion: activeModelVersion },
    orderBy: { clusterId: "asc" },
  });
  return NextResponse.json({ activeModelVersion, segments });
}

export async function PATCH(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null);
  const parsed = settingsPatchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message ?? "Dados invalidos",
        },
      },
      { status: 422 },
    );
  }

  const { activeModelVersion, segments } = parsed.data;

  const current = await prisma.segmentationConfig.upsert({
    where: { id: "default" },
    update: activeModelVersion ? { activeModelVersion } : {},
    create: { id: "default", activeModelVersion: activeModelVersion ?? "v1" },
  });

  if (segments?.length) {
    for (const segment of segments) {
      const existing = await prisma.segment.findFirst({
        where: {
          modelVersion: current.activeModelVersion,
          clusterId: segment.clusterId,
        },
      });
      if (!existing) continue;

      await prisma.segment.update({
        where: { id: existing.id },
        data: {
          label: segment.label ?? existing.label,
          description: segment.description ?? existing.description,
          recommendation: segment.recommendation
            ? JSON.stringify(segment.recommendation)
            : existing.recommendation,
        },
      });

      if (segment.label) {
        await prisma.customer.updateMany({
          where: {
            modelVersion: current.activeModelVersion,
            clusterId: segment.clusterId,
          },
          data: { segmentLabel: segment.label },
        });
      }
    }
  }

  const resultSegments = await prisma.segment.findMany({
    where: { modelVersion: current.activeModelVersion },
    orderBy: { clusterId: "asc" },
  });

  return NextResponse.json({
    activeModelVersion: current.activeModelVersion,
    segments: resultSegments,
  });
}
