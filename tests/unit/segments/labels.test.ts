import { describe, expect, it } from "vitest";

import { getSegmentColor, normalizeSegmentLabel } from "@/lib/segments/labels";

describe("segments/labels", () => {
  it("retorna cor correta para label conhecido", () => {
    expect(getSegmentColor("Bom Pagador")).toBe("#16A34A");
  });

  it("retorna cor fallback para label desconhecido", () => {
    expect(getSegmentColor("Inexistente")).toBe("#6B7280");
  });

  it("retorna cor fallback para null", () => {
    expect(getSegmentColor(null)).toBe("#6B7280");
  });

  it("normaliza label vazio", () => {
    expect(normalizeSegmentLabel("   ")).toBe("Não classificado");
  });

  it("mantem label valido apos trim", () => {
    expect(normalizeSegmentLabel("  Bom Pagador  ")).toBe("Bom Pagador");
  });
});
