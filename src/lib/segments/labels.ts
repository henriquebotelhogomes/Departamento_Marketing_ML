import { SEGMENT_COLORS } from "@/config/constants";

export function getSegmentColor(label: string | null | undefined): string {
  if (!label) return SEGMENT_COLORS.fallback ?? "#6B7280";
  return SEGMENT_COLORS[label] ?? SEGMENT_COLORS.fallback ?? "#6B7280";
}

export function normalizeSegmentLabel(label: string): string {
  const normalized = label.trim();
  if (!normalized) return           "Não classificado";
  return normalized;
}
