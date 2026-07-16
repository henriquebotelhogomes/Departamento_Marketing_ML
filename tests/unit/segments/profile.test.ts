import { describe, expect, it } from "vitest";

import { buildSegmentProfile } from "@/lib/segments/profile";

describe("segments/profile", () => {
  it("retorna mensagem padrao sem features", () => {
    const profile = buildSegmentProfile([]);
    expect(profile).toContain("sem variáveis dominantes");
  });

  it("gera texto de perfil com features dominantes", () => {
    const profile = buildSegmentProfile([
      { feature: "CASH_ADVANCE", direction: "high", zScore: 2 },
      { feature: "PRC_FULL_PAYMENT", direction: "low", zScore: -1.2 },
    ]);

    expect(profile).toContain("CASH_ADVANCE");
    expect(profile).toContain("PRC_FULL_PAYMENT");
  });
});
