type DominantFeature = {
  feature: string;
  direction: "high" | "low";
  zScore: number;
};

export function buildSegmentProfile(features: DominantFeature[]): string {
  if (features.length === 0) {
    return "Segmento sem variáveis dominantes suficientes.";
  }

  const top = features
    .slice(0, 3)
    .map((item) => `${item.feature} (${item.direction === "high" ? "alto" : "baixo"})`)
    .join(", ");

  return `Perfil definido principalmente por: ${top}.`;
}
