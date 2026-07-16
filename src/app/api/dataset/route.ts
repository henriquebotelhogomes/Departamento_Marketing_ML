import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { customerQuerySchema } from "@/lib/validations/customer.schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const parsed = customerQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message ?? "Parametros invalidos",
        },
      },
      { status: 422 },
    );
  }

  const { search, page, pageSize, sortBy, sortOrder } = parsed.data;

  const where = search
    ? {
        custId: {
          contains: search,
        },
      }
    : undefined;

  const [total, data] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    data,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
