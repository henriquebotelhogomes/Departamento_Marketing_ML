import { describe, expect, it } from "vitest";

import { getRecommendations } from "@/lib/segments/recommendations";

describe("segments/recommendations", () => {
  it("retorna recomendações base para comprador ativo", () => {
    const recs = getRecommendations({ label: "Comprador Ativo" });
    expect(recs).toContain("cashback");
  });

  it("adiciona regra de cross-sell por pagamento alto", () => {
    const recs = getRecommendations({ label: "Bom Pagador", prcFullPayment: 0.9 });
    expect(recs).toContain("oferta de cross-sell");
  });

  it("adiciona monitoramento reforçado para alta frequência de cash advance", () => {
    const recs = getRecommendations({
      label: "Usuário de Adiantamento",
      cashAdvanceFrequency: 0.7,
    });
    expect(recs).toContain("monitoramento de risco reforçado");
  });

  it("usa fallback para label desconhecido", () => {
    const recs = getRecommendations({ label: "Outro" });
    expect(recs).toContain("análise manual do segmento");
  });
});
