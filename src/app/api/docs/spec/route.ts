import { NextResponse } from "next/server";

import spec from "@/config/openapi";

export function GET(): Response {
  return NextResponse.json(spec);
}
