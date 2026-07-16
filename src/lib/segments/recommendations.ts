type RecommendationInput = {
  label: string;
  prcFullPayment?: number | null;
  cashAdvanceFrequency?: number | null;
};

const baseRecommendations: Record<string, string[]> = {
  "Comprador Ativo": ["cashback", "programa de fidelidade", "upgrade de limite"],
  "Devedor Rotativo": ["renegociação", "educação financeira", "parcelamento de saldo"],
  "Usuário de Adiantamento": [
    "monitoramento de risco",
    "alertas proativos",
    "oferta de crédito pessoal",
  ],
  "Bom Pagador": ["upgrade premium", "benefícios exclusivos", "cross-sell"],
};

export function getRecommendations(input: RecommendationInput): string[] {
  const recs = [...(baseRecommendations[input.label] ?? ["análise manual do segmento"])];

  if ((input.prcFullPayment ?? 0) >= 0.75) {
    recs.push("oferta de cross-sell");
  }
  if ((input.cashAdvanceFrequency ?? 0) >= 0.5) {
    recs.push("monitoramento de risco reforçado");
  }

  return Array.from(new Set(recs));
}
